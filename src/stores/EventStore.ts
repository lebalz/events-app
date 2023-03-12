import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { computedFn } from 'mobx-utils';
import { events as fetchEvents, create as apiCreate, find as findEvent, update as updateEvent, Event as EventProps, EventState } from '../api/event';
import Event, { HOUR_2_MS } from '../models/Event';
import { RootStore } from './stores';
import _ from 'lodash';
import iStore from './iStore';
import Department from '../models/Department';
import ApiModel from '../models/ApiModel';


export class EventStore extends iStore<EventProps> {
    readonly root: RootStore;
    readonly API_ENDPOINT = 'event';
    models = observable<Event>([]);

    constructor(root: RootStore) {
        super()
        this.root = root;
        makeObservable(this);
    }

    canEdit(event: Event) {
        return this.root.userStore.current?.id === event.authorId;
    }

    @computed
    get events() {
        return this.models;
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
    reload() {
        this.events.replace([]);
        if (this.root.sessionStore.account) {
            this.load();
        }
    }

    createModel(data: EventProps): Event {
        return new Event(data, this);
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

}
