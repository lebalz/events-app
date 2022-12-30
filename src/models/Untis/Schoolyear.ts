import { makeObservable, observable } from 'mobx';
import { Schoolyear as SchoolyearProps } from '../../api/untis';

export default class Schoolyear {
    readonly id: number;
    readonly name: string;
    readonly startDate: Date;
    readonly endDate: Date;

    constructor(props: SchoolyearProps) {
        this.id = props.id;
        this.name = props.name;
        this.startDate = new Date(props.startDate);
        this.endDate = new Date(props.endDate);
    }
}
