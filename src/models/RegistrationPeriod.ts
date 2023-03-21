import { computed, makeObservable, observable, override } from "mobx";
import { RegistrationPeriod as RegPeriodProps } from "../api/registration_period";
import { RegistrationPeriodStore } from "../stores/RegistrationPeriodStore";
import ApiModel, { UpdateableProps } from "./ApiModel";
import { toGlobalDate, toLocalDate } from "./helpers/time";

export default class RegistrationPeriod extends ApiModel<RegPeriodProps> {
    readonly UPDATEABLE_PROPS: UpdateableProps<RegPeriodProps>[] = [];
    readonly _pristine: RegPeriodProps;
    readonly store: RegistrationPeriodStore;
    readonly id: string;
    readonly name: string;
    readonly createdAt: Date;
    @observable.ref
    start: Date;

    @observable.ref
    end: Date;

    @observable.ref
    updatedAt: Date;

    constructor(props: RegPeriodProps, store: RegistrationPeriodStore) {
        super();
        this.store = store;
        this._pristine = props;
        this.id = props.id;
        this.start = toLocalDate(new Date(props.start));
        this.end = toLocalDate(new Date(props.end));
        this.name = props.name;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);

        makeObservable(this);
    }

    @override
    get props(): RegPeriodProps {
        return {
            id: this.id,
            name: this.name,
            start: toGlobalDate(this.start).toISOString(),
            end: toGlobalDate(this.end).toISOString(),
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
        };
    }
}