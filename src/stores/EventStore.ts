import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { computedFn } from 'mobx-utils';
import { events as fetchEvents, create as apiCreate, find as findEvent, update as updateEvent, Event as EventProps, EventState } from '../api/event';
import Event, { HOUR_2_MS } from '../models/Event';
import { RootStore } from './stores';
import _ from 'lodash';
import axios from 'axios';
import iStore from './iStore';
import { v4 as uuidv4 } from 'uuid';
import { createCancelToken } from '../api/base';
import { IoEvent } from './IoEventTypes';
import Department from '../models/Department';


export class EventStore implements iStore<Event> {
    private readonly root: RootStore;
    events = observable<Event>([]);

    cancelToken = axios.CancelToken.source();
    constructor(root: RootStore) {
        this.root = root;
        makeObservable(this);
    }

    cancelRequest() {
        this.cancelToken.cancel();
        this.cancelToken = axios.CancelToken.source();
    }

    canEdit(event: Event) {
        return this.root.userStore.current?.id === event.authorId;
    }

    @computed
    get published() {
        return this.events.filter((e) => e.state === EventState.Published);
    }

    @computed
    get publishedAndMine() {
        const myId = this.root.userStore.current?.id;
        return this.events.filter((e) => e.state === EventState.Published || e.authorId === myId);
    }

    find = computedFn(
        function (this: EventStore, id?: string): Event | undefined {
            if (!id) {
                return;
            }
            return this.events.find((e) => e.id === id);
        },
        { keepAlive: true }
    );

    byUser = computedFn(
        function (this: EventStore, userId?: string): Event[] {
            if (!userId) {
                return [];
            }
            return this.events.filter((e) => e.authorId === userId);
        },
        { keepAlive: true }
    );

    byJob = computedFn(
        function (this: EventStore, jobId?: string): Event[] {
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
            apiCreate({ start: s.toISOString(), end: s.toISOString(), id: id }, this.cancelToken)
                .then(
                    action(({ data }) => {
                        const event = new Event(data, this);
                        const events = this.events.slice();
                        const idx = events.findIndex((e) => e.id === event.id);
                        if (idx !== -1) {
                            events.splice(idx, 1);
                        }
                        this.events.replace([...events, event].sort((a, b) => a.compare(b)));

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
            const event = new Event(data, this);
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
                    const events = data.map((u) => new Event(u, this)).sort((a, b) => a.compare(b));
                    this.events.replace(events);
                    return this.events;
                })
            )
    }

    @action
    save(model: Event) {
        const [source, token] = createCancelToken();
        const id = model.id;
        const ev = this.find(id);
        if (!ev) {
            return Promise.resolve(undefined);
        }
        return updateEvent(id, ev.props, source)
            .then(
                action(({ data }) => {
                    ev.updatedAt = new Date(data.updatedAt);
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
        const newEvents = events.map((e) => new Event(e, this));
        this.events.replace([...current, ...newEvents].sort((a, b) => a.compare(b)));
    }

    getDepartments(ids: string[]): Department[] {
        return ids.map((id) => this.root.departmentStore.departments.find((d) => d.id === id)).filter((d) => !!d);
    }

    @computed
    get eventRangeStartMS() {
        if (this.events.length < 1) {
            return Date.now();
        }
        const first = this.events[0];
        return first.localStart.getTime();
    }

    @computed
    get eventRangeEndMS() {
        if (this.events.length < 1) {
            return this.eventRangeStartMS + HOUR_2_MS;
        }
        const last = this.events[this.events.length - 1];
        return last.localEnd.getTime();
    }


    @computed
    get eventRangeMS() {
        return [this.eventRangeStartMS, this.eventRangeEndMS];   
    }

    @action
    removeEvents(events: Event[]) {
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
