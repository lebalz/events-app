import { makeObservable, observable } from 'mobx';
import { Role, User as UserProps } from '../api/user';

export default class User {
  readonly id: string;
  readonly email: string;
  readonly shortName: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly department: string;
  readonly role: Role;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  @observable
  isOutdated: boolean = false;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.role = props.role;
    this.shortName = props.shortName;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.department = props.department;
    this.createdAt = new Date(props.createdAt);
    this.updatedAt = new Date(props.updatedAt);

    makeObservable(this);
  }
}
