import { makeObservable, computed } from "mobx";
import { JobType, JobState, Job as JobProps } from "../api/job";
import { ApiAction } from "../stores/iStore";
import { JobStore } from "../stores/JobStore";
import ApiModel, { UpdateableProps } from "./ApiModel";


export default class Job extends ApiModel<JobProps, ApiAction> {
    readonly UPDATEABLE_PROPS: UpdateableProps<JobProps>[] = [];
    readonly store: JobStore;
    readonly _pristine: JobProps;
    readonly id: string;
    readonly type: JobType;
    readonly state: JobState;
    readonly userId: string;
    readonly log?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly filename?: string;

    constructor(props: JobProps, store: JobStore) {
        super();
        this._pristine = props;
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

    @computed
    get fLog() {
        /**
         * formatted log
         */
        if (!this.log) {
            return ''
        };
        try {
            return JSON.stringify(JSON.parse(this.log || '[]'), undefined, 2).replaceAll('\\n', '\n')
        } catch {
            return this.log;
        }
    }
}