import { computed } from 'mobx';
import { Subject as SubjectProps } from '../../api/untis';


export default class Subject {
    readonly name: string;
    readonly description: string;
    readonly departmentNames: string;
    constructor(props: SubjectProps) {
        this.name = props.name;
        this.description = props.description;
        this.departmentNames = props.departmentNames;
    }
}