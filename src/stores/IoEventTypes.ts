import { EventState } from "../api/event";
import { rootStore } from "./stores";

export enum IoEvent {
    NEW_RECORD = 'NEW_RECORD',
    CHANGED_RECORD = 'CHANGED_RECORD',
    DELETED_RECORD = 'DELETED_RECORD',
    CHANGED_STATE = 'CHANGED_STATE',
    RELOAD_AFFECTING_EVENTS = 'RELOAD_AFFECTING_EVENTS',
    CHANGED_MEMBERS = 'CHANGED_MEMBERS'
}


export type RecordTypes = 'EVENT' | 'USER' | 'JOB' | 'DEPARTMENT' | 'SEMESTER' | 'REGISTRATION_PERIOD' | 'EVENT_GROUP';

export const RecordStoreMap: {[key in RecordTypes]: keyof typeof rootStore} = {
    EVENT: 'eventStore',
    USER: 'userStore',
    JOB: 'jobStore',
    DEPARTMENT: 'departmentStore',
    SEMESTER: 'semesterStore',
    REGISTRATION_PERIOD: 'registrationPeriodStore',
    EVENT_GROUP: 'eventGroupStore'
} as const;


export interface NewRecord {
    record: RecordTypes;
    id: string;
}

export interface ChangedRecord {
    record: RecordTypes;
    id: string;
}

export interface ChangedState {
    state: EventState;
    ids: string[];
}

export interface ReloadAffectingEvents {
    record: RecordTypes;
    semesterIds?: string[];
    id?: string;
}

export interface ChangedMembers {
    record: RecordTypes;
    id: string;
    memberType: RecordTypes;
    addedIds: string[];
    removedIds: string[];
}