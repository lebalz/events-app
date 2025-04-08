import { action, computed, IObservableArray, makeObservable, observable } from 'mobx';
import User from '../../models/User';
import { EventAudience, EventState } from '../../api/event';
import { ViewStore } from '.';
import Department from '@site/src/models/Department';
import { getLastMonday } from '@site/src/models/helpers/time';
import Event from '@site/src/models/Event';

export interface EventViewProps {
    user?: User;
    jobId?: string;
    states?: EventState[];
    ignoreImported?: boolean;
    onlyImported?: boolean;
    onlyDeleted?: boolean;
    ignoreDeleted?: boolean;
    orderBy?: `${'start' | 'isValid'}-${'asc' | 'desc'}`;
}

/**
 * route: /table
 */
class EventTable {
    private readonly store: ViewStore;
    readonly publicOnly: boolean;
    _events: IObservableArray<Event> | undefined = undefined;

    /** filter props */
    textFilter = observable.set<string>();

    @observable accessor klassFilter = '';

    audienceFilter = observable.set<EventAudience>();

    @observable accessor start: Date | null = null;
    @observable accessor end: Date | null = null;

    selectedEventIds = observable.set<string>();

    departmentIds = observable.set<string>();
    classNames = observable.set<string>();

    @observable accessor isDescriptionExpanded = false;

    @observable accessor onlyMine: boolean = false;

    @observable accessor _onlyCurrentWeekAndFuture: boolean = true;

    @observable accessor activeGroup: string | null = null;

    @observable accessor showAdvancedFilter = false;

    @observable accessor hideDeleted = true;

    @observable accessor showSelect = false;

    constructor(store: ViewStore, events?: Event[], publicOnly?: boolean) {
        this.store = store;
        this.publicOnly = !!publicOnly;
        if (events) {
            this._events = observable<Event>(events, { deep: false });
        }
    }

    @action
    setEvents(events: Event[]) {
        if (!this._events) {
            return;
        }
        this._events.replace(events);
        const availableIds = new Set(events.map((e) => e.id));
        [...this.selectedEventIds].forEach((eid) => {
            if (!availableIds.has(eid)) {
                this.selectedEventIds.delete(eid);
            }
        });
    }

    @action
    setEventSelected(eventId: string, selected: boolean) {
        if (selected) {
            this.selectedEventIds.add(eventId);
        } else {
            this.selectedEventIds.delete(eventId);
        }
    }

    @computed
    get selectedEvents() {
        return [...this.selectedEventIds]
            .map((sid) => this.events.find((e) => e.id === sid))
            .filter((e) => !!e);
    }

    @action
    toggleHideDeleted() {
        this.setHideDeleted(!this.hideDeleted);
    }

    @computed
    get selectedStates() {
        return [...new Set(this.selectedEvents.map((e) => e.state))];
    }

    @computed
    get selectedTransitionable() {
        return this.selectedEvents.every((e) => e.transitionAllowed.allowed);
    }

    @computed
    get selectedTransitionIssues() {
        return new Set(this.selectedEvents.flatMap((e) => e.transitionAllowed.reason).filter((x) => !!x));
    }

    @computed
    get selectedDeletable() {
        return this.selectedEvents.every((e) => e.isDeletable);
    }

    @computed
    get selectedSubscriptionIgnored() {
        return this.selectedEvents.every((e) => e.isIgnored);
    }

    @action
    toggleShowSelect() {
        this.setShowSelect(!this.showSelect);
    }
    @action
    setShowSelect(show: boolean) {
        this.showSelect = show;
    }

    @action
    setHideDeleted(hide: boolean) {
        this.hideDeleted = hide;
    }

    @action
    toggleOnlyMine(): void {
        this.setOnlyMine(!this.onlyMine);
    }

    @action
    setOnlyMine(onlyMine: boolean): void {
        this.onlyMine = onlyMine;
    }

    @action
    setDescriptionExpanded(expanded: boolean): void {
        this.isDescriptionExpanded = expanded;
    }

    @action
    setOnlyCurrentWeekAndFuture(onlyCurrentWeekAndFuture: boolean): void {
        this._onlyCurrentWeekAndFuture = onlyCurrentWeekAndFuture;
    }

    @action
    setShowAdvancedFilter(showAdvancedFilter: boolean): void {
        this.showAdvancedFilter = showAdvancedFilter;
    }

