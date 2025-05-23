import { AxiosPromise } from 'axios';
import api from './base';
import { Job } from './job';
import Joi, { CustomHelpers } from 'joi';
import { KlassName } from '../models/helpers/klassNames';
import { translate } from '@docusaurus/Translate';
import { Color } from '../components/shared/Colors';
import {
    mdiAccountGroup,
    mdiAccountHeart,
    mdiBookCancel,
    mdiCalendarCheck,
    mdiCalendarRemove,
    mdiFileCertificate,
    mdiGlasses,
    mdiPen,
    mdiProgressCheck,
    mdiSchool
} from '@mdi/js';
import { CalendarCheckPartial } from '../components/shared/icons';

export enum EventState {
    Draft = 'DRAFT',
    Review = 'REVIEW',
    Published = 'PUBLISHED',
    Refused = 'REFUSED'
}

export const EventStateTranslation: { [key in EventState]: string } = {
    [EventState.Draft]: translate({
        message: 'Entwurf',
        id: 'event.state.draft',
        description: '[noun] Event state draft'
    }),
    [EventState.Review]: translate({
        message: 'In Prüfung',
        id: 'event.state.review',
        description: '[noun] Event state review'
    }),
    [EventState.Published]: translate({
        message: 'Veröffentlicht',
        id: 'event.state.published',
        description: '[noun] Event state published'
    }),
    [EventState.Refused]: translate({
        message: 'Zurückgewiesen',
        id: 'event.state.refused',
        description: '[noun] Event state refused'
    })
};

export const EventStateActions: { [key in EventState]: string } = {
    [EventState.Draft]: translate({
        message: 'Entwurf',
        id: 'event.state.action:draft',
        description: '[verb] request event state: draft'
    }),
    [EventState.Review]: translate({
        message: 'Prüfen',
        id: 'event.state.action:review',
        description: '[verb] request event: review'
    }),
    [EventState.Published]: translate({
        message: 'Veröffentlichen',
        id: 'event.state.action:publish',
        description: '[verb] request event: published'
    }),
    [EventState.Refused]: translate({
        message: 'Zurückweisen',
        id: 'event.state.action:refuse',
        description: '[verb] request event state: refused'
    })
};

export const EventStateButton: { [state in EventState]: string } = {
    [EventState.Draft]: mdiPen,
    [EventState.Published]: mdiFileCertificate,
    [EventState.Refused]: mdiBookCancel,
    [EventState.Review]: mdiProgressCheck
};

export const EventStateColor: { [state in EventState]: Color } = {
    [EventState.Draft]: 'blue',
    [EventState.Published]: 'green',
    [EventState.Refused]: 'red',
    [EventState.Review]: 'orange'
};

export enum TeachingAffected {
    YES = 'YES',
    PARTIAL = 'PARTIAL',
    NO = 'NO'
}

export enum EventAudience {
    LP = 'LP',
    KLP = 'KLP',
    STUDENTS = 'STUDENTS',
    ALL = 'ALL'
}

export const EventAudienceIcons: { [key in EventAudience]: string } = {
    [EventAudience.LP]: mdiGlasses,
    [EventAudience.KLP]: mdiAccountHeart,
    [EventAudience.STUDENTS]: mdiSchool,
    [EventAudience.ALL]: mdiAccountGroup
};

export const EventAudienceTranslationShort: { [key in EventAudience]: string } = {
    [EventAudience.ALL]: translate({
        message: 'Alle',
        description: 'This event is for everyone, no matter wheter a lesson is affected or not',
        id: 'EventAudience.ALL.description'
    }),
    [EventAudience.KLP]: translate({
        message: 'KLP',
        description: 'Only relevant (and displayed) for class teachers',
        id: 'EventAudience.KLP.description'
    }),
    [EventAudience.LP]: translate({
        message: 'LP',
        description:
            'Only relevant for teachers affected of this class (no matter wheter a lesson is affected or not)',
        id: 'EventAudience.LP.description'
    }),
    [EventAudience.STUDENTS]: translate({
        message: 'SuS',
        description: 'Relevant for SuS only, their KLP will be informed aswell',
        id: 'EventAudience.STUDENTS.description'
    })
};

export const EventAudienceTranslationLong: { [key in EventAudience]: string } = {
    [EventAudience.ALL]: translate({
        message: 'Alle',
        description: 'This event is for everyone, no matter wheter a lesson is affected or not',
        id: 'EventAudience.ALL.description.long'
    }),
    [EventAudience.KLP]: translate({
        message: 'Klassenlehrpersonen',
        description: 'Only relevant (and displayed) for class teachers',
        id: 'EventAudience.KLP.description.long'
    }),
    [EventAudience.LP]: translate({
        message: 'Lehrpersonen',
        description:
            'Only relevant for teachers affected of this class (no matter wheter a lesson is affected or not)',
        id: 'EventAudience.LP.description.long'
    }),
    [EventAudience.STUDENTS]: translate({
        message: 'Schüler:innen',
        description: 'Relevant for SuS only, their KLP will be informed aswell',
        id: 'EventAudience.STUDENTS.description.long'
    })
};

