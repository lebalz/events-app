import { computed, makeObservable, observable } from "mobx";
import { RegistrationPeriod as RegPeriodProps } from "../api/registration_period";
import { RegistrationPeriodStore } from "../stores/RegistrationPeriodStore";

export default class RegistrationPeriod {
    private readonly store: RegistrationPeriodStore;
    readonly id: string;
    readonly name: string;
    @observable
    description: string;
    readonly createdAt: Date;
    @observable.ref
    updatedAt: Date;

    constructor(props: RegPeriodProps, store: RegistrationPeriodStore) {
        this.store = store;
        this.id = props.id;
        this.name = props.name;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);

        makeObservable(this);
    }
}