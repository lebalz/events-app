import { action, computed, observable } from 'mobx';
import { computedFn } from 'mobx-utils';
import {
    Event as EventProps,
    EventState,
    requestState as apiRequestState,
    excel as apiDownloadExcel,
    clone as apiClone,
    all as apiFetchEvents,
    updateMeta,
    normalizeAudience as apiNormalizeAudience,
    Meta,
    updateBatched as apiUpdateBatched,
    deleteMany as apiDeleteMany
} from '../api/event';
import Event from '../models/Event';
import { RootStore } from './stores';
import _ from 'lodash';
import iStore from './iStore';
import Department from '../models/Department';
import { HOUR_2_MS, toGlobalDate } from '../models/helpers/time';
import Lesson from '../models/Untis/Lesson';
import { EndPoint } from './EndPoint';
import AudienceShifter from '../components/EventGroup/BulkEditor/ShiftAudience/AudienceShifter';
import { KlassName } from '../models/helpers/klassNames';
import scheduleMicrotask from '../models/helpers/scheduleMicrotask';

export class EventStore extends iStore<
    EventProps,
    | 'download-excel'
    | `clone-${string}`
    | `normalize-audience-${string}`
    | `update-meta-${string}`
    | `update-batched-${string}`
    | `load-versions-${string}`
