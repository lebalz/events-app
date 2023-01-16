
import React from "react";
import { makeObservable, observable, runInAction } from "mobx";
import { SessionStore } from "./SessionStore";
import { UserStore } from "./UserStore";
import { EventStore } from "./EventStore";
import { UntisStore } from './UntisStore';
import { SocketDataStore } from "./SocketDataStore";

export class RootStore {
  stores = observable([]);
  @observable 
  initialized = false;

  sessionStore: SessionStore;
  untisStore: UntisStore;
  userStore: UserStore;
  eventStore: EventStore;
  socketStore: SocketDataStore;
  constructor() {
    makeObservable(this);
    this.sessionStore = new SessionStore();
    this.untisStore = new UntisStore(this);
    this.userStore = new UserStore(this);
    this.eventStore = new EventStore(this);
    this.socketStore = new SocketDataStore(this);
    runInAction(() => {
      this.initialized = true;
    })
  }
}


export const rootStore = Object.freeze(new RootStore());
export const storesContext = React.createContext(rootStore);
export const StoresProvider = storesContext.Provider;
