import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable, observable } from 'mobx';
import { Department as DepartmentProps } from '../../api/untis';


export default class Department {
  private readonly store: UntisStore;
  readonly id: number;
  readonly name: string;
  readonly longName: string;
  readonly schoolyear_id: number;

  constructor(props: DepartmentProps, schoolyear_id: number, store: UntisStore) {
    this.id = props.id;
    this.name = props.name;
    this.longName = props.longName;
    this.schoolyear_id = schoolyear_id;
    this.store = store;

    makeObservable(this);
  }

  @computed
  get schoolyear() {
    return this.store.findSchoolyear(this.schoolyear_id);
  }
}
