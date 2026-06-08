import { RootStore } from './stores';
// @ts-ignore
import { io, Socket } from 'socket.io-client';
import { action, makeObservable, observable, reaction } from 'mobx';
import { default as api } from '../api/base';
import iStore, { LoadeableStore, ResettableStore } from './iStore';
import {
    ChangedRecord,
    ClientToServerEvents,
    DeletedRecord,
    IoEvent,
    IoEvents,
    NewRecord,
    RecordStoreMap,
    RecordType,
    ServerToClientEvents
} from './IoEventTypes';
import { EVENTS_API } from '../authConfig';
import { Event as EventProps } from '../api/event';
import { authClient, BACKEND_URL } from '../auth-client';
interface Message {
    type: string;
    message: string;
}

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export class SocketDataStore implements ResettableStore, LoadeableStore<void> {
    private readonly root: RootStore;
    abortControllers = new Map<string, AbortController>();
    @observable.ref accessor socket: TypedSocket | undefined;

    messages = observable<Message>([]);

    @observable accessor initialAuthorizedLoadPerformed = false;

    get initialPublicLoadPerformed() {
        return this.initialAuthorizedLoadPerformed;
    }

    get initialLoadPerformed() {
        return this.initialPublicLoadPerformed && this.initialAuthorizedLoadPerformed;
    }

    @observable accessor isLive: boolean = false;

    constructor(root: RootStore) {
        this.root = root;

        reaction(
            () => this.isLive,
            action((isLive) => {
                console.log('Socket.IO live:', isLive);
            })
        );
    }

    createRecord(data: NewRecord<RecordType>) {
        const store = this.root[RecordStoreMap[data.type]] as iStore<any>;
        store?.addToStore(data.record, 'create');
    }

    updateRecord(data: ChangedRecord<RecordType>) {
        const store = this.root[RecordStoreMap[data.type]] as iStore<any>;
        store?.addToStore(data.record, 'load');
    }

    deleteRecord(data: DeletedRecord) {
        if (!data) {
            return;
        }
        const store = this.root[RecordStoreMap[data.type]] as iStore<any>;
        store.removeFromStore(data.id, true);
    }

    _socketConfig(socket: TypedSocket) {
        if (!socket) {
            return;
        }
        socket.on(
            'connect',
            action(() => {
                if (this.socket) {
                    this._disconnect(this.socket);
                }
                /**
                 * add sid to the api headers, so that the api can broadcast messages to
                 * the user except the initiating client.
                 */
                api.defaults.headers.common['x-metadata-sid'] = socket?.id;
                this.socket = socket;
                this.setLiveState(true);
            })
        );

        socket.on(
            'disconnect',
            action((reason) => {
                this.socket = undefined;
                this.setLiveState(false);
                if (reason !== 'io server disconnect' && reason !== 'io client disconnect') {
                    // an error happened, try to reconnect
                    this.reconnect();
                }
            })
        );
        socket.on(
            'connect_error',
            action((err) => {
                console.log('connection error', err);
                // TODO: should we try to connect again in 1s?
            })
        );
        socket.on(IoEvent.NEW_RECORD, this.createRecord.bind(this));
        socket.on(IoEvent.CHANGED_RECORD, this.updateRecord.bind(this));
        socket.on(IoEvent.DELETED_RECORD, this.deleteRecord.bind(this));
    }

    checkEvent(eventId: string, semesterId: string) {
        this.socket?.emit(IoEvents.AffectedLessons, eventId, semesterId, (data) => {
            if (data.state === 'success') {
                this.root.untisStore.addLessons(data.lessons);
            } else {
                console.log('checkEvent', data);
            }
        });
    }
    checkUnpersistedEvent(event: EventProps, semesterId: string) {
        this.socket?.emit(IoEvents.AffectedLessonsTmp, event, semesterId, (data) => {
            if (data.state === 'success') {
                this.root.untisStore.addLessons(data.lessons);
            } else {
                console.log('checkEvent', data);
            }
        });
    }

    @action
    checkLiveState() {
        if (this.socket?.connected) {
            if (!this.isLive) {
                this.setLiveState(true);
            }
            return;
        }
        this.reconnect();
    }
    @action
    reconnect() {
        const socket = this.socket;
        this._disconnect(socket);
        this.setLiveState(false);
        this.connect();
    }

    @action
    disconnect() {
        this._disconnect(this.socket);
        this.setLiveState(false);
    }

    @action
    _disconnect(socket: TypedSocket | undefined) {
        if (socket?.connected) {
            socket.disconnect();
        }
        this.socket = undefined;
    }

    @action
    setLiveState(isLive: boolean) {
        this.isLive = isLive;
    }

    async connect() {
        if (this.socket?.connected) {
            return;
        }

        const { data, error } = await authClient.oneTimeToken.generate().catch((e) => {
            return { data: { token: undefined }, error: e };
        });
        if (error || !data?.token) {
            console.log('cannot get one-time-token', error);
            setTimeout(() => this.connect(), 1000);
            return;
        }
        const ws_url = BACKEND_URL;
        const socket = io(ws_url, {
            autoConnect: false,
            auth: {
                token: data.token
            },
            transports: ['websocket', 'webtransport'],
            reconnection: false
        });

        this._connect(socket);
    }

    @action
    _connect(socket: TypedSocket) {
        this._socketConfig(socket);
        const winSock: { tdevSockets?: Socket[] } = window as any;
        winSock.tdevSockets = (winSock.tdevSockets || []).filter((s: Socket) => s.connected || s.active);
        winSock.tdevSockets.forEach((s: Socket) => s.disconnect());
        socket.connect();
        winSock.tdevSockets.push(socket);
    }

    @action
    resetUserData() {
        this.disconnect();
        api.defaults.headers.common['x-metadata-socketid'] = undefined;
        this.messages.clear();
        this.initialAuthorizedLoadPerformed = false;
    }

    @action
    loadPublic(semesterId?: string) {
        return Promise.resolve();
    }

    @action
    loadAuthorized() {
        if (!this.root.sessionStore.isLoggedIn) {
            return Promise.resolve();
        }
        this.reconnect();
        this.initialAuthorizedLoadPerformed = true;
        return Promise.resolve([]);
    }
}
