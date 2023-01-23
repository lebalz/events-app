import { computed, makeObservable, observable } from 'mobx';
import moment from 'moment';
import { Role, User as UserProps } from '../api/user';
import { UserStore } from '../stores/UserStore';
import SchoolEvent from './SchoolEvent';
import Teacher from './Untis/Teacher';

export default class User {
  private readonly store: UserStore;
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly department: string;
  readonly role: Role;
  readonly createdAt: moment.Moment;
  readonly updatedAt: moment.Moment;

  @observable
  untisId?: number;

  @observable
  isOutdated: boolean = false;

  constructor(props: UserProps, store: UserStore) {
    this.store = store;
    this.id = props.id;
    this.email = props.email;
    this.role = props.role;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.untisId = props.untisId;
    this.createdAt = moment.utc(props.createdAt);
    this.updatedAt = moment.utc(props.updatedAt);

    makeObservable(this);
  }

  @computed
  get untisTeacher(): Teacher | undefined {
    return this.store.findUntisUser(this.untisId);
  }

  @computed
  get shortName() {
    return this.store.findUntisUser(this.untisId)?.shortName;
  }
}
