
import React from "react";
import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx";
import { SessionStore } from "./SessionStore";
import { UserStore } from "./UserStore";
import { EventStore } from "./EventStore";
import { UntisStore } from './UntisStore';
import { SocketDataStore } from "./SocketDataStore";
import { LoadeableStore, ResettableStore } from "./iStore";
import { JobStore } from "./JobStore";
import { ViewStore } from "./ViewStores";
import { DepartmentStore } from "./DepartmentStore";
import { RegistrationPeriodStore } from "./RegistrationPeriodStore";
import { SemesterStore } from "./SemesterStore";
import { UserEventGroupStore } from "./UserEventGroupStore";
import siteConfig from '@generated/docusaurus.config';
import { AccountInfo } from "@azure/msal-browser";
const { CURRENT_LOCALE } = siteConfig.customFields as { CURRENT_LOCALE?: 'de' | 'fr' };

type StoreActions = 'load' | 'reset' | 'semester';

export class RootStore {
    currentLocale: 'de' | 'fr' = CURRENT_LOCALE ?? 'de';
    loadableStores = observable<LoadeableStore<any>>([]);
    resettableStores = observable<ResettableStore>([]);
    semesterizedStores = observable<LoadeableStore<any>>([]);

    @observable
    initialized = false;
    @observable
    _initialLoadPerformed = false;

    sessionStore: SessionStore;
    untisStore: UntisStore;
    userStore: UserStore;
    eventStore: EventStore;
    socketStore: SocketDataStore;
    jobStore: JobStore;
    departmentStore: DepartmentStore;
    semesterStore: SemesterStore;
    registrationPeriodStore: RegistrationPeriodStore;
    userEventGroupStore: UserEventGroupStore;


    viewStore: ViewStore;
    constructor() {
        makeObservable(this);
        this.sessionStore = new SessionStore(this);
        
        this.semesterStore = new SemesterStore(this);
        this.subscribeTo(this.semesterStore, ['load', 'reset']);

        this.userStore = new UserStore(this);
        this.subscribeTo(this.userStore, ['load', 'reset']);

        this.untisStore = new UntisStore(this);
        this.subscribeTo(this.untisStore, ['load', 'reset']);

        this.eventStore = new EventStore(this);
        this.subscribeTo(this.eventStore, ['load', 'reset', 'semester']);

        this.socketStore = new SocketDataStore(this);
        this.subscribeTo(this.socketStore, ['load', 'reset']);

        this.jobStore = new JobStore(this);
        this.subscribeTo(this.jobStore, ['load', 'reset']);

        this.departmentStore = new DepartmentStore(this);
        this.subscribeTo(this.departmentStore, ['load', 'reset']);

        this.registrationPeriodStore = new RegistrationPeriodStore(this);
        this.subscribeTo(this.registrationPeriodStore, ['load', 'reset']);

        this.userEventGroupStore = new UserEventGroupStore(this);
        this.subscribeTo(this.userEventGroupStore, ['load', 'reset']);

        this.viewStore = new ViewStore(this);
        this.subscribeTo(this.viewStore,  ['load', 'reset']);
        runInAction(() => {
            this.initialized = true;
        });

        reaction(
            (): [AccountInfo, string] => [this.sessionStore.account, this.viewStore.semesterId],
            ([account, semesterId], [prevAccount, prevSemesterId]) => {
                if (prevAccount && account !== prevAccount) {
                    this.cleanup();
                }
                if (account && semesterId && !prevSemesterId) {
                    this.semesterStore.loadedSemesters.add(semesterId);
                    this.load('authorized', semesterId);
                }
            }
        )

        reaction(
            () => this.viewStore.semesterId,
            (semesterId) => {
                if (semesterId) {
                    console.log('load semester', semesterId);
                    this.loadSemester(semesterId);
                    this._initialLoadPerformed = true;
                }
            }
        );
        this.initialize();
    }

    subscribeTo(store: ResettableStore, events: ['reset'])
    subscribeTo(store: LoadeableStore<any>, events: ['load'])
    subscribeTo(store: LoadeableStore<any>, events: ['load', 'semester'])
    subscribeTo(store: ResettableStore & LoadeableStore<any>, events: ['load', 'reset'])
    subscribeTo(store: ResettableStore & LoadeableStore<any>, events: ['load', 'reset', 'semester'])
    @action
    subscribeTo(store: any, events: StoreActions[]) {
        if (events.includes('load')) {
            this.loadableStores.push(store);
        }
        if (events.includes('reset')) {
            this.resettableStores.push(store);
        }
        if (events.includes('semester')) {
            this.semesterizedStores.push(store);
        }
    }

    @computed
    get initialLoadPerformed() {
        if (!this._initialLoadPerformed) {
            return false;
        }
        return this.loadableStores.every((store) => store.initialLoadPerformed);
    }

    /**
     * Initialize the stores
     * When the page initially loads, this will be called by the root component (@see src/theme/Root.tsx)
     */
    @action
    initialize() {
        this.load('public');
    }

    @action
    load(type: 'public' | 'authorized', semesterId?: string) {
        this.loadableStores.forEach((store) => {
            if (type === 'public') {
                store.loadPublic(semesterId);
            } else {
                store.loadAuthorized(semesterId);
            }
        });
    }


    @action
    cleanup() {
        this.resettableStores.forEach((store) => store.resetUserData());
    }


    @action
    loadSemester(semesterId: string) {
        if (!this._initialLoadPerformed || this.semesterStore.loadedSemesters.has(semesterId)) {
            return;
        }
        this.semesterStore.loadedSemesters.add(semesterId);
        this.semesterizedStores.forEach((store) => {
            store.loadPublic(semesterId);
            store.loadAuthorized(semesterId);
        });
        if (this.sessionStore.loggedIn) {
            this.userStore.loadAffectedEventIds(this.userStore.current, semesterId);
        }
    }
}


export const rootStore = Object.freeze(new RootStore());
export const storesContext = React.createContext(rootStore);
export const StoresProvider = storesContext.Provider;