export const EventAudienceOverviewTranslation: { [key in EventAudience]: string } = {
    ...EventAudienceTranslationLong,
    [EventAudience.STUDENTS]: translate({
        message: 'SuS, betroffene LP*',
        description: 'Relevant for SuS only, their KLP will be informed aswell',
        id: 'EventAudience.STUDENTS.description.overview'
    })
};

interface AudienceConfig {
    icon?: string;
    color?: Color;
    example?: string;
    description?: string;
}

interface AffectedAudienceConfig {
    [EventAudience.LP]: AudienceConfig;
    [EventAudience.KLP]?: AudienceConfig;
    [EventAudience.STUDENTS]: AudienceConfig;
    example: string;
}

export const AffectedAudience: { [key in EventAudience]: AffectedAudienceConfig } = {
    [EventAudience.LP]: {
        [EventAudience.LP]: {
            icon: mdiCalendarCheck,
            color: 'green'
        },
        [EventAudience.KLP]: {
            icon: mdiCalendarCheck,
            color: 'green'
        },
        [EventAudience.STUDENTS]: {
            icon: mdiCalendarRemove,
            color: 'red'
        },
        example: translate({
            message: 'Noteneingabe in Evento.',
            id: 'EventAudience.LP.example',
            description: 'Teachers Example'
        })
    },
    [EventAudience.KLP]: {
        [EventAudience.LP]: {
            icon: mdiCalendarRemove,
            color: 'red'
        },
        [EventAudience.KLP]: {
            icon: mdiCalendarCheck,
            color: 'green'
        },
        [EventAudience.STUDENTS]: {
            icon: mdiCalendarRemove,
            color: 'red'
        },
        example: translate({
            message: 'Einsammeln unterschriebener Zeugnisse.',
            id: 'EventAudience.KLP.example',
            description: 'KLP Example'
        })
    },
    [EventAudience.ALL]: {
        [EventAudience.LP]: {
            icon: mdiCalendarCheck,
            color: 'green'
        },
        [EventAudience.KLP]: {
            icon: mdiCalendarCheck,
            color: 'green'
        },
        [EventAudience.STUDENTS]: {
            icon: mdiCalendarCheck,
            color: 'green'
        },
        example: translate({
            message: 'Schulstart nach den Sommerferien',
            id: 'EventAudience.ALL.example',
            description: 'All Example'
        })
    },
    [EventAudience.STUDENTS]: {
        [EventAudience.LP]: {
            icon: CalendarCheckPartial,
            color: 'orange',
            description: translate({
                message: 'Lehrpersonen mit betroffenen Lektionen',
                id: 'EventAudience.STUDENTS.LP.description',
                description: 'audience: students, description for LP'
            })
        },
        [EventAudience.KLP]: {
            icon: mdiCalendarCheck,
            color: 'green',
            description: translate({
                message: 'Klassenlehrpersonen der betroffenen Klassen',
                id: 'EventAudience.STUDENTS.KLP.description',
                description: 'audience: students, description for KLP'
            })
        },
        [EventAudience.STUDENTS]: {
            icon: mdiCalendarCheck,
            color: 'green'
        },
        example: translate({
            message: 'Exkursion mit der Klasse 28Gj',
            id: 'EventAudience.STUDENTS.example',
            description: 'Students Example'
        })
    }
};

export enum ImportType {
    GBSL_XLSX = 'GBSL_XLSX',
    GBJB_CSV = 'GBJB_CSV',
    V1 = 'V1'
}

interface ImportMeta {
    type: 'import';
    version: 'gbsl_xlsx';
    rowNr: number;
    infos: string[];
    infosReviewed: boolean;
    warnings: string[];
    warningsReviewed: boolean;
    raw: any;
}
export type Meta = ImportMeta | null;

export interface PrismaEvent {
    id: string;
    authorId: string;
    start: string;
    end: string;
    location: string;
    description: string;
    descriptionLong: string;
    state: EventState;
    cloned: boolean;
    jobId: string | null;
    classes: KlassName[];
    classGroups: string[];
    audience: EventAudience;
    parentId: string | null;
    clonedFromId: string | null;
    teachingAffected: TeachingAffected;
    affectsDepartment2: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    publishedVersionIds: string[];
    meta?: Meta;
}

export interface Event extends PrismaEvent {
    departmentIds: string[];
}

const TODAY = new Date();

