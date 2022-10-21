import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { computedFn } from 'mobx-utils';
import { events as fetchEvents } from '../api/event';
import SchoolEvent from '../models/SchoolEvent';
import type { RootStore } from './stores';
import _ from 'lodash';
import axios from 'axios';

export class EventStore {
    private readonly root: RootStore;
    events = observable<SchoolEvent>([]);

    cancelToken = axios.CancelToken.source();
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

    find = computedFn(
        function (this: EventStore, id?: string): SchoolEvent | undefined {
            if (!id) {
                return;
            }
            return this.events.find((e) => e.id === id);
        },
        { keepAlive: true }
    );

    @action
    reload() {
        this.events.replace([]);
        if (this.root.msalStore.account) {
            this.root.msalStore.withToken().then((ok) => {
                if (ok) {
                    fetchEvents(this.cancelToken)
                        .then(
                            action(({ data }) => {
                                const events = data.map((u) => new SchoolEvent(u)).sort((a, b) => a.start.diff(b.start, 'milliseconds'));
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
