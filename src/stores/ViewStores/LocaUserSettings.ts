import { action, computed, observable } from 'mobx';
import { ViewStore } from '.';
import Storage, { StorageKey } from '../utils/Storage';

class LocalUserSettings {
    private readonly store: ViewStore;
    private readonly localStorage: typeof Storage;

    @observable accessor showEventAudienceInfo: boolean;
    @observable accessor showTeachingAffectedExample: boolean;

    constructor(store: ViewStore) {
        this.store = store;
        this.localStorage = Storage;
        setTimeout(() => {
            this.synStorage();
        }, 0);
    }

    @action
    synStorage() {
        this.showEventAudienceInfo = this.localStorage.get(
            StorageKey.PreferenceEventAudienceInfoShow,
            true,
            (raw) => raw !== '0'
        );
        this.showTeachingAffectedExample = this.localStorage.get(
            StorageKey.PreferenceEventTeachingAffectedExampleShow,
            true,
            (raw) => raw !== '0'
        );
        console.log(this.showEventAudienceInfo, this.showTeachingAffectedExample);
    }

    @action
    setShowEventAudienceInfo(value: boolean) {
        this.showEventAudienceInfo = value;
        this.localStorage.sync(
            StorageKey.PreferenceEventAudienceInfoShow,
            value ? undefined : '0',
            (val) => val
        );
    }

    @action
    setShowTeachingAffectedExample(value: boolean) {
        this.showTeachingAffectedExample = value;
        this.localStorage.sync(
            StorageKey.PreferenceEventTeachingAffectedExampleShow,
            value ? undefined : '0',
            (val) => val
        );
    }
}

export default LocalUserSettings;
