import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable, observable } from 'mobx';
import { UntisTeacher } from '../../api/untis';


export default class Teacher {
    readonly id: number;
    readonly name: string;
    readonly longName: string;
    readonly title: string;
    readonly active: boolean;
    private readonly store: UntisStore;

  constructor(props: UntisTeacher,store: UntisStore) {
    this.id = props.id;
    this.name = props.name;
    this.longName = props.longName;
    this.title = props.title;
    this.active = props.active;
    this.store = store;

    makeObservable(this);
  }

  @computed
  get shortName() {
    return this.name;
  }

  // @computed
  // get schoolyear() {
  //   return this.store.findSchoolyear(this.schoolyear_id);
  // }

  // @computed
  // get departments() {
  //   return this.dids.map((did) => this.store.findDepartment(did.id));
  // }
  // @computed
  // get lessons() {
  //   return this.store.filterLessonsByTeacher(this.id);
  // }
}
