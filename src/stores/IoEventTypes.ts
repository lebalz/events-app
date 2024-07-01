import { Department } from '../api/department';
import { Event, EventState } from '../api/event';
import { EventGroup } from '../api/event_group';
import { Job } from '../api/job';
import { RegistrationPeriod } from '../api/registration_period';
import { Semester } from '../api/semester';
import { User } from '../api/user';
import { view_LessonsAffectedByEvents } from '../api/views';
import { rootStore } from './stores';

export enum IoEvent {
    NEW_RECORD = 'NEW_RECORD',
    CHANGED_RECORD = 'CHANGED_RECORD',
    DELETED_RECORD = 'DELETED_RECORD'
}

export enum RecordType {
    Event = 'EVENT',
    User = 'USER',
    Job = 'JOB',
    Department = 'DEPARTMENT',
    Semester = 'SEMESTER',
    RegistrationPeriod = 'REGISTRATION_PERIOD',
    EventGroup = 'EVENT_GROUP'
}

type TypeRecordMap = {
    [RecordType.Event]: Event;
    [RecordType.User]: User;
    [RecordType.Job]: Job;
    [RecordType.Department]: Department;
    [RecordType.Semester]: Semester;
    [RecordType.RegistrationPeriod]: RegistrationPeriod;
    [RecordType.EventGroup]: EventGroup;
};

export interface NewRecord<T extends RecordType> {
    type: T;
    record: TypeRecordMap[T];
}

export interface ChangedRecord<T extends RecordType> {
    type: T;
    record: TypeRecordMap[T];
}

export interface DeletedRecord {
    type: RecordType;
    id: string;
}

interface NotificationBase {
    to: string;
    toSelf?: true | boolean;
}

interface NotificationNewRecord extends NotificationBase {
    event: IoEvent.NEW_RECORD;
    message: NewRecord<RecordType>;
}

interface NotificationChangedRecord extends NotificationBase {
    event: IoEvent.CHANGED_RECORD;
    message: ChangedRecord<RecordType>;
}

interface NotificationDeletedRecord extends NotificationBase {
    event: IoEvent.DELETED_RECORD;
    message: DeletedRecord;
}

export type Notification = NotificationNewRecord | NotificationChangedRecord | NotificationDeletedRecord;

export enum IoEvents {
    AffectedLessons = 'affectedLessons',
    AffectedLessonsTmp = 'affectedLessons:tmp',
    AffectedTeachers = 'affectedTeachers',
    AffectedTeachersTmp = 'affectedTeachers:tmp'
}

export type ServerToClientEvents = {
    [IoEvent.NEW_RECORD]: (message: NewRecord<RecordType>) => void;
    [IoEvent.CHANGED_RECORD]: (message: ChangedRecord<RecordType>) => void;
    [IoEvent.DELETED_RECORD]: (message: DeletedRecord) => void;
};

export interface ClientToServerEvents {
    [IoEvents.AffectedLessons]: (
        event_id: string,
        semester_id: string,
        callback: (
            result:
                | { state: 'success'; lessons: view_LessonsAffectedByEvents[] }
                | { state: 'error'; message: string }
        ) => void
    ) => void;
    [IoEvents.AffectedLessonsTmp]: (
        event: Event,
        semester_id: string,
        callback: (
            result:
                | { state: 'success'; lessons: view_LessonsAffectedByEvents[] }
                | { state: 'error'; message: string }
        ) => void
    ) => void;
    [IoEvents.AffectedTeachers]: (
        event_id: string,
        semester_id: string,
        callback: (
            result: { state: 'success'; usersIds: string[] } | { state: 'error'; message: string }
        ) => void
    ) => void;
    [IoEvents.AffectedTeachersTmp]: (
        event: Event,
        semester_id: string,
        callback: (
            result: { state: 'success'; usersIds: string[] } | { state: 'error'; message: string }
        ) => void
    ) => void;
}

/* this is additional! */
export const RecordStoreMap: { [key in RecordType]: keyof typeof rootStore } = {
    EVENT: 'eventStore',
    USER: 'userStore',
    JOB: 'jobStore',
    DEPARTMENT: 'departmentStore',
    SEMESTER: 'semesterStore',
    REGISTRATION_PERIOD: 'registrationPeriodStore',
    EVENT_GROUP: 'eventGroupStore'
} as const;
/* proceed */
