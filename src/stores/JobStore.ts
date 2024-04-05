import { action, computed, makeObservable, observable, override } from 'mobx';
import _ from 'lodash';
import { RootStore } from './stores';
import iStore from './iStore';
import { JobAndEvents as JobAndEventsProps, Job as JobProps, JobState, JobType as ApiJobType} from '../api/job';
import { ImportType, importEvents as postImportEvents } from '../api/event';
import Job, { ImportJob, SyncJob } from '../models/Job';
import User from '../models/User';
import { find } from '../api/api_model';
import { EndPoint } from './EndPoint';

export class JobStore extends iStore<JobProps, `importFile-${string}`> {
    readonly root: RootStore;

    readonly ApiEndpoint = new EndPoint('jobs', {authorized: true});

    models = observable<Job>([]);
    constructor(root: RootStore) {
        super();
        this.root = root;
        makeObservable(this);
    }

    createModel(data: JobProps): SyncJob | ImportJob {
        return Job.create(data, this);
    }

    findUser(id?: string) {
        return this.root.userStore.find<User>(id);
    }

    addToStore(data: JobProps, state?: 'load' | 'create', reloadStores?: boolean): Job
    @override
    addToStore(data: JobAndEventsProps, state?: 'load' | 'create', reloadStores?: boolean): Job {
        const job = this.createModel(data);
        if (job.state === JobState.DONE) {
            if (this.initialAuthorizedLoadPerformed) {
                this.removeFromStore(data.id);
                if (reloadStores && job.type === ApiJobType.SYNC_UNTIS) {
                    this.root.departmentStore.reload();
                    this.root.untisStore.reload();
                }
            }
            if (data.events) {
                this.root.eventStore.appendEvents(data.events);
            }
        } else {
            this.removeFromStore(data.id);
        }
        this.models.push(job);
        return job;
    }

    @override
    removeFromStore(id?: string) {
        if (!id) {
            return;
        }
        if (this.initialAuthorizedLoadPerformed) {
            /**
             * remove events created by this job from eventStore
             */
            const eventsToRemove = this.root.eventStore.events.slice().filter((e) => e.jobId === id);
            this.root.eventStore.removeEvents(eventsToRemove);
        }
        /**
         * remove the job from the store
         */
        const job = this.find(id) as Job;
        if (job) {
            this.models.remove(job);
            return job;
        }
    }

    @computed
    get importJobs(): ImportJob[] {
        const models = this.models.slice().filter((j) => j.type === ApiJobType.IMPORT) as ImportJob[];
        return models.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    @computed
    get syncJobs(): SyncJob[] {
        const models = this.models.slice().filter((j) => j.type === ApiJobType.SYNC_UNTIS) as SyncJob[];
        return models.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    @computed
    get hasPendingSyncJobs() {
        return this.syncJobs.some((j) => j.state === JobState.PENDING);
    }

    @action
    loadJob(id: string) {
        return this.loadModel(id);
    }

    @action
    loadJobEvents(id: string) {
        return this.withAbortController(`load-${id}`, (sig) => {
            return find<JobAndEventsProps>(`${this.ApiEndpoint.Base}/${id}`, sig.signal).then(({ data }) => {
                if (data && data.events?.length > 0) {
                    this.root.eventStore.appendEvents(data.events);
                }
            });
        });
    }

    bySemester(semesterId: string) {
        return this.syncJobs.filter((j) => j.semesterId === semesterId);
    }

    @action
    importEvents(file: File, type: ImportType) {
        const formData = new FormData();
        formData.append('terminplan', file);
        return this.withAbortController(`importFile-${file.name}`, (sig) => {
            return postImportEvents(formData, type, sig.signal).then(({ data }) => {
                if (data) {
                    const job = this.addToStore(data, 'create', true);
                    return job;
                }
                return null;
            });
        });
    }

    jobEvents(jobId: string) {
        return this.root.eventStore.byJob(jobId).filter((e) => !e.hasParent);
    }

    @action
    cancelJob(job: Job) {
        if (!this.root.userStore.current?.isAdmin) {
            return;
        }
        job.update({ state: JobState.ERROR, description: 'Canceled' });
        job.save();
    }
}
