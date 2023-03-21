import { rootStore } from "./stores";

export enum IoEvent {
    NEW_RECORD = 'NEW_RECORD',
    CHANGED_RECORD = 'CHANGED_RECORD',
    DELETED_RECORD = 'DELETED_RECORD',
}


export type RecordTypes = 'EVENT' | 'USER' | 'JOB' | 'DEPARTMENT' | 'SEMESTER' | 'REGISTRATION_PERIOD';

export const RecordStoreMap: {[key in RecordTypes]: keyof typeof rootStore} = {
    EVENT: 'eventStore',
    USER: 'userStore',
    JOB: 'jobStore',
    DEPARTMENT: 'departmentStore',
    SEMESTER: 'semesterStore',
    REGISTRATION_PERIOD: 'registrationPeriodStore'
};


export interface NewRecord {
    record: RecordTypes;
    id: string;
}

export interface ChangedRecord {
    record: RecordTypes;
    id: string;
}
