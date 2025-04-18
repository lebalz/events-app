import { UntisTeacher } from '@site/src/api/untis';
import { User } from '@site/src/api/user';
import { Primitive } from 'utility-types';

export type PersistedData = {
    user?: User;
    teacher?: UntisTeacher;
};

export enum StorageKey {
    SessionStore = 'SessionStore',
    ColorPrefs = 'ColorPrefs',
    EventGroupCollection = 'docusaurus.tab.EventGroup.Collection',
    PreferenceEventAudienceInfoShow = 'preference.event.audience.info.show',
    PreferenceEventTeachingAffectedExampleShow = 'preference.event.teachingAffected.example.show'
}

/**
 * @see https://github.com/outline/outline/blob/main/shared/utils/Storage.ts
 * Storage is a wrapper class for localStorage that allow safe usage when
 * localStorage is not available.
 */
class Storage {
    interface: typeof localStorage | MemoryStorage;

    public constructor() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            this.interface = localStorage;
        } catch (_err) {
            this.interface = new MemoryStorage();
        }
    }

    /**
     * Set a value in storage. For efficiency, this method will remove the
     * value if it is undefined.
     *
     * @param key The key to set under.
     * @param value The value to set
     */
    public set<T>(key: string, value: T, transformer: (val: T) => string = (val) => JSON.stringify(val)) {
        try {
            if (value === undefined) {
                this.remove(key);
            } else {
                this.interface.setItem(key, transformer(value));
            }
        } catch (_err) {
            // Ignore errors
        }
    }

    /**
     * Sets a value in the storage asynchronous.
     * @param key The key to set under.
     * @param value The value to set
     */
    public sync<T>(key: string, value: T, transformer?: (val: T) => string) {
        setTimeout(() => {
            this.set(key, value, transformer);
        }, 0);
    }

    /**
     * Get a value from storage.
     *
     * @param key The key to get.
     * @param fallback The fallback value if the key doesn't exist.
     * @returns The value or undefined if it doesn't exist.
     */
    public get<T>(
        key: StorageKey,
        fallback?: T,
        transformer: (raw: string) => T = (raw) => JSON.parse(raw)
    ): T {
        try {
            const value = this.interface.getItem(key);
            if (typeof value === 'string') {
                return transformer(value);
            }
        } catch (_err) {
            // Ignore errors
        }

        return fallback;
    }

    /**
     * Remove a value from storage.
     *
     * @param key The key to remove.
     */
    public remove(key: string) {
        try {
            this.interface.removeItem(key);
        } catch (_err) {
            // Ignore errors
        }
    }
}

/**
 * MemoryStorage is a simple in-memory storage implementation that is used
 * when localStorage is not available.
 */
class MemoryStorage {
    private data = {};

    getItem(key: string) {
        return this.data[key] || null;
    }

    setItem(key: string, value: Primitive) {
        return (this.data[key] = String(value));
    }

    syncItem(key: string, value: Primitive) {
        return this.setItem(key, value);
    }

    removeItem(key: string) {
        return delete this.data[key];
    }

    clear() {
        return (this.data = {});
    }
}

export default new Storage();
