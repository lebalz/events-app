import { RootStore } from './stores';
// @ts-ignore
import { io, Socket } from "socket.io-client";
import { action, makeObservable, observable, reaction } from 'mobx';
import { default as api, checkLogin as pingApi } from '../api/base';
import axios, { CancelTokenSource } from 'axios';
import iStore, { LoadeableStore, ResettableStore } from './iStore';
import { ChangedRecord, ChangedState, IoEvent, RecordStoreMap, ReloadAffectingEvents } from './IoEventTypes';
import { EVENTS_API } from '../authConfig';
import { CheckedUntisLesson } from '../api/untis';
import { Event as EventProps } from '../api/event';
import Semester from '../models/Semester';
interface Message {
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
    initialAuthorizedLoadPerformed = false;

    get initialPublicLoadPerformed() {
        return this.initialAuthorizedLoadPerformed;
    }

    get initialLoadPerformed() {
        return this.initialPublicLoadPerformed && this.initialAuthorizedLoadPerformed
    }

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
            record.ids.forEach((id) => {
                store.loadModel(id);
            });
        })
    };
    handleReloadAffectingEvents = () => {
        return action((data: string) => {
            const record: ReloadAffectingEvents = JSON.parse(data);
            const current = this.root.userStore.current;
            if (current) {
                record.semesterIds.forEach((id) => {
                    const sem = this.root.semesterStore.find<Semester>(id);
                    if (sem) {
                        this.root.userStore.loadAffectedEventIds(current, sem.id);
                    }
                });
            }
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
        this.socket.on(IoEvent.RELOAD_AFFECTING_EVENTS, this.handleReloadAffectingEvents());
    }

    checkEvent(eventId: string, semesterId: string) {
        this.socket?.emit('checkEvent', {event_id: eventId, semester_id: semesterId});
    }
    checkUnpersistedEvent(event: EventProps, semesterId: string) {
        this.socket?.emit('checkUnpersistedEvent', {event: event, semester_id: semesterId});
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
        return this.checkLogin().then((reconnect) => {
            if (reconnect) {
                this.reconnect();
            }
            return []
        }).finally(action(() => {
            this.initialAuthorizedLoadPerformed = true;
        }));
    }

}