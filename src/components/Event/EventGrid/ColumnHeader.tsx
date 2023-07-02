import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { ConfigOptions, DefaultConfig } from '.';
import { formatDate } from '@site/src/models/helpers/time';
import Translate, {translate} from '@docusaurus/Translate';
import { Icon, SIZE_S } from '../../shared/icons';
import { mdiArrowDown, mdiArrowUp, mdiBookmarkCheck, mdiCheckDecagramOutline, mdiTools } from '@mdi/js';
import Checkbox from '../../shared/Checkbox';


interface Props extends ConfigOptions {
    gridColumn: number;
    name: keyof typeof DefaultConfig;
    active?: 'asc' | 'desc' | boolean;
    onClick?: () => void;
}

const HeaderTitles: Record<keyof typeof DefaultConfig, string> = {
    state: translate({message: 'Zustand', id: 'eventGrid.header.state', description: 'Label for the Event Grid Columns'}),
    isValid: translate({message: 'Valid', id: 'eventGrid.header.isValid', description: 'Label for the Event Grid Columns'}),
    select: translate({message: 'Auswählen', id: 'eventGrid.header.select', description: 'Label for the Event Grid Columns'}),
    kw: translate({message: 'KW', id: 'eventGrid.header.kw', description: 'Label for the Event Grid Columns'}),
    actions: translate({message: 'Aktionen', id: 'eventGrid.header.actions', description: 'Label for the Event Grid Columns'}),
    author: translate({message: 'Author', id: 'eventGrid.header.author', description: 'Label for the Event Grid Columns'}),
    day: translate({message: 'Tag', id: 'eventGrid.header.day', description: 'Label for the Event Grid Columns'}),
    description: translate({message: 'Stichworte', id: 'eventGrid.header.description', description: 'Label for the Event Grid Columns'}),
    start: translate({message: 'Start', id: 'eventGrid.header.start', description: 'Label for the Event Grid Columns'}),
    end: translate({message: 'Ende', id: 'eventGrid.header.end', description: 'Label for the Event Grid Columns'}),
    location: translate({message: 'Ort', id: 'eventGrid.header.location', description: 'Label for the Event Grid Columns'}),
    userGroup: translate({message: 'Gruppe', id: 'eventGrid.header.userGroup', description: 'Label for the Event Grid Columns'}),
    departmens: translate({message: 'Abteilungen', id: 'eventGrid.header.departmens', description: 'Label for the Event Grid Columns'}),
    classes: translate({message: 'Klassen', id: 'eventGrid.header.classes', description: 'Label for the Event Grid Columns'}),
    descriptionLong: translate({message: 'Beschreibung', id: 'eventGrid.header.descriptionLong', description: 'Label for the Event Grid Columns'}),
};

const ColumnHeader = observer((props: Props) => {
    let content: JSX.Element;
    switch (props.name) {
        case 'actions':
            content = <Icon path={mdiTools} size={SIZE_S} />;
            break;
        case 'select':
            content = <div style={{paddingLeft: '0.2em'}}><Checkbox checked={props.active as boolean} onChange={props.onClick} /></div>;
            break;
        case 'state':
            content = <Icon path={mdiCheckDecagramOutline} size={SIZE_S} />;
            break;
        case 'isValid':
            content = <Icon path={mdiBookmarkCheck} size={SIZE_S} />;
            break;

    }
    return (
        <div
            className={clsx(styles.cell, styles.header, props.className, props.sortable && styles.sortable, props.active && styles.active, props.fixed && styles.fixed)}
            style={{
                gridColumn: props.gridColumn,
                width: props.width,
                maxWidth: props.maxWidth,
                position: props.fixed ? 'sticky' : undefined,
                left: props.fixed?.left,
                right: props.fixed?.right
            }}
            title={HeaderTitles[props.name]}
        >
            <div
                className={clsx(styles.content, styles[props.name])}
                onClick={props.sortable ? props.onClick : undefined}
            >
                {
                    content || HeaderTitles[props.name]
                }
                {props.active && (
                    <Icon
                        size={SIZE_S}
                        path={props.active === 'asc' ? mdiArrowUp : mdiArrowDown}
                    />
                )}
            </div>
        </div>
    )
});

export default ColumnHeader;