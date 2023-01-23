import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { computedFn } from 'mobx-utils';
import { events as fetchEvents, create as apiCreate, find as findEvent, update as updateEvent, Event as EventProps } from '../api/event';
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

    canEdit(event: SchoolEvent) {
        return this.root.userStore.current?.id === event.authorId;
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
                        const event = new SchoolEvent(data, this);
                        const events = this.events.slice();
                        const idx = events.findIndex((e) => e.id === event.id);
                        if (idx !== -1) {
                            events.splice(idx, 1);
                        }
                        this.events.replace([...events, event].sort((a, b) => a.compare(b)));
                        const rem = this.pendingApiCalls.find(p => p.id === pending.id && p.type === pending.type)
                        console.log('removed: ', this.pendingApiCalls.remove(rem));
                    })
                )
        }
    }

    @action
    updateEvent(eventId: string, params: Partial<EventProps>) {
        const event = this.find(eventId);
        if (!event) {
            return;
        }
        event.update(params);

    }

    @action
    loadEvent(id: string) {
        const [ct] = createCancelToken();
        return findEvent(id, ct).then(action(({ data }) => {
            const event = new SchoolEvent(data, this);
            const events = this.events.slice();
            const idx = events.findIndex((e) => e.id === event.id);
            if (idx !== -1) {
                events.splice(idx, 1);
            }
            this.events.replace([...events, event].sort((a, b) => a.compare(b)));
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
                    const events = data.map((u) => new SchoolEvent(u, this)).sort((a, b) => a.compare(b));
                    this.events.replace(events);
                    return this.events;
                })
            )
    }

    @action
    save(id: string) {
        const [source, token] = createCancelToken();
        const ev = this.find(id);
        if (!ev) {
            return Promise.resolve(undefined);
        }
        const pending = {id: ev.id, type: IoEvent.CHANGED_RECORD};
        this.pendingApiCalls.push(pending);
        return updateEvent(id, ev.props, source)
            .then(
                action(({ data }) => {
                    ev.updatedAt = new Date(data.updatedAt);
                    const rem = this.pendingApiCalls.find(p => p.id === pending.id && p.type === pending.type);
                    console.log('removed: ', this.pendingApiCalls.remove(rem));
                })
            )
    }

    @action
    reset() {
        this.cancelRequest()
        this.events.replace([]);
    }

}