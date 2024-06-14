import { action, computed, makeObservable, observable, override } from 'mobx';
import { Role, User as UserProps } from '../api/user';
import { ApiAction } from '../stores/iStore';
import { UntisStore } from '../stores/UntisStore';
import { UserStore } from '../stores/UserStore';
import ApiModel, { UpdateableProps } from './ApiModel';

export default class User extends ApiModel<UserProps, ApiAction> {
  readonly UPDATEABLE_PROPS: UpdateableProps<UserProps>[] = [
    'untisId',
    'role',
    'notifyOnEventUpdate',
    'notifyAdminOnReviewDecision',
    'notifyAdminOnReviewRequest'
  ];
  readonly store: UserStore;
  readonly isUserModel = true;
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
  notifyOnEventUpdate: boolean;
  @observable
  notifyAdminOnReviewRequest: boolean;
  @observable
  notifyAdminOnReviewDecision: boolean;
  @observable
  untisId?: number;

  constructor(props: UserProps, store: UserStore, untisStore: UntisStore) {
    super();
    this._pristine = props;
    this.store = store;
    this.untisStore = untisStore;
    this.id = props.id;
    this.email = props.email;
    this.notifyOnEventUpdate = props.notifyOnEventUpdate;
    this.notifyAdminOnReviewRequest = props.notifyAdminOnReviewRequest;
    this.notifyAdminOnReviewDecision = props.notifyAdminOnReviewDecision;
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
    return this.untisTeacher?.departments || [];
  }

  @computed
  get classes() {
    return this.untisTeacher?.classes || [];
  }

  @computed
  get isAdmin() {
    return this.role === Role.ADMIN;
  }

  @computed
  get lessons() {
    return this.untisTeacher?.lessons || [];
  }

  @computed
  get shortName() {
    return this.untisTeacher?.shortName;
  }

  @computed
  get displayName() {
    return this.untisTeacher?.shortName || `${this.firstName.charAt(0)}. ${this.lastName}`;
  }

  @action
  setUntisId(untisId: number | undefined) {
    this.untisId = untisId;
  }

  @action
  linkUntis(untisId: number | undefined) {
    this.store.linkUserToUntis(this, untisId);
  }

  @computed
  get events() {
    return this.store.usersEvents(this);
  }

  matches(search: RegExp) {
      return search.test(this.firstName) || search.test(this.lastName) || search.test(this.shortName || '');
  }


  @override
  get props() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      notifyOnEventUpdate: this.notifyOnEventUpdate,
      notifyAdminOnReviewRequest: this.notifyAdminOnReviewRequest,
      notifyAdminOnReviewDecision: this.notifyAdminOnReviewDecision,
      role: this.role,
      untisId: this.untisId,
      icsLocator: this.icalUrl,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    }
  }

}
