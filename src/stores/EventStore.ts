import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { computedFn } from 'mobx-utils';
import { Event as EventProps, EventState, setState } from '../api/event';
import Event from '../models/Event';
import { RootStore } from './stores';
import _ from 'lodash';
import iStore from './iStore';
import Department from '../models/Department';
import { HOUR_2_MS } from '../models/helpers/time';
import Lesson from '../models/Untis/Lesson';

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
        return this.models.slice().sort((a, b) => a.compare(b));
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

    byIds(ids?: string | string[]): Event[] {
        if (!ids) {
            return [];
        }
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        return ids.map((id) => this.find<Event>(id)).filter((e) => !!e);
    }

    
    byDateRange = computedFn(
        function (this: EventStore, start: Date, end: Date): Event[] {
            return this.events.filter((e) => e._pristine_start >= start && e._pristine_start <= end);
        },
        { keepAlive: true }
    );

    @action
    reload() {
        this.models.replace([]);
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
        return first.start.getTime();
    }

    @computed
    get eventRangeEndMS() {
        if (this.events.length < 1) {
            return this.eventRangeStartMS + HOUR_2_MS;
        }
        const last = this.events[this.events.length - 1];
        return last.end.getTime();
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
        this.models.replace(current);
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
        this.models.replace([...current, ...newEvents].sort((a, b) => a.compare(b)));
    }

    affectedLessons = computedFn(
        function (this: EventStore, eventId: string): Lesson[] {
            const event = this.find<Event>(eventId);
            if (!event) {
                return [];
            }
            return this.root.untisStore.lessons.filter((l) => {
                const unaffected =  event.weekOffsetMS_end < l.weekOffsetMS_start ||
                                    event.weekOffsetMS_start > l.weekOffsetMS_end;
                return !unaffected;
            })
    })

    getUntisClasses(classNames: string[]) {
        return classNames.map(c => this.root.untisStore.findClassByName(c)).filter(c => !!c);
    }

    @action
    requestState(eventIds: string[], state: EventState) {
        return this.withAbortController(`save-state-${eventIds.join(':')}`, (sig) => {
            return setState(state, eventIds, sig.signal)
                .then(
                    action(({ data }) => {
                        if (data) {
                            this.models.replace(data.map((d) => this.createModel(d)));
                        }
                        return this.models;
                    })
                );
        });
    }

}