    @computed
    get hasAdvancedFilters(): boolean {
        return (
            this.departmentIds.size > 0 ||
            this.textFilter.size > 0 ||
            !!this.start ||
            !!this.end ||
            this.classNames.size > 0 ||
            (this.audienceFilter.size > 0 && this.audienceFilter.size < 4)
        );
    }

    @computed
    get showCurrentAndFutureFilter(): boolean {
        const { semester } = this.store;
        return semester?.isCurrent;
    }

    @computed
    get onlyCurrentWeekAndFuture(): boolean {
        const { semester } = this.store;
        if (semester?.isPast) {
            return false;
        }
        return this._onlyCurrentWeekAndFuture;
    }

    @action
    setActiveGroup(kw: string | null): void {
        this.activeGroup = kw;
    }

    @action
    toggleAudienceFilter(audience: EventAudience): void {
        if (this.audienceFilter.has(audience)) {
            this.audienceFilter.delete(audience);
            if (audience !== EventAudience.ALL && this.audienceFilter.has(EventAudience.ALL)) {
                this.audienceFilter.clear();
            }
        } else {
            this.audienceFilter.add(audience);
            if (audience !== EventAudience.ALL && !this.audienceFilter.has(EventAudience.ALL)) {
                this.audienceFilter.add(EventAudience.ALL);
            }
        }
    }

    @computed
    get unfilteredEvents() {
        if (this._events) {
            return this._events;
        }
        const { semester } = this.store;
        if (!semester) {
            return [];
        }
        return semester.events;
    }

    @computed
    get events() {
        const currentKwStart = getLastMonday(new Date()).getTime();
        const s = this.unfilteredEvents.filter((event) => {
            if (this.publicOnly && event.state !== EventState.Published) {
                return false;
            }
            if (event.hasParent) {
                return false;
            }
            let keep = true;
            if (this.onlyMine && !event.isAffectedByUser) {
                keep = false;
            }
            if (keep && this.onlyMine && event.isIgnored) {
                keep = false;
            }
            if (keep && this.audienceFilter) {
                keep = this.audienceFilter.size === 0 || this.audienceFilter.has(event.audience);
            }
            if (keep && this.hideDeleted && event.isDeleted) {
                keep = false;
            }
            if (keep && this.onlyCurrentWeekAndFuture && event.endTimeMs < currentKwStart) {
                keep = false;
            }
            if (keep && this.departmentIds.size > 0) {
                keep = [...event.departmentIdsAll].some((d) => this.departmentIds.has(d));
            }
            if (keep && this.classNames.size > 0) {
                const intersection = new Set(
                    [...this.classNames].filter((c) => event.affectedClassNames.has(c))
                );
                keep = intersection.size > 0;
            }
            if (keep && this.textFilter.size > 0) {
                const tokens = [...this.textFilter];
                const klassNames = event.fClasses.map((c) => c.classes.map((cl) => cl.displayName)).join(' ');
                keep = tokens.some((tkn) => klassNames.match(new RegExp(tkn, 'i')));
                const depNames = event.departmentNames.join(' ');
                if (!keep) {
                    keep = tokens.some((tkn) => {
                        return `${event.description} ${event.descriptionLong} ${event.dayFullStart} ${event.fStartDate} ${event.fStartTime} ${event.fEndDate} ${event.fEndTime} ${event.location} ${depNames}`.match(
                            new RegExp(tkn, 'i')
                        );
                    });
                }
            }
            if (keep && this.start) {
                keep = event.end >= this.start;
            }
            if (keep && this.end) {
                keep = event.start <= this.end;
            }
            return keep;
        });
        return s;
    }

    @action
    toggleDepartment(department: Department): void {
        if (this.departmentIds.has(department.id)) {
            this.departmentIds.delete(department.id);
        } else {
            this.departmentIds.add(department.id);
        }
    }

    @action
    setDepartmentIds(ids: string[]) {
        this.departmentIds.replace(ids);
    }

    @action
    setClassNames(names: string[]) {
        this.classNames.replace(names);
    }

    @action
    setTextFilter(filter: string) {
        this.klassFilter = filter;
        this.textFilter.clear();
        filter.split(/[,|;|\s]+/).forEach((f) => {
            if (f) {
                this.textFilter.add(f);
            }
        });
    }

    @action
    setStartFilter(date: Date | null): void {
        this.start = date;
    }

    @action
    setEndFilter(date: Date | null): void {
        this.end = date;
    }

    @computed
    get isEditing(): boolean {
        return this.events.some((e) => e.isEditing);
    }
}

export default EventTable;