export const JoiEvent = Joi.object<Event>({
    id: Joi.string().required(),
    authorId: Joi.string().required(),
    start: Joi.date()
        .iso()
        .min(`${TODAY.getFullYear() - 1}-01-01`)
        .required()
        .label(translate({ message: 'Start', id: 'joi.event.start', description: 'Start of event' })),
    end: Joi.date()
        .iso()
        .required()
        .min(Joi.ref('start'))
        .required()
        .label(translate({ message: 'Ende', id: 'joi.event.end', description: 'End of event' }))
        .messages({
            'date.min': translate({
                message: 'Ende muss grösser oder gleich Start ({start}) sein',
                id: 'joi.event.end.min',
                description: 'End of event must be after start'
            })
        }),
    location: Joi.string().required().allow(''),
    description: Joi.string()
        .required()
        .label(
            translate({
                message: 'Stichworte',
                id: 'joi.event.description',
                description: 'Description of event'
            })
        )
        .messages({
            'string.empty': translate({
                message: 'Stichworte dürfen nicht leer sein',
                id: 'joi.event.description.empty',
                description: 'Description of event must not be empty'
            })
        }),
    descriptionLong: Joi.string().required().allow(''),
    departmentIds: Joi.array().items(Joi.string()).required(),
    classes: Joi.array().items(Joi.string()).required(),
    classGroups: Joi.array().items(Joi.string()).required(),
    state: Joi.string()
        .valid(...Object.values(EventState))
        .required(),
    cloned: Joi.boolean().required(),
    jobId: Joi.string().allow(null),
    audience: Joi.string()
        .valid(...Object.values(EventAudience))
        .required(),
    teachingAffected: Joi.string()
        .valid(...Object.values(TeachingAffected))
        .required(),
    affectsDepartment2: Joi.boolean().required(),
    parentId: Joi.string().allow(null),
    publishedVersionIds: Joi.array().items(Joi.string()).required(),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().required(),
    deletedAt: Joi.date().iso().allow(null),
    meta: Joi.object().allow(null),
    clonedFromId: Joi.string().allow(null)
}).custom((value: Event, helpers: CustomHelpers<Event>) => {
    if (value.classes.length + value.classGroups.length + value.departmentIds.length === 0) {
        return helpers.error('custom.event.emptyAudience', {
            key: 'audience',
            value: [],
            label: translate({
                message: 'Leere Zielgruppe',
                id: 'joi.event.emptyAudience',
                description: 'Joi validation error for empty audience'
            })
        });
    }
    return value;
}, 'custom event validation');
// .messages({
//     'custom.event.emptyAudience': translate({
//         message: 'Es muss mindestens eine Klasse, Klassegruppe oder Abteilung ausgewählt werden',
//         id: 'joi.event.emptyAudience',
//         description: 'Joi validation error for empty audience'
//     })
// })

/**
 * @see https://github.com/hapijs/joi/blob/master/lib/types/date.js for default messages
 */
export const JoiMessages: Joi.LanguageMessages = {
    'string.empty': translate({
        message: '{{#label}} darf nicht leer sein',
        id: 'joi.string.empty',
        description: 'Joi validation error for empty string'
    }),
    'number.base': translate({
        message: '{{#label}} Muss eine Zahl sein',
        id: 'joi.number.base',
        description: 'Joi validation error for number base'
    }),
    'any.invalid': translate({
        message: '{{#label}} Wert ungültig',
        id: 'joi.any.invalid',
        description: 'Joi validation error for any invalid'
    }),
    'any.required': translate({
        message: '{{#label}} Darf nicht leer sein',
        id: 'joi.any.required',
        description: 'Joi validation error for required value'
    }),
    'date.base': translate({
        message: '{{#label}} ist kein gültiges Datum',
        id: 'joi.date.base',
        description: 'Joi validation error for date base'
    }),
    'date.min': translate({
        message: '{{#label}} muss grösser oder gleich {{:#limit}} sein',
        id: 'joi.date.base',
        description: 'Joi validation error for date min'
    }),
    'custom.event.emptyAudience': translate({
        message: 'Es muss mindestens eine Klasse, Klassengruppe oder Abteilung ausgewählt werden',
        id: 'joi.event.emptyAudience',
        description: 'Joi validation error for empty audience'
    })
};

export function importEvents(formData: FormData, type: ImportType, signal: AbortSignal): AxiosPromise<Job> {
    return api.post(`events/import?type=${type}`, formData, { signal });
}

export function requestState(state: EventState, ids: string[], signal: AbortSignal): AxiosPromise<Event[]> {
    return api.post('events/change_state', { data: { ids: ids, state: state } }, { signal });
}

export function excel(signal: AbortSignal): AxiosPromise {
    return api.post(
        'events/excel',
        {},
        {
            method: 'GET',
            responseType: 'blob', // important
            signal
        }
    );
}

export function clone(eventId: string, signal: AbortSignal): AxiosPromise<Event> {
    return api.post(`events/${eventId}/clone`, {}, { signal });
}

export function normalizeAudience(eventId: string, signal: AbortSignal): AxiosPromise<Event> {
    return api.post(`events/${eventId}/normalize_audience`, {}, { signal });
}

export function all<T>(ids: string[], signal: AbortSignal): AxiosPromise<Event[]> {
    return api.get('events', { params: { ids }, signal });
}

export function updateMeta<T>(id: string, meta: any, signal: AbortSignal): AxiosPromise<Event> {
    return api.put(`events/${id}/meta`, { data: meta }, { signal });
}

export function updateBatched(events: Partial<Event>[], signal: AbortSignal): AxiosPromise<Event[]> {
    return api.put(`events`, { data: events }, { signal });
}

export function deleteMany(eventIds: string[], signal: AbortSignal): AxiosPromise<string[]> {
    return api.delete(`events`, { params: { ids: eventIds }, signal });
}
