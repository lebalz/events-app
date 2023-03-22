import { action, computed, makeObservable, observable } from 'mobx';
import { Role, User as UserProps } from '../api/user';
import { UntisStore } from '../stores/UntisStore';
import { UserStore } from '../stores/UserStore';
import ApiModel, { UpdateableProps } from './ApiModel';

export default class User extends ApiModel<UserProps> {
  readonly UPDATEABLE_PROPS: UpdateableProps<UserProps>[] = ['untisId'];
  readonly store: UserStore;
  readonly _pristine: UserProps;
  private readonly untisStore: UntisStore;
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly department: string;
  readonly role: Role;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly icalUrl: string | null;

  @observable
  untisId?: number;

  constructor(props: UserProps, store: UserStore, untisStore: UntisStore) {
    super();
    this._pristine = props;
    this.store = store;
    this.untisStore = untisStore;
    this.id = props.id;
    this.email = props.email;
    this.role = props.role;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.untisId = props.untisId;
    this.icalUrl = props.icsLocator;
    this.createdAt = new Date(props.createdAt);
    this.updatedAt = new Date(props.updatedAt);

    makeObservable(this);
  }

  @computed
  get untisTeacher() {
    return this.untisStore.findTeacher(this.untisId);
  }

  @computed
  get departments() {
    return this.untisTeacher?.departments;
  }

  @computed
  get classes() {
    return this.untisTeacher?.classes;
  }

  @computed
  get lessons() {
    return this.untisTeacher?.lessons;
  }

  @computed
  get shortName() {
    return this.untisTeacher?.shortName;
  }

  @action
  setUntisId(untisId: number | undefined) {
    this.untisId = untisId;
  }

  @action
  linkUntis(untisId: number | undefined) {
    this.store.linkUserToUntis(this, untisId);
  }
}
