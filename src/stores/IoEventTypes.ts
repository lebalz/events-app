import { Event, EventState } from '../api/event';
import { view_LessonsAffectedByEvents } from '../api/views';
import { rootStore } from './stores';

export enum IoEvent {
    NEW_RECORD = 'NEW_RECORD',
    CHANGED_RECORD = 'CHANGED_RECORD',
    CHANGED_STATE = 'CHANGED_STATE',
    DELETED_RECORD = 'DELETED_RECORD',
    RELOAD_AFFECTING_EVENTS = 'RELOAD_AFFECTING_EVENTS',
    CHANGED_MEMBERS = 'CHANGED_MEMBERS'
}

type RecordTypes =
    | 'EVENT'
    | 'USER'
    | 'JOB'
    | 'DEPARTMENT'
    | 'SEMESTER'
    | 'REGISTRATION_PERIOD'
    | 'EVENT_GROUP';

export interface NewRecord {
    record: RecordTypes;
    id: string;
}

export interface DeletedRecord {
    record: RecordTypes;
    id: string;
}

export interface ChangedRecord {
    record: RecordTypes;
    id: string;
}

export interface ChangedMembers {
    record: RecordTypes;
    id: string;
    memberType: RecordTypes;
    addedIds: string[];
    removedIds: string[];
}

export interface ChangedState {
    state: EventState;
    ids: string[];
}
export interface ReloadAffectingEvents {
    record: 'SEMESTER';
    semesterIds: string[];
}

export type NotificationMessage =
    | NewRecord
    | ChangedRecord
    | ChangedState
    | ReloadAffectingEvents
    | ChangedMembers;

export interface Notification {
    message: NotificationMessage;
    event: IoEvent;
    to: string;
    toSelf?: true | boolean;
}

export enum IoEvents {
    AffectedLessons = 'affectedLessons',
    AffectedLessonsTmp = 'affectedLessons:tmp',
    AffectedTeachers = 'affectedTeachers',
    AffectedTeachersTmp = 'affectedTeachers:tmp'
}

export type ServerToClientEvents = {
    [notification in IoEvent]: (message: NotificationMessage) => void;
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
export const RecordStoreMap: { [key in RecordTypes]: keyof typeof rootStore } = {
    EVENT: 'eventStore',
    USER: 'userStore',
    JOB: 'jobStore',
    DEPARTMENT: 'departmentStore',
    SEMESTER: 'semesterStore',
    REGISTRATION_PERIOD: 'registrationPeriodStore',
    EVENT_GROUP: 'eventGroupStore'
} as const;
/* proceed */
