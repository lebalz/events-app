
import React from "react";
import { makeObservable, observable, runInAction } from "mobx";
import { SessionStore } from "./SessionStore";
import { UserStore } from "./UserStore";
import { EventStore } from "./EventStore";
import { UntisStore } from './UntisStore';
import { SocketDataStore } from "./SocketDataStore";
import iStore from "./iStore";
import { computedFn } from "mobx-utils";

export class RootStore {
  stores = observable<iStore<any>>([]);
  @observable 
  initialized = false;

  sessionStore: SessionStore;
  untisStore: UntisStore;
  userStore: UserStore;
  eventStore: EventStore;
  socketStore: SocketDataStore;
  constructor() {
    makeObservable(this);
    this.sessionStore = new SessionStore(this);

    this.untisStore = new UntisStore(this);
    this.stores.push(this.untisStore);

    this.userStore = new UserStore(this);
    this.stores.push(this.userStore);

    this.eventStore = new EventStore(this);
    this.stores.push(this.eventStore);

    this.socketStore = new SocketDataStore(this);
    this.stores.push(this.socketStore);

    runInAction(() => {
      this.initialized = true;
    });
  }
}


export const rootStore = Object.freeze(new RootStore());
export const storesContext = React.createContext(rootStore);
export const StoresProvider = storesContext.Provider;
