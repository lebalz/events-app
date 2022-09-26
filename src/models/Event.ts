import { computed, makeObservable, observable } from 'mobx';
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
  end: Date;
  
  @observable
  start: Date;

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
    this.start = new Date(props.start);
    this.end = new Date(props.end);
    this.createdAt = new Date(props.createdAt);
    this.updatedAt = new Date(props.updatedAt);

    makeObservable(this);
  }

  @computed
  get durationMS() {
    return this.end.getTime() - this.start.getTime();
  }

  @computed
  get progress() {
    const prog = Date.now() - this.start.getTime();
    if (prog > this.durationMS) {
      return 100;
    }
    if (prog < 0) {
      return 0;
    }
    if (this.durationMS === 0) {
      return 100;
    }
    return Math.round(prog / this.durationMS * 100)
  }
}
