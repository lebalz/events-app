import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { translate } from '@docusaurus/Translate';
import { Icon, SIZE_S } from '../../../shared/icons';
import {
    mdiArrowCollapseHorizontal,
    mdiArrowExpandHorizontal,
    mdiArrowLeftRight,
    mdiBookmarkCheck,
    mdiCheckDecagramOutline,
    mdiSchool,
    mdiSortAscending,
    mdiSortDescending,
    mdiTools
} from '@mdi/js';
import Checkbox from '../../../shared/Checkbox';
import Button, { ButtonIcon } from '../../../shared/Button';
import { ConfigOptionsSortable, DefaultConfig } from '.';
import Tooltip from '../../../shared/Tooltip';
import { useStore } from '@site/src/stores/hooks';

interface Props extends Partial<ConfigOptionsSortable> {
    gridColumn: number;
    name: keyof typeof DefaultConfig;
    active?: 'asc' | 'desc' | boolean;
    onClick?: () => void;
}

const HeaderTitles: Record<keyof typeof DefaultConfig, string> = {
    state: translate({
        message: 'Zustand',
        id: 'eventGrid.header.state',
        description: 'Label for the Event Grid Columns'
    }),
    createdAt: translate({
        message: 'Erstellt am',
        id: 'eventGrid.header.createdAt',
        description: 'Label for the Event Grid Columns'
    }),
    updatedAt: translate({
        message: 'Geändert am',
        id: 'eventGrid.header.updatedAt',
        description: 'Label for the Event Grid Columns'
    }),
    isValid: translate({
        message: 'Valid',
        id: 'eventGrid.header.isValid',
        description: 'Label for the Event Grid Columns'
    }),
    select: translate({
        message: 'Auswählen',
        id: 'eventGrid.header.select',
        description: 'Label for the Event Grid Columns'
    }),
    kw: translate({
        message: 'KW',
        id: 'eventGrid.header.kw',
        description: 'Label for the Event Grid Columns'
    }),
    nr: translate({
        message: 'Nr',
        id: 'eventGrid.header.nr',
        description: 'Label for the Event Grid Row Number'
    }),
    actions: translate({
        message: 'Aktionen',
        id: 'eventGrid.header.actions',
        description: 'Label for the Event Grid Columns'
    }),
    author: translate({
        message: 'Author',
        id: 'eventGrid.header.author',
        description: 'Label for the Event Grid Columns'
    }),
    day: translate({
        message: 'Tag',
        id: 'eventGrid.header.day',
        description: 'Label for the Event Grid Columns'
    }),
    description: translate({
        message: 'Stichworte',
        id: 'eventGrid.header.description',
        description: 'Label for the Event Grid Columns'
    }),
    start: translate({
        message: 'Start',
        id: 'eventGrid.header.start',
        description: 'Label for the Event Grid Columns'
    }),
    end: translate({
        message: 'Ende',
        id: 'eventGrid.header.end',
        description: 'Label for the Event Grid Columns'
    }),
    location: translate({
        message: 'Ort',
        id: 'eventGrid.header.location',
        description: 'Label for the Event Grid Columns'
    }),
    userGroup: translate({
        message: 'Gruppe',
        id: 'eventGrid.header.userGroup',
        description: 'Label for the Event Grid Columns'
    }),
    departmens: translate({
        message: 'Abteilungen',
        id: 'eventGrid.header.departmens',
        description: 'Label for the Event Grid Columns'
    }),
    classes: translate({
        message: 'Klassen',
        id: 'eventGrid.header.classes',
        description: 'Label for the Event Grid Columns'
    }),
    descriptionLong: translate({
        message: 'Beschreibung',
        id: 'eventGrid.header.descriptionLong',
        description: 'Label for the Event Grid Columns'
    }),
    isDuplicate: translate({
        message: 'Duplikat',
        id: 'eventGrid.header.isDuplicate',
        description: 'Label for the Event Grid Columns'
    })
};

