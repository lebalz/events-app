import { RootStore } from './stores';
import { io, Socket } from "socket.io-client";
import { action, makeObservable, observable, reaction } from 'mobx';
import { default as api, checkLogin as pingApi, createCancelToken } from '../api/base';
import axios, { CancelTokenSource } from 'axios';
import iStore, { LoadeableStore, ResettableStore } from './iStore';
import { ChangedRecord, IoEvent, RecordStoreMap, RecordTypes } from './IoEventTypes';
import { EVENTS_API } from '../authConfig';
class Message {
    type: string;
    message: string;
}

export class SocketDataStore implements ResettableStore, LoadeableStore<void> {
    private readonly root: RootStore;
    private cancelToken?: CancelTokenSource;
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

    handleReload = (type: IoEvent) => {
        return action((data: string) => {
            const record: ChangedRecord = JSON.parse(data);
            const store = this.root[RecordStoreMap[record.record]] as iStore<any>;
            console.log('handle dgram', type, record.record, store)
            switch (type) {
                case IoEvent.NEW_RECORD:
                    store.loadModel(record.id);
                    break;
                case IoEvent.CHANGED_RECORD:
                    store.loadModel(record.id);
                    break;
                case IoEvent.DELETED_RECORD:
                    store.removeFromStore(record.id);
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
        this.socket.on(IoEvent.NEW_RECORD, (this.handleReload(IoEvent.NEW_RECORD)));
        this.socket.on(IoEvent.CHANGED_RECORD, this.handleReload(IoEvent.CHANGED_RECORD));
        this.socket.on(IoEvent.DELETED_RECORD, this.handleReload(IoEvent.DELETED_RECORD));
    }

    checkLogin() {
        if (this.root.sessionStore.account) {
            const [source, token] = createCancelToken();
            this.cancelToken?.cancel('Another request spawned before this one finished.');
            this.cancelToken = source;
            return pingApi(this.cancelToken)
                .then(({ status }) => {
                    if (status === 200 && !this.isLive) {
                        return true;
                    } else {
                        return false;
                    }
                }).catch((err) => {
                    console.log(err);
                    return false;
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