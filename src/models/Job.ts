import { makeObservable, computed } from "mobx";
import { JobType, JobState, Job as JobProps } from "../api/job";
import { JobStore } from "../stores/JobStore";


export default class Job {
    private readonly store: JobStore;
    readonly id: string;
    readonly type: JobType;
    readonly state: JobState;
    readonly userId: string;
    readonly log: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly filename?: string;

    constructor(props: JobProps, store: JobStore) {
        this.store = store;
        this.id = props.id;
        this.type = props.type;
        this.state = props.state;
        this.userId = props.userId;
        this.log = props.log;
        this.filename = props.filename;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);

        makeObservable(this);
    }

    @computed
    get user() {
        return this.store.findUser(this.userId);
    }

    @computed
    get events() {
        return this.store.jobEvents(this.id);
    }
}