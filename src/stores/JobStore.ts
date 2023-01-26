import { action, makeObservable, observable } from 'mobx';
import _ from 'lodash';
import axios from 'axios';
import { RootStore } from './stores';
import iStore from './iStore';
import { computedFn } from 'mobx-utils';
import { jobs as fetchJobs, find as fetchJob, destroy as deleteJob } from '../api/job';
import { importExcel as postExcel } from '../api/event';
import { createCancelToken } from '../api/base';
import Job from '../models/Job';

export class JobStore implements iStore<Job[]> {
    private readonly root: RootStore;
    jobs = observable<Job>([]);
    cancelToken = axios.CancelToken.source();
    constructor(root: RootStore) {
        this.root = root;
        makeObservable(this);
    }

    findJob = computedFn(
        function (this: JobStore, id?: string): Job | undefined {
            if (!id) {
                return;
            }
            return this.jobs.find((t) => t.id === id);
        },
        { keepAlive: true }
    )

    findUser(id?: string) {
        return this.root.userStore.find(id);
    }

    @action
    reload() {
        if (this.root.sessionStore.account) {
            this.load();
        }
    }

    @action
    load() {
        return fetchJobs(this.cancelToken)
            .then(
                action(({ data }) => {
                    console.log('jobs', data)
                    if (data) {
                        this.jobs.replace(data.map((d) => new Job(d, this)));
                    }
                    return this.jobs;
                })
            )
    }

    @action
    loadJob(id: string) {
        const [ct] = createCancelToken();
        return fetchJob(id, ct).then(action(({ data }) => {
            const job = new Job(data, this);
            this.root.eventStore.appendEvents(data.events);
            const old = this.findJob(id);
            if (old) {
                this.jobs.remove(old);
            }
            this.jobs.push(job);
            return job;
        }))
    }

    @action
    importExcel(file: File) {
        const formData = new FormData();
        formData.append('terminplan', file);
        const [ct] = createCancelToken();
        postExcel(formData, ct).then(({ data }) => {
            this.jobs.push(new Job(data, this));
        });
    }

    @action
    destroy(job: Job) {
        const [ct] = createCancelToken();
        deleteJob(job.id, ct).then(() => {
            this.root.eventStore.removeEvents(job.events);
            this.jobs.remove(job);
        });
    }

    @action
    reset() {
        this.jobs.clear();
    }

    jobEvents(jobId: string) {
        return this.root.eventStore.byJob(jobId);
    }
}
