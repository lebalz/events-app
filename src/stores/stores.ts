
import React from "react";
import { makeObservable, observable, reaction, runInAction } from "mobx";
import { SessionStore } from "./SessionStore";
import { UserStore } from "./UserStore";
import { EventStore } from "./EventStore";
import { UntisStore } from './UntisStore';
import { SocketDataStore } from "./SocketDataStore";
import iStore from "./iStore";
import { JobStore } from "./JobStore";
import { ViewStore } from "./ViewStore";
import { DepartmentStore } from "./DepartmentStore";
import { RegistrationPeriodStore } from "./RegistrationPeriodStore";
import { SemesterStore } from "./SemesterStore";

export class RootStore {
  stores = observable<iStore<any>>([]);
  @observable 
  initialized = false;

  sessionStore: SessionStore;
  untisStore: UntisStore;
  userStore: UserStore;
  eventStore: EventStore;
  socketStore: SocketDataStore;
  jobStore: JobStore;
  departmentStore: DepartmentStore;
  semesterStore: SemesterStore;
  registrationPeriodStore: RegistrationPeriodStore;

  viewStore: ViewStore;
  constructor() {
    makeObservable(this);
    this.sessionStore = new SessionStore(this);

    this.userStore = new UserStore(this);
    this.stores.push(this.userStore);

    this.untisStore = new UntisStore(this);
    this.stores.push(this.untisStore);

    this.eventStore = new EventStore(this);
    this.stores.push(this.eventStore);

    this.socketStore = new SocketDataStore(this);
    this.stores.push(this.socketStore);

    this.jobStore = new JobStore(this);
    this.stores.push(this.jobStore);

    this.departmentStore = new DepartmentStore(this);
    this.stores.push(this.departmentStore);

    this.semesterStore = new SemesterStore(this);
    this.stores.push(this.semesterStore);

    this.registrationPeriodStore = new RegistrationPeriodStore(this);
    this.stores.push(this.registrationPeriodStore);

    this.viewStore = new ViewStore(this);
    this.stores.push(this.viewStore);


    runInAction(() => {
      this.initialized = true;
    });

    reaction(
      () => this.sessionStore.account,
      (account) => {
        if (account) {
          this.stores.forEach((store) => store.load());
        } else {
          this.stores.forEach((store) => store.reset());
        }
      }
    )
  }
}


export const rootStore = Object.freeze(new RootStore());
export const storesContext = React.createContext(rootStore);
export const StoresProvider = storesContext.Provider;
