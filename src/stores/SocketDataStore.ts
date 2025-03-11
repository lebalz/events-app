import { RootStore } from './stores';
// @ts-ignore
import { io, Socket } from 'socket.io-client';
import { action, makeObservable, observable, reaction } from 'mobx';
import { default as api, checkLogin as pingApi } from '../api/base';
import axios from 'axios';
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
interface Message {
    type: string;
    message: string;
}

const withParsedMessage = <T>(fn: (data: T) => void) => {
    return (data: T) => {
        try {
            const parsed = JSON.parse(data as string);
            return fn(parsed as T);
        } catch (e) {
            console.warn('Failed to parse message', e, data);
            return null;
        }
    };
};

export class SocketDataStore implements ResettableStore, LoadeableStore<void> {
    private readonly root: RootStore;
    abortControllers = new Map<string, AbortController>();
    @observable.ref accessor socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;

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

        api.interceptors.response.use(
            (res) => res,
            (error) => {
                if (error.response?.status === 401) {
                    this.disconnect();
                }
                return Promise.reject(error);
            }
        );
        reaction(
            () => this.isLive,
            action((isLive) => {
                console.log('Socket.IO live:', isLive);
            })
        );
    }

    withAbortController<T>(sigId: string, fn: (ct: AbortController) => Promise<T>) {
        const sig = new AbortController();
        if (this.abortControllers.has(sigId)) {
            this.abortControllers.get(sigId).abort();
        }
        this.abortControllers.set(sigId, sig);
        return fn(sig)
            .catch((err) => {
                if (axios.isCancel(err)) {
                    return { data: null };
                }
                throw err;
            })
            .finally(() => {
                if (this.abortControllers.get(sigId) === sig) {
                    this.abortControllers.delete(sigId);
                }
            });
    }

    @action
    reconnect() {
        this.disconnect();
        this.connect();
    }

    @action
    disconnect() {
        if (this.socket?.connected) {
            this.socket.disconnect();
        }
        this.socket = undefined;
        this.setLiveState(false);
    }

    @action
    setLiveState(isLive: boolean) {
        this.isLive = isLive;
    }

    connect() {
        if (this.socket?.connected) {
            return;
        }
        const ws_url = EVENTS_API;
        this.socket = io(ws_url, {
            withCredentials: true,
            transports: ['websocket']
        });
        this._socketConfig();
        this.socket.connect();
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

    _socketConfig() {
        if (!this.socket) {
            return;
        }
        this.socket.on('connect', () => {
            api.defaults.headers.common['x-metadata-socketid'] = this.socket?.id;
            this.setLiveState(true);
        });

        this.socket.on('disconnect', () => {
            console.log('disconnect', this.socket?.id);
            this.setLiveState(false);
        });
        this.socket.on('connect_error', (err) => {
            console.log('connection error', err);
            this.setLiveState(false);
            this.checkLogin().then((reconnect) => {
                if (reconnect) {
                    this.reconnect();
                }
            });
        });
        this.socket.on(IoEvent.NEW_RECORD, this.createRecord.bind(this));
        this.socket.on(IoEvent.CHANGED_RECORD, this.updateRecord.bind(this));
        this.socket.on(IoEvent.DELETED_RECORD, this.deleteRecord.bind(this));
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

    checkLogin() {
        if (this.root.sessionStore.isLoggedIn) {
            return this.withAbortController('ping', (sig) => {
                return pingApi(sig.signal)
                    .then(({ status }) => {
                        if (status === 200 && !this.isLive) {
                            return true;
                        } else {
                            return false;
                        }
                    })
                    .catch((err) => {
                        return false;
                    });
            });
        }
        return Promise.resolve(false);
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
        return this.checkLogin()
            .then((reconnect) => {
                if (reconnect) {
                    this.reconnect();
                }
                return [];
            })
            .finally(
                action(() => {
                    this.initialAuthorizedLoadPerformed = true;
                })
            );
    }
}
