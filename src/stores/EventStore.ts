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

    byJob = computedFn(
        function (this: EventStore, jobId?: string): SchoolEvent[] {
            if (!jobId) {
                return [];
            }
            return this.events.filter((e) => e.jobId === jobId);
        },
        { keepAlive: true }
    );

    @action
    newEvent() {
        if (this.root.sessionStore.account) {
            const d = new Date();
            const s = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()));
            const id = uuidv4();
            this.root.socketStore.setPendingApiCall(IoEvent.NEW_RECORD, id);
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
                        this.root.socketStore.rmPendingApiCall(IoEvent.NEW_RECORD, id);

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
        this.root.socketStore.setPendingApiCall(IoEvent.CHANGED_RECORD, ev.id);
        return updateEvent(id, ev.props, source)
            .then(
                action(({ data }) => {
                    ev.updatedAt = new Date(data.updatedAt);
                    this.root.socketStore.rmPendingApiCall(IoEvent.CHANGED_RECORD, ev.id);
                })
            )
    }

    @action
    appendEvents(events?: EventProps[]) {
        if (!events?.length) {
            return;
        }
        const current = this.events.slice();
        events.forEach((event) => {
            const idx = current.findIndex((e) => e.id === event.id);
            if (idx !== -1) {
                current.splice(idx, 1);
            }
        })
        const newEvents = events.map((e) => new SchoolEvent(e, this));
        this.events.replace([...current, ...newEvents].sort((a, b) => a.compare(b)));
    }

    @action
    removeEvents(events: SchoolEvent[]) {
        if (!events?.length) {
            return;
        }
        const current = this.events.slice();
        events.forEach((event) => {
            const idx = current.findIndex((e) => e.id === event.id);
            if (idx !== -1) {
                current.splice(idx, 1);
            }
        })
        this.events.replace(current);
    }


    @action
    reset() {
        this.cancelRequest()
        this.events.replace([]);
    }

}
