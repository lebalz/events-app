import { RootStore } from './stores';
// @ts-ignore
import { io, Socket } from "socket.io-client";
import { action, makeObservable, observable, reaction } from 'mobx';
import { default as api, checkLogin as pingApi } from '../api/base';
import axios, { CancelTokenSource } from 'axios';
import iStore, { LoadeableStore, ResettableStore } from './iStore';
import { ChangedRecord, ChangedState, IoEvent, RecordStoreMap, RecordTypes } from './IoEventTypes';
import { EVENTS_API } from '../authConfig';
import { CheckedUntisLesson, UntisLesson } from '../api/untis';
import { EventState, Event as EventProps } from '../api/event';
import { Role } from '../api/user';
class Message {
    type: string;
    message: string;
}

export class SocketDataStore implements ResettableStore, LoadeableStore<void> {
    private readonly root: RootStore;
    private cancelToken?: CancelTokenSource;
    abortControllers = new Map<string, AbortController>();
    @observable.ref
    socket?: Socket;

    messages = observable<Message>([]);


    @observable
    isLive: boolean = false;

    constructor(root: RootStore) {
        this.root = root;
        makeObservable(this);

        api.interceptors.response.use(
            res => res,
            error => {
                if (error.response?.status === 401) {
                    this.disconnect();
                }
                return Promise.reject(error);
            }
        );
        reaction(
            () => this.isLive,
            (isLive) => {
                console.log('Socket.IO live:', isLive)
            }
        );
    }

    withAbortController<T>(sigId: string, fn: (ct: AbortController) => Promise<T>) {
        const sig = new AbortController();
        if (this.abortControllers.has(sigId)) {
            this.abortControllers.get(sigId).abort();
        }
        this.abortControllers.set(sigId, sig);
        return fn(sig).catch((err) => {
            if (axios.isCancel(err)) {
                return { data: null };
            }
            throw err;
        }).finally(() => {
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
            transports: ['websocket'],
        });
        this._socketConfig();
        this.socket.connect();
    }


    handleEventStateChange = () => {
        return action((data: string) => {
            const record: ChangedState = JSON.parse(data);
            const store = this.root.eventStore;
            if (record.ids.length > 20) {
                return store.load();
            }
            record.ids.forEach((id) => {
                store.loadModel(id);
            });
        })
    };

    handleReload = (type: IoEvent) => {
        return action((data: string) => {
            const record: ChangedRecord = JSON.parse(data);
            const store = this.root[RecordStoreMap[record.record]] as iStore<any>;
            switch (type) {
                case IoEvent.NEW_RECORD:
                    store.loadModel(record.id).then((model) => {
                        if (record.record === 'USER_EVENT_GROUP') {
                            console.log(model);
                            this.root.userEventGroupStore.reloadEvents(model);
                        }
                    });
                    break;
                case IoEvent.CHANGED_RECORD:
                    store.loadModel(record.id);
                    break;
                case IoEvent.DELETED_RECORD:
                    // store.removeFromStore(record.id);
                    store.loadModel(record.id);
                    break;
            }
        })
    };

    _socketConfig() {
        if (!this.socket) {
            return;
        }
        this.socket.on('connect', () => {
            api.defaults.headers.common['x-metadata-socketid'] = this.socket.id;
            this.setLiveState(true);
        });

        this.socket.on('disconnect', () => {
            console.log('disconnect', this.socket.id);
            this.setLiveState(false);
        });
        this.socket.on('connect_error', (err) => {
            console.log('connection error', err);
            this.setLiveState(false);
            this.checkLogin().then((reconnect) => {
                if (reconnect) {
                    this.reconnect();
                }
            })
        });
        this.socket.on('checkEvent', (data: { state: 'success' | 'error', result: CheckedUntisLesson[]}) => {
            if (data.state === 'success') {
                this.root.untisStore.addLessons(data.result);
            } else {
                console.log('checkEvent', data);
            }
        });
        this.socket.on(IoEvent.NEW_RECORD, (this.handleReload(IoEvent.NEW_RECORD)));
        this.socket.on(IoEvent.CHANGED_RECORD, this.handleReload(IoEvent.CHANGED_RECORD));
        this.socket.on(IoEvent.DELETED_RECORD, this.handleReload(IoEvent.DELETED_RECORD));
        this.socket.on(IoEvent.CHANGED_STATE, this.handleEventStateChange());
    }

    checkEvent(eventId: string) {
        this.socket?.emit('checkEvent', {event_id: eventId});
    }
    checkUnpersistedEvent(event: EventProps) {
        this.socket?.emit('checkUnpersistedEvent', {event: event});
    }

    checkLogin() {
        if (this.root.sessionStore.account) {
            return this.withAbortController('ping', (sig) => {
                return pingApi(sig.signal)
                    .then(({ status }) => {
                        if (status === 200 && !this.isLive) {
                            return true;
                        } else {
                            return false;
                        }
                    }).catch((err) => {
                        return false;
                    });
            });
        }
        return Promise.resolve(false);
    }

    @action
    echo() {
        this.socket?.emit('echo', 'Hello');
    }

    @action
    reset() {
        this.disconnect();
        api.defaults.headers.common['x-metadata-socketid'] = undefined;
        this.messages.clear();
    }

    @action
    load() {
        return this.checkLogin().then((reconnect) => {
            if (reconnect) {
                this.reconnect();
            }
            return []
        })
    }

}