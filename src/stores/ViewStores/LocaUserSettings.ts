import { action, computed, observable } from 'mobx';
import { ViewStore } from '.';
import Storage, { StorageKey } from '../utils/Storage';

class LocalUserSettings {
    private readonly store: ViewStore;
    private readonly localStorage: typeof Storage;

    @observable accessor showEventAudienceInfo: boolean = true;
    @observable accessor showTeachingAffectedExample: boolean = true;

    constructor(store: ViewStore) {
        this.store = store;
        this.localStorage = Storage;
        setTimeout(() => {
            this.syncStorage();
        }, 0);
    }

    @action
    syncStorage() {
        this.showEventAudienceInfo = !!this.localStorage.get(
            StorageKey.PreferenceEventAudienceInfoShow,
            true
        );
        this.showTeachingAffectedExample = !!this.localStorage.get(
            StorageKey.PreferenceEventTeachingAffectedExampleShow,
            true
        );
    }

    @action
    setShowEventAudienceInfo(value: boolean) {
        this.showEventAudienceInfo = value;
        this.localStorage.sync(StorageKey.PreferenceEventAudienceInfoShow, value ? true : false);
    }

    @action
    setShowTeachingAffectedExample(value: boolean) {
        this.showTeachingAffectedExample = value;
        this.localStorage.sync(StorageKey.PreferenceEventTeachingAffectedExampleShow, value ? true : false);
    }
}

export default LocalUserSettings;
