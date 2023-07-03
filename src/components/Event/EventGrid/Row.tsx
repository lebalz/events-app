import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Event from '@site/src/models/Event';
import { ConfigOptions, DefaultConfig } from '.';
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


interface Props {
    event: Event;
    columns: [keyof typeof DefaultConfig, Partial<ConfigOptions>][];
    index: number;
}

const ComponentMap: Record<keyof typeof DefaultConfig, React.ComponentType<any>> = {
    state: State,
    isValid: IsValid,
    select: Select,
    kw: KW,
    actions: Actions,
    author: Author,
    day: Day,
    description: Description,
    start: StartDateTime,
    end: EndDateTime,
    location: Location,
    userGroup: UserGroup,
    departmens: Departments,
    classes: Klasses,
    descriptionLong: DescriptionLong,
};

const Row = observer((props: Props) => {
    return (
        <>
            {props.columns.map((column, index) => {
                const [name, config] = column;
                const Component = ComponentMap[name];
                return (
                    <div
                        className={clsx(styles.cell, styles[name as string], config.className, (props.index % 2) === 1 && styles.odd)}
                        style={{
                            gridColumn: `${index + 1} / span ${config.colSpan || 1}`,
                            maxWidth: config.maxWidth,
                            width: config.width,
                            position: config.fixed ? 'sticky' : undefined,
                            left: config.fixed?.left,
                            right: config.fixed?.right
                        }}
                        key={index}
                    >
                        <Component
                            event={props.event}
                            className={clsx(styles.content, !props.event.isExpanded && styles.collapsed)}
                            {...config.componentProps}
                        />
                    </div>
                )
            })
            }
        </>
    )
});

export default Row;