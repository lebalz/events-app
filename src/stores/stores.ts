
import React from "react";
import { action, makeObservable, observable, reaction, runInAction } from "mobx";
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

type StoreActions = 'load' | 'reset' | 'semester';

export class RootStore {
    loadableStores = observable<LoadeableStore<any>>([]);
    resettableStores = observable<ResettableStore>([]);
    semesterizedStores = observable<LoadeableStore<any>>([]);

    @observable
    initialized = false;
    @observable
    loaded = false;

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
        this.subscribeTo(this.semesterStore, ['reset']);

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
        })

        reaction(
            () => this.sessionStore.account,
            (account) => {
                if (this.loaded) {
                    this.cleanup();
                    this.initialize();
                }
            }
        )

        reaction(
            () => this.viewStore.semesterId,
            (semesterId) => {
                if (semesterId) {
                    this.loadSemester(semesterId, false);
                }
            }
        );
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

    @action
    initialize() {
        if (this.sessionStore.account) {
            /** make sure to first only load a user - in case a new user is created, this prevents parallel upserts */
            this.userStore.loadUser(this.sessionStore.account.localAccountId)
                .finally(() => {
                    this.load();
                });
        } else {
            this.load();
        }
    }

    @action
    load() {
        this.semesterStore.load()
            .then(action(() => {
                this.loaded = true;
                const semesterId = this.semesterStore.currentSemester?.id;
                this.semesterStore.loadedSemesters.add(semesterId);
                this.loadableStores.forEach((store) => {
                    store.load(semesterId)
                });
            }));
    }

    @action
    cleanup() {
        this.resettableStores.forEach((store) => store.reset());
    }
    @action
    loadSemester(semesterId: string, force: boolean) {
        if (!force && (!this.loaded || this.semesterStore.loadedSemesters.has(semesterId))) {
            return;
        }
        this.semesterStore.loadedSemesters.add(semesterId);
        this.semesterizedStores.forEach((store) => {
            store.load(semesterId);
        });
    }
}


export const rootStore = Object.freeze(new RootStore());
export const storesContext = React.createContext(rootStore);
export const StoresProvider = storesContext.Provider;
