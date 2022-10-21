
import React from "react";
import { makeObservable, observable, runInAction } from "mobx";
import { UserStore } from "./UserStore";
import { EventStore } from "./EventStore";
import { MSALStore } from "./MSALStore";
import { UntisStore } from './UntisStore';

export class RootStore {
  stores = observable([]);
  @observable 
  initialized = false;

  msalStore: MSALStore;
  userStore: UserStore;
  eventStore: EventStore;
  untisStore: UntisStore;
  constructor() {
    makeObservable(this);
    this.msalStore = new MSALStore(this);
    this.userStore = new UserStore(this);
    this.eventStore = new EventStore(this);
    this.untisStore = new UntisStore(this);
    runInAction(() => {
      this.initialized = true;
    })
  }
}

export const rootStore = Object.freeze(new RootStore());
export const storesContext = React.createContext(rootStore);
export const StoresProvider = storesContext.Provider;