> {
    readonly root: RootStore;

    @observable.ref accessor ApiEndpoint = new EndPoint('events', {
        authorized: 'user/events',
        public: true
    });

    models = observable<Event>([]);

    constructor(root: RootStore) {
        super();
        this.root = root;
    }

    canEdit(event: Event) {
        if (event.state === EventState.Draft) {
            const isAuthor = event.authorId === this.root.userStore.current?.id;
            return isAuthor || event.groups.some((g) => g.userIds.has(this.root.userStore.current?.id));
        }
        return !!this.root.userStore.current;
    }

    canDelete(event: Event) {
        const isAuthor = event.authorId === this.root.userStore.current?.id;
        return isAuthor || event.groups.some((g) => g.userIds.has(this.root.userStore.current?.id));
    }

    affectsUser(event: Event) {
        return this.root.userStore.getAffectedEventIds.has(event.id);
    }

    @computed
    get events() {
        return this.models.slice().sort((a, b) => a.compare(b));
    }

    @computed
    get publicEvents() {
        return this.events.filter((e) => e.state === EventState.Published);
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

    findChildren = computedFn(
        function (this: EventStore, parentId?: string): Event[] {
            if (!parentId) {
                return [];
            }
            return this.events.filter((e) => e.parentId === parentId);
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

    createModel(data: EventProps, state?: 'load' | 'create'): Event {
        const model = new Event(data, this);
        if (state === 'create') {
            model.triggerInitialValidation();
            model.setEditing(true);
        }
        return model;
    }

    getDepartments(ids: string[]): Department[] {
        const { locale } = this.root.sessionStore;
        return _.sortBy(
            ids
                .map((id) => this.root.departmentStore.departments.find((d) => d.id === id))
                .filter((d) => !!d),
            (d) => {
                return `${d.lang === locale ? '0' : '1'}${/GYM/i.test(d.name) ? '0' : '1'}${d.department2_Id ? '1' : '0'}${d.name}`;
            }
        );
    }

    getDepartmentsByLetter(letter: string): Department[] {
        return this.root.departmentStore.findByDepartmentLetter(letter);
    }

    @computed
    get getUsedUnknownClassNames(): KlassName[] {
        const cnRegex = /^\d\d([A-Z][a-z]|[a-z][A-Z])$/;
        return [...new Set(this.events.flatMap((e) => e._unknownClassNames))].filter((c) => cnRegex.test(c));
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
                const removed = current.splice(idx, 1);
                removed.forEach((e) => e.cleanup());
            }
        });
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
        });
        const newEvents = events.map((e) => new Event(e, this));
        this.models.replace([...current, ...newEvents].sort((a, b) => a.compare(b)));
    }

    affectedLessons = computedFn(function (this: EventStore, eventId: string): Lesson[] {
        const event = this.find<Event>(eventId);
        if (!event) {
            return [];
        }
        return this.root.untisStore.lessons.filter((l) => {
            const unaffected =
                event.weekOffsetMS_end < l.weekOffsetMS_start ||
                event.weekOffsetMS_start > l.weekOffsetMS_end;
            return !unaffected;
        });
    });

    getUntisClasses(event: Event) {
        const klasses = [...event.classes]
            .map((c) => this.root.untisStore.findClassByName(c))
            .filter((c) => !!c);
        const wildcard = this.getWildcardUntisClasses(event);
        return _.uniqBy([...klasses, ...wildcard], 'id');
    }

    hasUntisClassesInClassGroup(classGroupName: string, referenceYear: number) {
        return this.root.untisStore.hasClassesWithGroupName(classGroupName, referenceYear);
    }

    getWildcardUntisClasses(event: Event) {
        const klassGroups = [...event.classGroups]
            .map((c) => this.root.untisStore.findClassesByGroupName(c))
            .flat();
        const departmentKlasses = this.getDepartments([...event.departmentIds])
            .map((d) => d.classes)
            .flat();
        return _.uniqBy([...klassGroups, ...departmentKlasses], 'id');
    }

    @action
    requestState(eventIds: string[], state: EventState) {
        return this.withAbortController(`save-state-${state}-${eventIds.join(':')}`, (sig) => {
            return apiRequestState(state, eventIds, sig.signal).then(
                action(({ data }) => {
                    if (data) {
                        this.bulkAddToStore(data);
                    }
                    return this.models;
                })
            );
        });
    }

    @action
    clone(event: Event) {
        return this.withAbortController(`clone-${event.id}`, (sig) => {
            return apiClone(event.id, sig.signal).then(
                action(({ data }) => {
                    if (data) {
                        this.addToStore(data);
                    }
                    return data;
                })
            );
        });
    }

    @action
    downloadExcel() {
        return this.withAbortController(`download-excel`, (sig) => {
            return apiDownloadExcel(sig.signal);
        });
    }

    @action
    loadVersions(event: Event) {
        const proms = event.publishedVersionIds
            .filter((id) => !this.find(id))
            .map((id) => this.loadModel(id));
        return Promise.all(proms);
    }

    @action
    loadEvents(ids: string[], sigId: string): Promise<Event[]> {
        if (ids.length === 0) {
            return Promise.resolve([] as Event[]);
        }
        // max 2048 characters in URL --> batch to 42 records per fetch
        const res = _.chunk([...new Set(ids)], 42).map((chunkedIds, idx) => {
            return this.withAbortController(`load-events-${sigId}-${idx}`, (sig) => {
                return apiFetchEvents(chunkedIds, sig.signal).then(
                    action(({ data }) => {
                        if (data) {
                            return this.bulkAddToStore(data);
                        }
                        return [];
                    })
                );
            });
        });
        return Promise.all(res).then((batched) => batched.flat() as Event[]);
    }

    @action
    updateMeta(event: Event, meta: Partial<Meta>) {
        return this.withAbortController(`update-meta-${event.id}`, (sig) => {
            return updateMeta(event.id, meta, sig.signal).then(({ data }) => {
                if (data) {
                    this.addToStore(data);
                }
                return data;
            });
        });
    }
    @action
    normalizeAudience(event: Event) {
        if (!event.isDraft) {
            return Promise.resolve(event);
        }
        const wasEditing = event.isEditing;
        return this.save(event).then(() => {
            if (wasEditing) {
                this.find(event.id)?.setEditing(true);
            }
            return this.withAbortController(`normalize-audience-${event.id}`, (sig) => {
                return apiNormalizeAudience(event.id, sig.signal).then(({ data }) => {
                    if (data) {
                        const model = this.addToStore(data) as Event;
                        if (wasEditing) {
                            scheduleMicrotask(() => {
                                model.setEditing(true);
                            });
                        }
                    }
                    return data;
                });
            });
        });
    }

    @action
    shiftEventDates(events: Event[], shiftMs: number) {
        const updated = events
            .filter((e) => e.isDraft)
            .map((event) => {
                const start = new Date(event.start.getTime() + shiftMs);
                const end = new Date(event.end.getTime() + shiftMs);
                return {
                    id: event.id,
                    start: toGlobalDate(start).toISOString(),
                    end: toGlobalDate(end).toISOString()
                };
            });
        return this.updateBatched(updated);
    }

    @action
    shiftAudiencePatch(events: Event[], shifter: AudienceShifter) {
        const updated = events
            .filter((e) => e.isDraft)
            .map((event) => {
                const updatedClasses = [...event.classes]
                    .map((c) => shifter.audience.get(c))
                    .filter((a) => !!a) as KlassName[];
                const updatedClassGroups = [...event.classGroups]
                    .map((c) => shifter.audience.get(c))
                    .filter((a) => !!a);
                const change: Partial<EventProps> & { id: string } = {
                    id: event.id,
                    classes: updatedClasses,
                    classGroups: updatedClassGroups
                };
                if (shifter.shiftAudienceInText) {
                    let description = event.description;
                    let descriptionLong = event.descriptionLong;
                    let location = event.location;
                    [...event.classes].forEach((klass) => {
                        const untisClass = this.root.untisStore.findClassByName(klass);
                        const newClass = this.root.untisStore.findClassByName(
                            shifter.audience.get(klass) || ''
                        );
                        const name = untisClass?.displayName || klass;
                        const newName = newClass?.displayName || shifter.audience.get(klass) || '';
                        description = description.replace(new RegExp(name, 'g'), newName);
                        descriptionLong = descriptionLong.replace(new RegExp(name, 'g'), newName);
                        location = location.replace(new RegExp(name, 'g'), newName);
                    });
                    if (description !== event.description) {
                        change.description = description;
                    }
                    if (descriptionLong !== event.descriptionLong) {
                        change.descriptionLong = descriptionLong;
                    }
                    if (location !== event.location) {
                        change.location = location;
                    }
                }
                return change;
            });
        return updated;
    }

    @action
    shiftEventAudience(events: Event[], shifter: AudienceShifter) {
        return this.updateBatched(this.shiftAudiencePatch(events, shifter));
    }

    @action
    updateBatched(events: (Partial<EventProps> & { id: string })[]) {
        return this.withAbortController(`update-batched-${events.map((e) => e.id).join(':')}`, (sig) => {
            return apiUpdateBatched(events, sig.signal).then(({ data }) => {
                if (data) {
                    this.bulkAddToStore(data);
                }
                return data;
            });
        });
    }

    @action
    destroyMany(toDelete: Event[]): Promise<string[]> {
        if (toDelete.length === 0) {
            return Promise.resolve([]);
        }

        // max 2048 characters in URL --> batch to 42 records per fetch
        const res = _.chunk([...new Set(toDelete.map((e) => e.id).sort())], 42).map((chunkedIds, idx) => {
            return this.withAbortController(`destroy-${chunkedIds.join(':')}`, (sig) => {
                return apiDeleteMany(chunkedIds, sig.signal).then(
                    action(({ data }) => {
                        if (data) {
                            data.forEach((id) => {
                                this.removeFromStore(id, true);
                            });
                        }
                        return data;
                    })
                );
            });
        });
        return Promise.all(res).then((batched) => batched.flat());
    }
}
