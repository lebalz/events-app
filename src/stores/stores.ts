import React from 'react';
import { action, makeObservable, observable, reaction } from 'mobx';
import { SessionStore } from './SessionStore';
import { UserStore } from './UserStore';
import { EventStore } from './EventStore';
import { UntisStore } from './UntisStore';
import { SocketDataStore } from './SocketDataStore';
import { LoadeableStore, ResettableStore } from './iStore';
import { JobStore } from './JobStore';
import { ViewStore } from './ViewStores';
import { DepartmentStore } from './DepartmentStore';
import { RegistrationPeriodStore } from './RegistrationPeriodStore';
import { SemesterStore } from './SemesterStore';
import { EventGroupStore } from './EventGroupStore';
import siteConfig from '@generated/docusaurus.config';
import { SubscriptionStore } from './SubscriptionStore';
const { CURRENT_LOCALE } = siteConfig.customFields as { CURRENT_LOCALE?: 'de' | 'fr' };

type StoreActions = 'load' | 'reset' | 'semester';

export class RootStore {
    currentLocale: 'de' | 'fr' = CURRENT_LOCALE ?? 'de';
    loadableStores = observable<LoadeableStore<any>>([]);
    resettableStores = observable<ResettableStore>([]);
    semesterizedStores = observable<LoadeableStore<any>>([]);

    @observable accessor _initialSemesterLoaded = false;

    sessionStore: SessionStore;
    untisStore: UntisStore;
    userStore: UserStore;
    eventStore: EventStore;
    socketStore: SocketDataStore;
    jobStore: JobStore;
    departmentStore: DepartmentStore;
    semesterStore: SemesterStore;
    registrationPeriodStore: RegistrationPeriodStore;
    eventGroupStore: EventGroupStore;
    subscriptionStore: SubscriptionStore;

    viewStore: ViewStore;

    @observable accessor _isLoadingPublic = false;
    @observable accessor _isLoadingPrivate = false;

    constructor() {
        this.semesterStore = new SemesterStore(this);
        this.subscribeTo(this.semesterStore, ['load', 'reset']);

        this.subscriptionStore = new SubscriptionStore(this);
        this.subscribeTo(this.subscriptionStore, ['reset']);

        this.userStore = new UserStore(this);
        this.subscribeTo(this.userStore, ['load', 'reset']);

        this.sessionStore = new SessionStore(this);

        this.untisStore = new UntisStore(this);
        this.subscribeTo(this.untisStore, ['load', 'reset']);

        this.eventStore = new EventStore(this);
        this.subscribeTo(this.eventStore, ['load', 'reset', 'semester']);

        this.jobStore = new JobStore(this);
        this.subscribeTo(this.jobStore, ['load', 'reset']);

        this.departmentStore = new DepartmentStore(this);
        this.subscribeTo(this.departmentStore, ['load', 'reset']);

        this.registrationPeriodStore = new RegistrationPeriodStore(this);
        this.subscribeTo(this.registrationPeriodStore, ['load', 'reset']);

        this.eventGroupStore = new EventGroupStore(this);
        this.subscribeTo(this.eventGroupStore, ['load', 'reset']);

        this.socketStore = new SocketDataStore(this);
        this.subscribeTo(this.socketStore, ['load', 'reset']);

        this.viewStore = new ViewStore(this);
        this.subscribeTo(this.viewStore, ['load', 'reset']);
        reaction(
            () => this.viewStore.semesterId,
            (semesterId) => {
                if (semesterId) {
                    this.loadSemester(semesterId);
                    this._initialSemesterLoaded = true;
                }
            }
        );
        setTimeout(() => {
            this.load('public').then((res) => {
                console.log('Auth Method:', this.sessionStore.authMethod);
                if (this.sessionStore.authMethod === 'apiKey' && this.sessionStore.currentUserId) {
                    this.load('authorized');
                }
            });
        }, 0);
    }

    subscribeTo(store: ResettableStore, events: ['reset']);
    subscribeTo(store: LoadeableStore<any>, events: ['load']);
    subscribeTo(store: LoadeableStore<any>, events: ['load', 'semester']);
    subscribeTo(store: ResettableStore & LoadeableStore<any>, events: ['load', 'reset']);
    subscribeTo(store: ResettableStore & LoadeableStore<any>, events: ['load', 'reset', 'semester']);
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
    load(type: 'public' | 'authorized', semesterId?: string) {
        if (type === 'public') {
            this._isLoadingPublic = true;
        } else {
            this._isLoadingPrivate = true;
        }
        return Promise.all(
            this.loadableStores.map((store) => {
                if (type === 'public') {
                    return store.loadPublic(semesterId);
                } else {
                    return store.loadAuthorized(semesterId);
                }
            })
        ).finally(
            action(() => {
                if (type === 'public') {
                    this._isLoadingPublic = false;
                } else {
                    this._isLoadingPrivate = false;
                }
            })
        );
    }

    @action
    cleanup() {
        this.resettableStores.forEach((store) => store.resetUserData());
    }

    @action
    loadSemester(semesterId: string) {
        if (!this._initialSemesterLoaded || this.semesterStore.loadedSemesters.has(semesterId)) {
            return;
        }
        this.semesterStore.loadedSemesters.add(semesterId);
        this.semesterizedStores.forEach((store) => {
            store.loadPublic(semesterId);
        });
        if (
            this.sessionStore.isLoggedIn &&
            this.semesterStore.currentSemester &&
            this.semesterStore.currentSemester.id !== semesterId
        ) {
            this.userStore.loadAffectedEventIds(this.userStore.current, semesterId);
            this.semesterizedStores.forEach((store) => {
                store.loadAuthorized(semesterId);
            });
        }
    }
}

export const rootStore = Object.freeze(new RootStore());
export const storesContext = React.createContext(rootStore);
export const StoresProvider = storesContext.Provider;
