import { computed, makeObservable, observable, override } from "mobx";
import { DepartmentLetter, Department as DepartmentProps } from "../api/department";
import { DepartmentStore } from "../stores/DepartmentStore";
import Event from '../models/Event';
import ApiModel, { UpdateableProps } from "./ApiModel";
import _ from "lodash";
import { ApiAction } from "../stores/iStore";
import Klass from "./Untis/Klass";

export default class Department extends ApiModel<DepartmentProps, ApiAction> {
    readonly UPDATEABLE_PROPS: UpdateableProps<DepartmentProps>[] = ['name', 'description', 'color', 'letter'];
    readonly store: DepartmentStore;
    readonly _pristine: DepartmentProps;
    readonly id: string;
    readonly createdAt: Date;
    @observable
    name: string;
    @observable.ref
    updatedAt: Date;

    @observable
    color: string;
    
    @observable
    letter: string;

    @observable
    description: string;

    constructor(props: DepartmentProps, store: DepartmentStore) {
        super();
        this.store = store;
        this._pristine = props;
        this.id = props.id;
        this.name = props.name;
        this.color = props.color;
        this.letter = props.letter;
        this.description = props.description;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);
        makeObservable(this);

    }

    /**
     * Example: GBSL/GBJB -> GBSL
     */
    @computed
    get shortName() {
        return this.name?.split(/-|\//)[0] || '-';
    }

    @computed
    get events(): Event[] {
        return this.store.getEvents(this);
    }

    @computed
    get classes(): Klass[] {
        return this.store.getClasses(this);
    }

    @override
    get props(): DepartmentProps {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            letter: this.letter as DepartmentLetter,
            description: this.description,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
        };
    }
}