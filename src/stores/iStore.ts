import { RootStore } from "./stores";

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


class iStore<T> extends ResettableStore implements LoadeableStore<T> {
    load(): Promise<T[] | T> {
        /**
         * Load the data from the api
         */
        throw new Error('Not implemented');
    }
}

export default iStore;