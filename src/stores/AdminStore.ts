import { action, observable } from 'mobx';
import _ from 'es-toolkit/compat';
import axios, { HttpStatusCode } from 'axios';
import { RootStore } from './stores';
import User from '../models/User';
import { authClient } from '../auth-client';
import { linkUserPassword, revokeUserPassword } from '../api/admin';
import { ApiState } from './iStore';

const API_STATE_RESET_TIMEOUT = 1500;

export class AdminStore {
    readonly root: RootStore;
    abortControllers = new Map<string, AbortController>();
    apiState = observable.map<string, ApiState>();

    constructor(root: RootStore) {
        this.root = root;
    }

    abortRequest(sigId: string, skipReset: boolean = false) {
        if (this.abortControllers.has(sigId)) {
            this.abortControllers.get(sigId)?.abort();
        }
        this.abortControllers.delete(sigId);
        if (!skipReset) {
            this.apiState.delete(sigId);
        }
    }

    withAbortController<T>(sigId: string, fn: (ct: AbortController) => Promise<T>) {
        const sig = new AbortController();
        this.abortRequest(sigId, true);
        this.abortControllers.set(sigId, sig);
        this.apiState.set(sigId, ApiState.LOADING);
        return fn(sig)
            .then(
                action((res) => {
                    this.apiState.set(sigId, ApiState.SUCCESS);
                    return res;
                })
            )
            .catch(
                action((err) => {
                    if (axios.isCancel(err)) {
                        return { data: null } as T;
                    } else {
                        this.apiState.set(sigId, ApiState.ERROR);
                    }
                    throw err;
                })
            )
            .finally(() => {
                if (this.abortControllers.get(sigId) === sig) {
                    this.abortControllers.delete(sigId);
                }
                setTimeout(
                    action(() => {
                        if (this && !this.abortControllers.has(sigId)) {
                            this.apiState.delete(sigId);
                        }
                    }),
                    API_STATE_RESET_TIMEOUT
                );
            });
    }

    @action
    setUserPassword(userId: string, newPassword: string) {
        if (!this.root.userStore.current?.isAdmin) {
            return Promise.reject(new Error('Not authorized'));
        }
        const user = this.root.userStore.find<User>(userId);
        if (user && user.hasEmailPasswordAuth) {
            return authClient.admin
                .setUserPassword({
                    userId: userId,
                    newPassword: newPassword
                })
                .then((res) => {
                    if (res.data) {
                        return { success: true, id: userId };
                    }
                    return { success: false, id: userId, reason: res.error?.message || 'Unbekannter Fehler' };
                })
                .catch((err) => {
                    return { success: false, id: userId, reason: err.message || 'Unbekannter Fehler' };
                });
        }
        return this.withAbortController(`set-user-pw-${userId}`, async (ct) => {
            return linkUserPassword(userId, newPassword, ct.signal);
        })
            .then((res) => {
                if (res.status === HttpStatusCode.Created) {
                    return { success: true, id: userId };
                }
                return { success: false, id: userId, reason: 'Unbekannter Fehler' };
            })
            .catch((err) => {
                return { success: false, id: userId, reason: err.message || 'Unbekannter Fehler' };
            });
    }

    @action
    revokeUserPassword(userId: string) {
        if (!this.root.userStore.current?.isAdmin) {
            return Promise.reject(new Error('Not authorized'));
        }
        return this.withAbortController(`revoke-user-pw-${userId}`, async (ct) => {
            return revokeUserPassword(userId, ct.signal);
        });
    }
}
