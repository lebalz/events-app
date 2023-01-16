import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { computedFn } from 'mobx-utils';
import { events as fetchEvents, create as apiCreate } from '../api/event';
import SchoolEvent from '../models/SchoolEvent';
import { RootStore } from './stores';
import _ from 'lodash';
import axios from 'axios';
import iStore from './iStore';

export class EventStore implements iStore<SchoolEvent[]> {
    private readonly root: RootStore;
    events = observable<SchoolEvent>([]);

    cancelToken = axios.CancelToken.source();
    constructor(root: RootStore) {
        this.root = root;
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

    byUser = computedFn(
        function (this: EventStore, userId?: string): SchoolEvent[] {
            if (!userId) {
                return [];
            }
            return this.events.filter((e) => e.authorId === userId);
        },
        { keepAlive: true }
    );

    @action
    newEvent() {
        if (this.root.sessionStore.account) {
            const d = new Date();
            const s = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()))
            apiCreate({ start: s.toISOString(), end: s.toISOString() }, this.cancelToken)
                .then(
                    action(({ data }) => {
                        const event = new SchoolEvent(data);
                        this.events.push(event);
                    })
                )
        }
    }

    @action
    reload() {
        this.events.replace([]);
        if (this.root.sessionStore.account) {
            this.load();
        }
    }

    @action
    load() {
        this.cancelRequest();
        return fetchEvents(this.cancelToken)
            .then(
                action(({ data }) => {
                    const events = data.map((u) => new SchoolEvent(u)).sort((a, b) => a.start.getTime() - b.start.getTime());
                    this.events.replace(events);
                    return this.events;
                })
            )
    }

    @action
    reset() {
        this.cancelRequest()
        this.events.replace([]);
    }

}
