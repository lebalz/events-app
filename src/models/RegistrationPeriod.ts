import { action, computed, makeObservable, observable, override } from 'mobx';
import { RegistrationPeriod as RegPeriodProps } from '../api/registration_period';
import { ApiAction } from '../stores/iStore';
import { RegistrationPeriodStore } from '../stores/RegistrationPeriodStore';
import ApiModel, { UpdateableProps } from './ApiModel';
import { formatDateTime, toGlobalDate, toLocalDate } from './helpers/time';
import { rmUndefined } from './helpers/filterHelpers';
import Department from './Department';

export default class RegistrationPeriod extends ApiModel<RegPeriodProps, ApiAction> {
    readonly UPDATEABLE_PROPS: UpdateableProps<RegPeriodProps>[] = [
        'name',
        'description',
        {
            attr: 'start',
            update: action((val: string) => {
                const date = toLocalDate(new Date(val));
                if (date.getTime() > this.end.getTime()) {
                    const diff = this.end.getTime() - this.start.getTime();
                    this.end = new Date(date.getTime() + diff);
                }
                this.start = date;
            })
        },
        {
            attr: 'end',
            update: action((val: string) => {
                const date = toLocalDate(new Date(val));
                if (date.getTime() < this.start.getTime()) {
                    const diff = this.end.getTime() - this.start.getTime();
                    this.start = new Date(date.getTime() - diff);
                }
                this.end = date;
            })
        },
        {
            attr: 'eventRangeStart',
            update: action((val: string) => {
                const date = toLocalDate(new Date(val));
                if (date.getTime() > this.eventRangeEnd.getTime()) {
                    const diff = this.eventRangeEnd.getTime() - this.eventRangeStart.getTime();
                    this.eventRangeEnd = new Date(date.getTime() + diff);
                }
                this.eventRangeStart = date;
            })
        },
        {
            attr: 'eventRangeEnd',
            update: action((val: string) => {
                const date = toLocalDate(new Date(val));
                if (date.getTime() < this.eventRangeStart.getTime()) {
                    const diff = this.eventRangeEnd.getTime() - this.eventRangeStart.getTime();
                    this.eventRangeStart = new Date(date.getTime() - diff);
                }
                this.eventRangeEnd = date;
            })
        },
        'isOpen'
    ];
    readonly _pristine: RegPeriodProps;
    readonly isUserModel = false;
    readonly store: RegistrationPeriodStore;
    readonly id: string;
    readonly createdAt: Date;

    @observable
    name: string;

    @observable
    description: string;

    @observable.ref
    start: Date;

    @observable.ref
    end: Date;

    @observable.ref
    eventRangeStart: Date;

    @observable.ref
    eventRangeEnd: Date;

    @observable
    isOpen: boolean;

    departmentIds = observable.set<string>([]);

    @observable.ref
    updatedAt: Date;

    constructor(props: RegPeriodProps, store: RegistrationPeriodStore) {
        super();
        this.store = store;
        props.departmentIds?.sort();
        this._pristine = props;
        this.id = props.id;
        this.start = toLocalDate(new Date(props.start));
        this.end = toLocalDate(new Date(props.end));
        this.name = props.name;
        this.description = props.description;
        this.eventRangeStart = toLocalDate(new Date(props.eventRangeStart));
        this.eventRangeEnd = toLocalDate(new Date(props.eventRangeEnd));
        this.isOpen = props.isOpen;
        this.departmentIds.replace(props.departmentIds);

        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);
    }

    @override
    get props(): RegPeriodProps {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            start: toGlobalDate(this.start).toISOString(),
            end: toGlobalDate(this.end).toISOString(),
            eventRangeStart: toGlobalDate(this.eventRangeStart).toISOString(),
            eventRangeEnd: toGlobalDate(this.eventRangeEnd).toISOString(),
            isOpen: this.isOpen,
            departmentIds: [...this.departmentIds].sort(),
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    }

    @computed
    get fStart() {
        return formatDateTime(this.start);
    }
    @computed
    get fEnd() {
        return formatDateTime(this.end);
    }
    @computed
    get fEventRangeStart() {
        return formatDateTime(this.eventRangeStart);
    }
    @computed
    get fEventRangeEnd() {
        return formatDateTime(this.eventRangeEnd);
    }

    @action
    setDepartmentIds(ids: string[]) {
        this.departmentIds.replace(ids);
    }

    @computed
    get departments() {
        return rmUndefined(
            [...this.departmentIds].map((dId) => this.store.root.departmentStore.find<Department>(dId))
        );
    }

    @computed
    get isWithinOpenPeriod() {
        const now = new Date();
        return now >= this.start && now <= this.end;
    }

    @computed
    get isPeriodOpen() {
        return this.isOpen || this.isWithinOpenPeriod;
    }
}
