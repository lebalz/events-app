import { Event } from './event';

export type JobBase = {
    id: string
    type: JobType
    state: JobState
    userId: string
    log?: string
    description: string
    createdAt: Date
    updatedAt: Date
}

export type UntisImportJob = JobBase & {
    type: JobType.IMPORT,
    filename: string
}

export type UntisSyncJob = JobBase & {
    type: JobType.SYNC_UNTIS,
    semesterId: string
    syncDate: Date
}

export type Job = UntisImportJob | UntisSyncJob;

export type JobAndEvents = Job & {
    events: Event[]
}

export enum JobType {
    IMPORT = 'IMPORT',
    CLONE = 'CLONE',
    SYNC_UNTIS = 'SYNC_UNTIS'
};

export enum JobState {
    PENDING = 'PENDING',
    ERROR = 'ERROR',
    DONE = 'DONE',
    REVERTED = 'REVERTED'
};