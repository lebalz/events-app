import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable, observable } from 'mobx';
import { Subject as SubjectProps } from '../../api/untis';


export default class Subject {
  readonly id: number;
  readonly name: string;
  readonly alternate_name: string;
  readonly long_name: string;
  readonly active: boolean;
  readonly schoolyear_id: number;
  private readonly store: UntisStore;

  constructor(props: SubjectProps, schoolyear_id: number, store: UntisStore) {
    this.id = props.id;
    this.name = props.name;
    this.alternate_name = props.alternate_name;
    this.long_name = props.long_name;
    this.active = props.active;
    this.schoolyear_id = schoolyear_id;
    this.store = store;

    makeObservable(this);
  }

  @computed
  get schoolyear() {
    return this.store.findSchoolyear(this.schoolyear_id);
  }
}
