import { action, computed, IObservableArray, makeObservable, observable } from 'mobx';
import User from '../../models/User';
import { EventAudience, EventState } from '../../api/event';
import { ViewStore } from '.';
import Department from '@site/src/models/Department';
import { getLastMonday } from '@site/src/models/helpers/time';
import Event, { CURRENT_YYYY_KW } from '@site/src/models/Event';
import _ from 'lodash';
import {
    ColumnConfig,
    ConfigOptions,
    DefaultConfig,
    ViewEvent,
    ViewGroup
} from '@site/src/components/Event/Views/Grid';

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

export const BATCH_SIZE = 15 as const;

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

    @observable accessor sortBy: keyof typeof DefaultConfig = 'start';
    @observable accessor sortDirection: 'asc' | 'desc' = 'asc';
    @observable accessor groupBy: 'yearsKw' | undefined = undefined;
    @observable.ref accessor columnConfig: ColumnConfig;

    lastSelectedEventId: string | null = null;

    /**
     * displays only events that have no parent
     */
    @observable accessor onlyRootEvents = true;

    constructor(store: ViewStore, columnConfig: ColumnConfig, events?: Event[], publicOnly?: boolean) {
        this.store = store;
        this.columnConfig = columnConfig;
        this.publicOnly = !!publicOnly;
        if (events) {
            this._events = observable<Event>(events, { deep: false });
        }
    }

    @action
    onColumnClicked(columnName: string) {
        if (columnName === this.sortBy) {
            this.flipSortDirection();
        } else {
            this.setSortBy(columnName);
        }
    }

    @computed
    get allSelected() {
        return this.selectedEvents.length === this.events.length;
    }

    @computed
    get isLoggedIn() {
        return !!this.store.user;
    }

    @action
    setGroupBy(groupBy: 'yearsKw' | undefined) {
        this.groupBy = groupBy;
    }

    @action
    flipFullSelection() {
        if (this.allSelected) {
            this.selectedEventIds.clear();
        } else {
            this.selectedEventIds.replace(this.events.map((e) => e.id));
        }
    }

    @action
    setColumnConfig(columnConfig: ColumnConfig) {
        this.columnConfig = columnConfig;
    }

    @action
    setOnlyRootEvents(onlyRootEvents: boolean) {
        this.onlyRootEvents = onlyRootEvents;
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
    setSelectedEvents(eventIds: string[], selected: boolean) {
        if (eventIds.length > 0) {
            this.lastSelectedEventId = eventIds[eventIds.length - 1];
        }
        if (selected) {
            this.selectedEventIds.replace([...this.selectedEventIds, ...eventIds]);
        } else {
            const rm = new Set(eventIds);
            this.selectedEventIds.replace([...this.selectedEventIds].filter((eid) => !rm.has(eid)));
        }
    }

    @action
    selectUntil(eventId: string) {
        if (!this.lastSelectedEventId) {
            return this.setSelectedEvents([eventId], !this.selectedEventIds.has(eventId));
        }
        if (this.lastSelectedEventId === eventId) {
            return this.setSelectedEvents([eventId], !this.selectedEventIds.has(eventId));
        }
        const from = this.events.findIndex((e) => e.id === this.lastSelectedEventId);
        const to = this.events.findIndex((e) => e.id === eventId);
        if (from === -1 || to === -1) {
            return;
        }
        const selected = this.selectedEventIds.has(this.lastSelectedEventId);
        this.setSelectedEvents(
            this.events.slice(Math.min(from, to), Math.max(from, to) + 1).map((e) => e.id),
            selected
        );
        this.lastSelectedEventId = eventId;
    }

    @computed
    get selectedEvents() {
        return [...this.selectedEventIds]
            .map((sid) => this.events.find((e) => e.id === sid))
            .filter((e) => !!e);
    }

    @action
    setSortBy(sortBy: string) {
        if (this.sortBy !== sortBy) {
            this.sortBy = sortBy;
            this.setSortDirection('asc');
        }
    }

    @action
    flipSortDirection() {
        this.setSortDirection(this.sortDirection === 'asc' ? 'desc' : 'asc');
    }

    @computed
    get columns(): [keyof typeof DefaultConfig, ConfigOptions][] {
        return this.columnConfig
            .map((col) => {
                const isConfig = typeof col !== 'string';
                const name = isConfig ? col[0] : col;
                const defaultConf = {
                    ...DefaultConfig[name],
                    ...(name === 'select' ? { componentProps: { eventTable: this } } : {})
                };
                if (this.isDescriptionExpanded && name === 'description') {
                    defaultConf.width = '45em';
                }
                if (!defaultConf) {
                    return null;
                }
                return [
                    name,
                    {
                        ...defaultConf,
                        ...(isConfig ? col[1] : {}),
                        direction: this.sortBy === name ? this.sortDirection : undefined
                    }
                ] satisfies [keyof typeof DefaultConfig, ConfigOptions];
            })
            .filter(Boolean);
    }

    @action
    setSortDirection(direction: 'asc' | 'desc') {
        this.sortDirection = direction;
    }

    @computed
    get groupedEvents() {
        const events = _.orderBy(
            this.events,
            [this.sortBy === 'author' ? (e: Event) => e.author.shortName : this.sortBy, 'start'],
            [this.sortDirection, 'asc']
        );
        const transformed: (ViewEvent | ViewGroup)[] = [];
        if (this.groupBy) {
            const byGroup = _.groupBy(events, this.groupBy);
            let idx = 0;
            Object.keys(byGroup)
                .sort()
                .forEach((key) => {
                    transformed.push({
                        type: 'group',
                        groupBy: this.groupBy,
                        group: key.split('-')[1].replace(/^0+/, ''),
                        isCurrent: key === CURRENT_YYYY_KW,
                        events: byGroup[key]
                    });
                    byGroup[key].forEach((event) => {
                        transformed.push({ type: 'event', index: idx, model: event });
                        idx++;
                    });
                });
        } else {
            events.forEach((event, idx) => {
                transformed.push({ type: 'event', model: event, index: idx });
            });
        }
        return _.chunk(transformed, BATCH_SIZE);
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
        if (show && this.columnConfig[0] !== 'select') {
            this.setColumnConfig(['select', ...this.columnConfig]);
        } else if (!show && this.columnConfig[0] === 'select') {
            this.setColumnConfig(this.columnConfig.slice(1));
        }
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
            if (this.onlyRootEvents && event.hasParent) {
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
                        return `${event.linkedUsers.map((u) => u.displayName)} ${event.linkedUsers.map((e) => e.fullName)} ${event.description} ${event.descriptionLong} ${event.dayFullStart} ${event.fStartDate} ${event.fStartTime} ${event.fEndDate} ${event.fEndTime} ${event.location} ${depNames}`.match(
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
