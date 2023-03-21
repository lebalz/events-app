import { action, IObservableArray } from "mobx";
import ApiModel from "../models/ApiModel";
import { all as apiAll, find as apiFind, create as apiCreate, destroy as apiDestroy, update as apiUpdat } from '../api/api_model';
import { RootStore } from "./stores";
import { computedFn } from "mobx-utils";
import axios from "axios";

export class ResettableStore {
    reset() {
        /**
         * Reset the store to its initial state
         */
        throw new Error('Not implemented');
    }
}

export class LoadeableStore<T> {
    load(): Promise<T | T[]> {
        /**
         * Load the data from the api
         */
        throw new Error('Not implemented');
    }
}


abstract class iStore<T extends { id: string }> extends ResettableStore implements LoadeableStore<any> {
    abstract readonly root: RootStore;
    abstract readonly API_ENDPOINT: string;
    abstract models: IObservableArray<ApiModel<T>>;
    abortControllers = new Map<string, AbortController>();

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

    abstract createModel(data: T): ApiModel<T>;

    find = computedFn(
        function <K extends ApiModel<T>>(this: iStore<T>, id?: string): K | undefined {
            if (!id) {
                return;
            }
            return this.models.find((d) => d.id === id) as K;
        },
        { keepAlive: true }
    )

    @action
    addToStore(data: T): ApiModel<T> {
        /**
         * Adds a new model to the store. Existing models with the same id are replaced.
         */
        const model = this.createModel(data);
        this.removeFromStore(model.id);
        this.models.push(model);
        return model;
    }

    @action
    removeFromStore(id: string): ApiModel<T> | undefined {
        /**
         * Removes the model to the store
         */
        const old = this.find(id);
        if (old) {
            this.models.remove(old);
        }
        return old as ApiModel<T>;
    }


    @action
    load(): Promise<any> {
        return this.withAbortController('loadAll', (sig) => {
            return apiAll<T>(`${this.API_ENDPOINT}/all`, sig.signal)
                .then(
                    action(({ data }) => {
                        if (data) {
                            this.models.replace(data.map((d) => this.createModel(d)));
                        }
                        return this.models;
                    })
                );
        });

    }


    @action
    reset() {
        this.models.clear();
    }


    @action
    loadModel(id: string) {
        return this.withAbortController(`load-${id}`, (sig) => {
            return apiFind<T>(`${this.API_ENDPOINT}/${id}`, sig.signal);
        }).then(action(({ data }) => {
            if (data) {
                this.addToStore(data);
            }
        }));
    }

    @action
    save(model: ApiModel<T>) {
        if (model.isDirty) {
            const { id } = model;
            return this.withAbortController(`save-${id}`, (sig) => {
                return apiUpdat<T>(`${this.API_ENDPOINT}/${id}`, model.props, sig.signal);
            }).then(action(({ data }) => {
                if (data) {
                    this.addToStore(data);
                }
            }));
        }
        return Promise.resolve(undefined);
    }

    @action
    destroy(model: ApiModel<T>) {
        const { id } = model;
        this.withAbortController(`destroy-${id}`, (sig) => {
            return apiDestroy<T>(`${this.API_ENDPOINT}/${id}`, sig.signal);
        }).then(action(() => {
            this.removeFromStore(id);
        }));
    }

    @action
    create(model: Partial<T>) {
        /**
         * Save the model to the api
         */
        const { id } = model;
        this.withAbortController(`destroy-${id}`, (sig) => {
            return apiCreate<T>(this.API_ENDPOINT, model, sig.signal);
        }).then(action(({ data }) => {
            this.addToStore(data);
        }));
    }

}

export default iStore;