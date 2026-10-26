import clsx from 'clsx';
import React from 'react';

import Event from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import { ConfigOptionsSortable, DefaultConfig } from '.';
import DepartmentsOrAudiencePicker from '../../DepartmentsOrAudiencePicker';
import Actions from '../../EventFields/Actions';
import Author from '../../EventFields/Author';
import CreatedAt from '../../EventFields/CreatedAt';
import { EndDateTime, StartDateTime } from '../../EventFields/DateTime';
import Day from '../../EventFields/Day';
import Description from '../../EventFields/Description';
import DescriptionLong from '../../EventFields/DescriptionLong';
import EventGroup from '../../EventFields/EventGroup';
import IsDuplicate from '../../EventFields/IsDuplicate';
import IsValid from '../../EventFields/IsValid';
import Klasses from '../../EventFields/Klasses';
import KW from '../../EventFields/Kw';
import LinkedUsers from '../../EventFields/LinkedUsers';
import Location from '../../EventFields/Location';
import Nr from '../../EventFields/Nr';
import Select from '../../EventFields/Select';
import State from '../../EventFields/State';
import TeachingAffectedIndicator from '../../EventFields/TeachingAffected/TeachingAffectedIndicator';
import UpdatedAt from '../../EventFields/UpdatedAt';
import styles from './styles.module.scss';

interface Props {
    event: Event;
    columns: [keyof typeof DefaultConfig, Partial<ConfigOptionsSortable>][];
    index: number;
}

const ComponentMap: Record<keyof typeof DefaultConfig, React.ComponentType<any>> = {
    updatedAt: UpdatedAt,
    createdAt: CreatedAt,
    state: State,
    isValid: IsValid,
    isDuplicate: IsDuplicate,
    select: Select,
    nr: Nr,
    kw: KW,
    teachingAffected: TeachingAffectedIndicator,
    actions: Actions,
    author: Author,
    day: Day,
    description: Description,
    start: StartDateTime,
    end: EndDateTime,
    location: Location,
    userGroup: EventGroup,
    departments: DepartmentsOrAudiencePicker,
    classes: Klasses,
    linkedUsers: LinkedUsers,
    descriptionLong: DescriptionLong
};

const Row = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const linkedUsersIdx = props.columns.findIndex((c) => (Array.isArray(c) ? c[0] : c) === 'linkedUsers');
    const canExpand = linkedUsersIdx > 0 ? (props.columns[linkedUsersIdx][1].colSpan ?? 1) > 0 : false;
    return (
        <>
            {props.columns.map((column, index) => {
                const [name, config] = column;
                const Component = ComponentMap[name];
                let span = config.colSpan ?? 1;
                let maxWidth = config.maxWidth;
                let maxContentWidth = config.maxContentWidth;
                if (props.event.isEditing && config.onEdit) {
                    span = config.onEdit.colSpan ?? 1;
                    maxWidth = config.onEdit.maxWidth ?? maxWidth;
                    maxContentWidth = config.onEdit.maxContentWidth ?? maxContentWidth;
                } else {
                    if (
                        canExpand &&
                        linkedUsersIdx > 0 &&
                        index === linkedUsersIdx - 1 &&
                        props.event.linkedUserIds.size === 0
                    ) {
                        span += 1;
                        maxContentWidth = `calc(${maxContentWidth} + ${props.columns[linkedUsersIdx][1].maxContentWidth ?? 0})`;
                    }
                    if (canExpand && name === 'linkedUsers' && props.event.linkedUserIds.size === 0) {
                        return null;
                    }
                }
                if (span === 0) {
                    return null;
                }

                const gridColumn = `${index + 1} / span ${span}`;
                return (
                    <div
                        className={clsx(
                            styles.cell,
                            props.event.isDeleted && name !== 'actions' && styles.deleted,
                            styles[name as string],
                            config.className,
                            props.index % 2 === 1 && styles.odd,
                            props.event.isToday && styles.today,
                            props.event.isCurrentWeek && styles.currentWeek
                        )}
                        style={{
                            gridColumn: gridColumn,
                            maxWidth: maxWidth,
                            width: typeof config.sortable === 'string' ? config.sortable : config.width,
                            minWidth: config.direction ? config.minWidthWhenActive : undefined,
                            position: config.fixed ? 'sticky' : undefined,
                            left: config.fixed?.left,
                            right: config.fixed?.right
                        }}
                        onContextMenu={(e) => {
                            if (window.getSelection()?.toString() !== '') {
                                return;
                            }
                            e.preventDefault();
                            viewStore.setEventModalId(props.event.id);
                        }}
                        onClick={(e) => {
                            const target = e.target as HTMLDivElement;
                            /**
                             * prevent expanding the row when the data-popup was dismissed
                             */
                            if (target.getAttribute('data-popup') === 'tooltip') {
                                return;
                            }
                            if (e.ctrlKey) {
                                viewStore.setEventModalId(props.event.id);
                            } else {
                                if (props.event.isExpanded) {
                                    if (window.getSelection()?.toString() !== '') {
                                        return;
                                    }
                                    props.event.setExpanded(false);
                                } else {
                                    props.event.setExpanded(true);
                                }
                            }
                        }}
                        key={index}
                    >
                        <div style={{ maxWidth: maxContentWidth }}>
                            <Component
                                event={props.event}
                                className={clsx(styles.content, !props.event.isExpanded && styles.collapsed)}
                                expandeable
                                {...config.componentProps}
                            />
                        </div>
                    </div>
                );
            })}
        </>
    );
});

export default Row;