const ColumnHeader = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    let content: JSX.Element | string = HeaderTitles[props.name];
    let title: string | undefined = undefined;
    switch (props.name) {
        case 'actions':
            content = <Icon path={mdiTools} size={SIZE_S} />;
            title = translate({
                message: 'Aktionen',
                id: 'eventGrid.header.actions.title'
            });
            break;
        case 'select':
            content = (
                <div style={{ paddingLeft: '0.2em' }}>
                    <Checkbox checked={props.active as boolean} onChange={props.onClick} />
                </div>
            );
            break;
        case 'state':
            content = <Icon path={mdiCheckDecagramOutline} size={SIZE_S} />;
            break;
        case 'isValid':
            content = <Icon path={mdiBookmarkCheck} size={SIZE_S} />;
            break;
        case 'teachingAffected':
            content = <Icon path={mdiSchool} size={SIZE_S} />;
            title = translate({
                message: 'Sortieren nach "Unterricht betroffen?"',
                id: 'eventGrid.header.teachingAffected.title',
                description: 'Message when hovering the icon'
            });
            break;
        case 'description':
            content = (
                <span className={clsx(styles.descriptionHeader)}>
                    {content}
                    <Button
                        icon={
                            viewStore.eventTable.isDescriptionExpanded
                                ? mdiArrowCollapseHorizontal
                                : mdiArrowExpandHorizontal
                        }
                        size={0.7}
                        active={viewStore.eventTable.isDescriptionExpanded}
                        onClick={() =>
                            viewStore.eventTable.setDescriptionExpanded(
                                !viewStore.eventTable.isDescriptionExpanded
                            )
                        }
                        className={clsx(styles.expandButton)}
                        title={
                            viewStore.eventTable.isDescriptionExpanded
                                ? translate({
                                      description:
                                          'Message when hovering the expand button when it is expanded',
                                      id: 'eventGrid.header.description.expand.title:expanded',
                                      message: 'Beschreibung Verkleinern'
                                  })
                                : translate({
                                      description:
                                          'Message when hovering the expand button when it is collapsed',
                                      id: 'eventGrid.header.description.expand.title:collapsed',
                                      message: 'Beschreibung Vergrössern'
                                  })
                        }
                    />
                </span>
            );
    }
    if (props.sortable) {
        if (typeof content !== 'string') {
            content = <ButtonIcon icon={content} />;
        }
        if (!title) {
            title = translate(
                {
                    message: `Sortieren nach "{column}"`,
                    id: 'eventGrid.header.sortBy.title'
                },
                { column: HeaderTitles[props.name] }
            );
        }
    }
    return (
        <div
            className={clsx(
                styles.cell,
                styles.header,
                props.className,
                props.sortable && styles.sortable,
                props.active && styles.active,
                props.fixed && styles.fixed
            )}
            style={{
                gridColumn: props.gridColumn,
                width: typeof props.sortable === 'string' ? props.sortable : props.width,
                maxWidth: props.maxWidth,
                minWidth: props.direction ? props.minWidthWhenActive : undefined,
                position: props.fixed ? 'sticky' : undefined,
                left: props.fixed?.left,
                right: props.fixed?.right
            }}
        >
            {props.sortable ? (
                <Button
                    size={SIZE_S}
                    className={clsx(styles.sortableButton)}
                    iconSide="left"
                    disabled={!props.sortable}
                    icon={
                        props.active
                            ? props.active === 'asc'
                                ? mdiSortAscending
                                : mdiSortDescending
                            : undefined
                    }
                    onClick={props.sortable ? props.onClick : undefined}
                    title={title}
                >
                    {content}
                </Button>
            ) : (
                <Tooltip title={title}>
                    <span className={clsx(styles.content, styles[props.name])}>{content}</span>
                </Tooltip>
            )}
        </div>
    );
});

export default ColumnHeader;
