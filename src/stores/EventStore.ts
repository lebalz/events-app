import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { computedFn } from 'mobx-utils';
import { events as fetchEvents, create as apiCreate, event as fetchEvent } from '../api/event';
import SchoolEvent from '../models/SchoolEvent';
import { RootStore } from './stores';
import _ from 'lodash';
import axios from 'axios';
import iStore from './iStore';
import { v4 as uuidv4 } from 'uuid';
import { createCancelToken } from '../api/base';
import { IoEvent } from './IoEventTypes';

interface PendingIoEvent {
    type: IoEvent;
    id: string;
}

export class EventStore implements iStore<SchoolEvent[]> {
    private readonly root: RootStore;
    events = observable<SchoolEvent>([]);
    pendingApiCalls = observable<PendingIoEvent>([]);

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
            const s = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()));
            const id = uuidv4();
            const pending = {id: id, type: IoEvent.NEW_RECORD}
            this.pendingApiCalls.push(pending);
            apiCreate({ start: s.toISOString(), end: s.toISOString(), id: id }, this.cancelToken)
                .then(
                    action(({ data }) => {
                        const event = new SchoolEvent(data);
                        this.events.push(event);
                        const rem = this.pendingApiCalls.find(p => p.id === pending.id && p.type === pending.type)
                        console.log('removed: ', this.pendingApiCalls.remove(rem));
                    })
                )
        }
    }

    @action
    loadEvent(id: string) {
        const [ct] = createCancelToken();
        return fetchEvent(id, ct).then(action(({ data }) => {
            const event = new SchoolEvent(data);
            const current = this.find(event.id);
            if (current) {
                this.events.remove(current);
            }
            this.events.push(event);
            return event;
        }))
    }

    isPending(id: string, type: IoEvent) {
        return this.pendingApiCalls.find(p => p.id === id && p.type === type) !== undefined;
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
