import { RootStore } from './stores';
import { io, Socket } from "socket.io-client";
import { action, makeObservable, observable, reaction } from 'mobx';
import { default as api, checkLogin as pingApi } from '../api/base';
import axios from 'axios';
const WS_PORT = process.env.NODE_ENV === 'production' ? '' : ':3002';


export class SocketDataStore {
    private readonly root: RootStore;
    @observable.ref
    socket?: Socket;

    @observable
    isLive: boolean = false;

    cancelToken = axios.CancelToken.source();
    constructor(root: RootStore) {
        this.root = root;
        makeObservable(this);

        api.interceptors.response.use(
            res => res,
            error => {
                if (error.response.status === 401) {
                    this.disconnect();
                }
                return Promise.reject(error);
            }
        );

        reaction(
            () => this.root.msalStore.account,
            (account) => {
                this.checkLogin().then((live) => {
                    if (live) {
                        this.connect();
                    }
                })
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
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const ws_url = `${protocol}://${window.location.hostname}${WS_PORT}`;
        this.socket = io(ws_url, {
            withCredentials: true,
        });
        this._socketConfig();
        this.socket.connect();
    }

    _socketConfig() {
        if (!this.socket) {
            return;
        }
        this.socket.on('connect', () => {
            console.log(this.socket.id);
            this.setLiveState(true);
        });

        this.socket.on('disconnect', () => {
            console.log(this.socket.id);
            this.setLiveState(false);
        });
        this.socket.on('connect_error', (err) => {
            console.log('connection error', err);
            this.setLiveState(false);
            this.checkLogin()
        });

        this.socket.onAny((eventName, ...args) => {
            console.log(eventName, args);
        });
    }

    checkLogin() {
        if (this.root.msalStore.account) {
            return this.root.msalStore.withToken().then((ok) => {
                if (ok) {
                    this.cancelToken.cancel();
                    this.cancelToken = axios.CancelToken.source();
                    return pingApi(this.cancelToken)
                        .then(
                            action(({ status }) => {
                                if (status === 200) {
                                    // this.isLive = true;
                                    return true;
                                } else {
                                    // this.isLive = false;
                                    return false;
                                }
                            })
                        )
                        .catch((err) => {
                            console.log(err);
                            return false;
                        });
                }
                return Promise.resolve(false);
            });
        }
        return Promise.resolve(false);
    }

    @action
    echo() {
        this.socket?.emit('echo', 'Hello');
    }

}