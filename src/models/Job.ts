import { makeObservable, computed, observable, action, override } from "mobx";
import { JobType as ApiJobType, JobState, Job as JobProps, UntisSyncJob, UntisImportJob } from "../api/job";
import { ApiAction } from "../stores/iStore";
import { JobStore } from "../stores/JobStore";
import ApiModel, { UpdateableProps } from "./ApiModel";
import Semester from "./Semester";
import { formatDate } from "./helpers/time";


export default class Job extends ApiModel<JobProps, ApiAction> {
    readonly UPDATEABLE_PROPS: UpdateableProps<JobProps>[] = [];
    readonly isUserModel = true;
    readonly store: JobStore;
    readonly _pristine: JobProps;
    readonly id: string;
    readonly type: ApiJobType;
    readonly userId: string;
    readonly log?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    @observable state: JobState;
    @observable description: string;

    constructor(props: JobProps, store: JobStore) {
        super();
        this._pristine = props;
        this.store = store;
        this.id = props.id;
        this.type = props.type;
        this.state = props.state;
        this.userId = props.userId;
        this.log = props.log;
        this.description = props.description;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);

        makeObservable(this);
    }

    static create(props: JobProps, store: JobStore): SyncJob | ImportJob {
        switch (props.type) {
            case ApiJobType.SYNC_UNTIS:
                return new SyncJob(props as UntisSyncJob, store);
            case ApiJobType.IMPORT:
                return new ImportJob(props as UntisImportJob, store);
        }
        throw new Error(`Unknown job type ${(props as any)?.type}`);
    }

    @computed
    get user() {
        return this.store.findUser(this.userId);
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

    apiState(sid: ApiAction) {
        return this.store.apiStateFor(sid);
    }
}

export class SyncJob extends Job {
    readonly UPDATEABLE_PROPS: UpdateableProps<JobProps>[] = ['description', 'state'];
    readonly type: ApiJobType.SYNC_UNTIS = ApiJobType.SYNC_UNTIS;
    readonly semesterId?: string;
    readonly syncDate: Date;
    constructor(props: UntisSyncJob, store: JobStore) {
        super(props, store);
        this.semesterId = props.semesterId;
        this.syncDate = new Date(props.syncDate);
        makeObservable(this);
    }
    @computed
    get fSyncDate() {
        return formatDate(this.syncDate);
    }

    @computed
    get semester(): Semester | undefined {
        return this.store.root.semesterStore.find<Semester>(this.semesterId);
    }

    @computed
    get isLatest() {
        return (this.store.bySemester(this.semesterId) || []).findIndex(j => j.id === this.id) === 0;
    }

    /**
     * Is the sync date in sync with the semester's sync date?
     */
    @computed
    get isInSync() {
        return this.semester?.fUntisSyncDate === this.fSyncDate;
    }

    @override
    get props(): UntisSyncJob {
        return {
            id: this.id,
            type: ApiJobType.SYNC_UNTIS,
            state: this.state,
            userId: this.userId,
            semesterId: this.semesterId,
            syncDate: this.syncDate,
            log: this.log,
            description: this.description,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }

    @action
    cancel() {
        this.store.cancelJob(this);
    }
}


export class ImportJob extends Job {
    readonly type: ApiJobType.IMPORT = ApiJobType.IMPORT;
    readonly filename?: string;

    @observable
    fullyLoaded = false;

    constructor(props: UntisImportJob, store: JobStore) {
        super(props, store);
        this.filename = props.filename;
        makeObservable(this);
    }

    @action
    loadEvents() {
        if (this.fullyLoaded) {
            return;
        }
        this.store.loadJobEvents(this.id).then(() => {
            this.fullyLoaded = true;
        });
    }

    @computed
    get isLoadingEvents() {
        return this.apiState(`load-${this.id}`) === 'loading';
    }

    @computed
    get events() {
        return this.store.jobEvents(this.id);
    }
}

export type JobType = SyncJob | ImportJob;