import { action, computed, makeObservable, observable, override } from 'mobx';
import { DepartmentLetter, Department as DepartmentProps } from '../api/department';
import { DepartmentStore } from '../stores/DepartmentStore';
import Event from '../models/Event';
import ApiModel, { UpdateableProps } from './ApiModel';
import _ from 'lodash';
import { ApiAction } from '../stores/iStore';
import Klass from './Untis/Klass';

export const ALPHABET_CAPITAL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const ALPHABET_SMALL = 'abcdefghijklmnopqrstuvwxyz';

export const Duration4Years = new Set([
    DepartmentLetter.GYMD,
    DepartmentLetter.GYMF,
    DepartmentLetter.WMS,
    DepartmentLetter.ESC
]);

export default class Department extends ApiModel<DepartmentProps, ApiAction> {
    readonly UPDATEABLE_PROPS: UpdateableProps<DepartmentProps>[] = [
        'name',
        'description',
        'color',
        'department1_Id',
        'department2_Id',
        {
            attr: 'letter',
            transform: (val) => {
                const isCapital = val.toUpperCase() === val;
                if (val !== this.letter && this.isCapitalLetter !== isCapital) {
                    /** sid-effect: flip the class letters too */
                    this.update({
                        classLetters: [...this.classLetters].map((l) =>
                            isCapital ? l.toLowerCase() : l.toUpperCase()
                        )
                    });
                }
                return val;
            }
        },
        {
            attr: 'displayLetter',
            transform: (val) => {
                if (!val) {
                    return null;
                }
                const isCapital = val.toUpperCase() === val;
                if (this.isCapitalLetter !== isCapital) {
                    return isCapital ? val.toLowerCase() : val.toUpperCase();
                }
                return val;
            }
        },
        {
            attr: 'classLetters',
            update: action((val: string[]) => {
                this.classLetters.replace([...val].sort());
            })
        }
    ];
    readonly store: DepartmentStore;
    readonly _pristine: DepartmentProps;
    readonly id: string;
    readonly createdAt: Date;
    readonly isUserModel = false;
    @observable accessor name: string;
    @observable.ref accessor updatedAt: Date;

    @observable accessor color: string;

    @observable accessor department1_Id: string | null | undefined;
    @observable accessor department2_Id: string | null | undefined;

    @observable accessor letter: string;
    @observable accessor displayLetter: string | null | undefined;

    classLetters = observable.set<string>([]);

    @observable accessor description: string;

    constructor(props: DepartmentProps, store: DepartmentStore) {
        super();
        this.store = store;
        this._pristine = props;
        this.id = props.id;
        this.name = props.name;
        this.color = props.color;
        this.letter = props.letter;
        this.displayLetter = props.displayLetter;
        this.description = props.description;
        this.classLetters.replace(props.classLetters.sort());
        this.department1_Id = props.department1_Id;
        this.department2_Id = props.department2_Id;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);
    }

    /**
     * Example: GYMD/GYMF -> GYMD+
     */
    @computed
    get shortName() {
        if (this.department2_Id) {
            return `${this.name?.split(/-|\//)[0]}+`;
        }
        return this.name || '-';
    }

    @computed
    get events(): Event[] {
        return this.store.getEvents(this);
    }

    @computed
    get classes(): Klass[] {
        return this.store.getClasses(this);
    }

    @computed
    get department1(): Department | null {
        return this.store.find(this.department1_Id);
    }

    @computed
    get department2(): Department | null {
        return this.store.find(this.department2_Id);
    }

    @computed
    get isSubDepartment(): boolean {
        return !!this.department1_Id;
    }

    @computed
    get subDepartments(): Department[] {
        return this.store.departments.filter((d) => d.department1_Id === this.id);
    }

    @computed
    get isSchool(): boolean {
        return !this.isSubDepartment;
    }

    @computed
    get classGroups(): Set<string> {
        return new Set<string>(this.classes.map((c) => c.name.slice(0, 3)));
    }

    @computed
    get isCapitalLetter() {
        return this.letter === this.letter.toUpperCase();
    }

    @action
    toggleClassLetter(letter: string) {
        this.setClassLetter(letter, !this.classLetters.has(letter));
    }

    @action
    setClassLetter(letter: string, value: boolean) {
        if (value) {
            this.classLetters.add(letter);
        } else {
            this.classLetters.delete(letter);
        }
    }

    @computed
    get validClassLetters() {
        if (this.isCapitalLetter) {
            return ALPHABET_SMALL.split('');
        }
        return ALPHABET_CAPITAL.split('');
    }

    @computed
    get lang(): 'de' | 'fr' {
        return this.isCapitalLetter ? 'de' : 'fr';
    }

    get props(): DepartmentProps {
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            letter: this.letter as DepartmentLetter,
            displayLetter: this.displayLetter as DepartmentLetter | null,
            department1_Id: this.department1_Id,
            department2_Id: this.department2_Id,
            classLetters: [...this.classLetters],
            description: this.description,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    }
}
