import { makeObservable, observable } from 'mobx';
import { Event as EventProps, EventState } from '../api/event';

export default class Event {
  readonly id: string;
  readonly authorId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly state: EventState;

  categories = observable<string>([]);
  classes = observable<string>([]);
  responsibleIds = observable<string>([]);

  @observable
  description: string;

  @observable
  descriptionLong: string;
  
  @observable
  location: string;
  
  @observable
  endTime: Date;
  
  @observable
  startTime: Date;

  @observable
  isOutdated: boolean = false;

  constructor(props: EventProps) {
    this.id = props.id;
    this.state = props.state;
    this.authorId = props.authorId;
    this.categories.replace(props.categories);
    this.classes.replace(props.classes);
    this.responsibleIds.replace(props.responsibleIds);
    this.description = props.description;
    this.descriptionLong = props.descriptionLong;
    this.startTime = new Date(props.startTime);
    this.endTime = new Date(props.endTime);
    this.createdAt = new Date(props.createdAt);
    this.updatedAt = new Date(props.updatedAt);

    makeObservable(this);
  }
}
