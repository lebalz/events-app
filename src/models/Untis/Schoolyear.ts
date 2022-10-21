import { makeObservable, observable } from 'mobx';
import { Schoolyear as SchoolyearProps } from '../../api/untis';
import moment from 'moment';

export default class Schoolyear {
    readonly id: number;
    readonly name: string;
    readonly startDate: moment.Moment;
    readonly endDate: moment.Moment;

    constructor(props: SchoolyearProps) {
        this.id = props.id;
        this.name = props.name;
        this.startDate = moment.utc(props.startDate);
        this.endDate = moment.utc(props.endDate);
    }
}
