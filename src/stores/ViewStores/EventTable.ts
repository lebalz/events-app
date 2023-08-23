
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import Event from '../../models/Event';
import User from '../../models/User';
import { EventState } from '../../api/event';
import { ViewStore } from '.';
import Department from '@site/src/models/Department';
import { getKW } from '@site/src/models/helpers/time';

export interface EventViewProps {
    user?: User;
    jobId?: string;
    states?: EventState[];
    ignoreImported?: boolean;
    onlyImported?: boolean;
    onlyDeleted?: boolean;
    orderBy?: `${'start' | 'isValid'}-${'asc' | 'desc'}`;
}

/**
 * route: /table
 */
class EventTable {
    private readonly store: ViewStore;

    /** filter props */
    textFilter = observable.set<string>();

    @observable
    klassFilter = '';

    @observable
    start: Date | null = null;
    @observable
    end: Date | null = null;
    departmentIds = observable.set<string>();

    @observable
    onlyMine: boolean = false;

    @observable
    _onlyCurrentWeekAndFuture: boolean = true;

    @observable
    activeGroup: string | null = null;

    @observable
    showAdvancedFilter = false;

    @observable
    hideDeleted = true;


    constructor(store: ViewStore) {
        this.store = store;
        makeObservable(this);
    }

    @action
    toggleHideDeleted() {
        this.setHideDeleted(!this.hideDeleted);
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
    setOnlyCurrentWeekAndFuture(onlyCurrentWeekAndFuture: boolean): void {
        this._onlyCurrentWeekAndFuture = onlyCurrentWeekAndFuture;
    }

    @action
    setShowAdvancedFilter(showAdvancedFilter: boolean): void {
        this.showAdvancedFilter = showAdvancedFilter;
    }

    @computed
    get hasAdvancedFilters(): boolean {
        return this.departmentIds.size > 0 || this.textFilter.size > 0 || !!this.start || !!this.end;
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

    @computed
    get events() {
        const { semester } = this.store;
        if (!semester) {
            return [];
        }
        const currentKw = getKW(new Date());
        semester.isCurrent
        return semester.events.filter((event) => {
            if (event.state !== EventState.Published) {
                return false;
            }
            let keep = true;
            if (this.onlyMine && !event.isAffectedByUser) {
                keep = false;
            }
            if (keep && this.hideDeleted && event.isDeleted) {
                keep = false;
            }
            if (keep && this.onlyCurrentWeekAndFuture && event.kwEnd < currentKw) {
                keep = false;
            }
            if (keep && this.departmentIds.size > 0) {
                keep = [...event.departmentIdsAll].some((d) => this.departmentIds.has(d));
            }
            if (keep && this.textFilter.size > 0) {
                const tokens = [...this.textFilter]
                const klassNames = event.fClasses.map(c => c.classes.map(cl => cl.displayName)).join(' ');
                keep = tokens.some((tkn) => klassNames.match(new RegExp(tkn, 'i')));
                if (!keep) {
                    keep = tokens.some((tkn) => (event.description + event.descriptionLong + ' ' + event.fStartDate + ' ' + event.fEndDate + ' ' + event.departmentNames.join(' ')).match(new RegExp(tkn, 'i')));
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