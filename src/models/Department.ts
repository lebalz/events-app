import { computed, makeObservable, observable, override } from "mobx";
import { Department as DepartmentProps } from "../api/department";
import { DepartmentStore } from "../stores/DepartmentStore";
import Event from '../models/Event';
import ApiModel, { UpdateableProps } from "./ApiModel";
import _ from "lodash";
import { ApiAction } from "../stores/iStore";

export default class Department extends ApiModel<DepartmentProps, ApiAction> {
    readonly UPDATEABLE_PROPS: UpdateableProps<DepartmentProps>[] = ['description'];
    readonly store: DepartmentStore;
    readonly _pristine: DepartmentProps;
    readonly id: string;
    readonly name: string;
    readonly createdAt: Date;
    @observable.ref
    updatedAt: Date;

    @observable
    description: string;

    constructor(props: DepartmentProps, store: DepartmentStore) {
        super();
        this.store = store;
        this._pristine = props;
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);

        makeObservable(this);
    }

    @computed
    get events(): Event[] {
        return this.store.getEvents(this);
    }

    @override
    get props(): DepartmentProps {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
        };
    }
}