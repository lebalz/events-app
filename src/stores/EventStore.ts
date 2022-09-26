import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { computedFn } from 'mobx-utils';
import { events as fetchEvents } from '../api/event';
import Event from '../models/Event';
import { RootStore } from './stores';
import _ from 'lodash';
import axios from 'axios';

export class EventStore {
    private readonly root: RootStore;
    events = observable<Event>([]);

    cancelToken = axios.CancelToken.source();

    @observable initialized: boolean = false;
    constructor(root: RootStore) {
        this.root = root;

        reaction(
            () => this.root.msalStore.account,
            (account) => {
                this.reload();
            }
        );
        makeObservable(this);
    }

    cancelRequest() {
        this.cancelToken.cancel();
        this.cancelToken = axios.CancelToken.source();
    }


    @action
    reload() {
        this.events.replace([]);
        if (this.root.msalStore.account) {
            this.root.msalStore.withToken().then((ok) => {
                if (ok) {
                    fetchEvents(this.cancelToken)
                        .then(
                            action(({ data }) => {
                                const events = data.map((u) => new Event(u)).sort((a, b) => a.start.getTime() - b.start.getTime());
                                this.events.replace(events);
                            })
                        )
                        .catch((err) => {
                            if (err.message?.startsWith('Network Error')) {
                                this.root.msalStore.setApiOfflineState(true);
                            } else {
                                return;
                            }
                        });
                }
            });
        }
    }

}
