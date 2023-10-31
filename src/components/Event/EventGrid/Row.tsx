import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Event from '@site/src/models/Event';
import State from '../EventFields/State';
import IsValid from '../EventFields/IsValid';
import Select from '../EventFields/Select';
import KW from '../EventFields/Kw';
import Actions from '../EventFields/Actions';
import Author from '../EventFields/Author';
import Day from '../EventFields/Day';
import Description from '../EventFields/Description';
import DateTime, { EndDateTime, StartDateTime } from '../EventFields/DateTime';
import Location from '../EventFields/Location';
import UserGroup from '../EventFields/UserGroup';
import Departments from '../EventFields/Departments';
import Klasses from '../EventFields/Klasses';
import DescriptionLong from '../EventFields/DescriptionLong';
import DepartmentsOrAudiencePicker from '../EventFields/DepartmentsOrAudience';
import IsDuplicate from '../EventFields/IsDuplicate';
import { ConfigOptionsSortable, DefaultConfig } from '.';
import TeachingAffected from '../EventFields/TeachingAffected';


interface Props {
    event: Event;
    columns: [keyof typeof DefaultConfig, Partial<ConfigOptionsSortable>][];
    index: number;
}

const ComponentMap: Record<keyof typeof DefaultConfig, React.ComponentType<any>> = {
    state: State,
    isValid: IsValid,
    isDuplicate: IsDuplicate,
    select: Select,
    kw: KW,
    teachingAffected: TeachingAffected,
    actions: Actions,
    author: Author,
    day: Day,
    description: Description,
    start: StartDateTime,
    end: EndDateTime,
    location: Location,
    userGroup: UserGroup,
    departmens: DepartmentsOrAudiencePicker,
    classes: Klasses,
    descriptionLong: DescriptionLong,
};

const Row = observer((props: Props) => {
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
                }
                if (span === 0) {
                    return null;
                }

                const gridColumn = `${index + 1} / span ${span}`;
                return (
                    <div
                        className={clsx(styles.cell, (props.event.isDeleted && name !== 'actions') && styles.deleted, styles[name as string], config.className, (props.index % 2) === 1 && styles.odd)}
                        style={{
                            gridColumn: gridColumn,
                            maxWidth: maxWidth,
                            width: (typeof config.sortable === 'string') ? config.sortable : config.width,
                            minWidth: config.direction ? config.minWidthWhenActive : undefined,
                            position: config.fixed ? 'sticky' : undefined,
                            left: config.fixed?.left,
                            right: config.fixed?.right
                        }}
                        onClick={() => props.event.setExpanded(true)}
                        key={index}
                    >
                        <div style={{maxWidth: maxContentWidth}}>
                            <Component
                                event={props.event}
                                className={clsx(styles.content, !props.event.isExpanded && styles.collapsed)}
                                expandeable
                                {...config.componentProps}
                            />
                        </div>
                    </div>
                )
            })
            }
        </>
    )
});

export default Row;