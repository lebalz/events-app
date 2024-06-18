import { computed } from 'mobx';
import { Subject as SubjectProps } from '../../api/untis';
import { UntisStore } from '@site/src/stores/UntisStore';

export default class Subject {
    private readonly store: UntisStore;
    readonly name: string;
    readonly description: string;
    readonly departmentIds: string[];
    constructor(props: SubjectProps, store: UntisStore) {
        this.store = store;
        this.name = props.name;
        this.description = props.description;
        this.departmentIds = props.departmentIds;
    }

    @computed
    get departments() {
        return this.departmentIds.map((did) => this.store.findDepartment(did)).filter((d) => !!d);
    }

    @computed
    get departmentNames() {
        return [...new Set(this.departments.map((d) => d.shortName))].sort().join('/');
    }
}
