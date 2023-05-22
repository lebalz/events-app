import { Subject as SubjectProps } from '../../api/untis';


export default class Subject {
    readonly name: string;
    readonly description: string;
    readonly departmentName: string;
    constructor(props: SubjectProps) {
        this.name = props.name;
        this.description = props.description;
        this.departmentName = props.departmentName;
    }
}