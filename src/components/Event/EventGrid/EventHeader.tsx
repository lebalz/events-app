import { useStore } from '@site/src/stores/hooks';
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styles from './styles.module.scss';
import { Icon, SIZE_S } from '../../shared/icons';
import { mdiTools } from '@mdi/js';
import FullScreenButton from '../../shared/FullScreenButton';
import Checkbox from '../../shared/Checkbox';
import Translate from '@docusaurus/Translate';

interface SelectProps {
    checked?: boolean;
    partialChecked?: boolean;
    isEditGrid?: boolean; /** true when at least one element of the grid is edited */
    onSelectAll?: (v: boolean) => void;
}

const EventHeader = observer((props: SelectProps) => {
    const viewStore = useStore('viewStore');
    const commonStyle = clsx(styles.cell, styles.header);
    return (
        <>
            <div style={{gridColumn: 'isValid'}} className={clsx(commonStyle, styles.isValid)}></div>
            <div style={{gridColumn: 'state'}} className={clsx(commonStyle, styles.state)}></div>
            <div style={{gridColumn: 'select'}} className={clsx(commonStyle, styles.select)}>
                <Checkbox checked={props.checked} onChange={(v) => props.onSelectAll(v)} partialChecked={props.partialChecked} />
            </div>
            <div style={{gridColumn: 'author'}} className={clsx(commonStyle, styles.author)}>
                <Translate id="event.eventGrid.th.author" description='th: author'>
                    Author
                </Translate>
            </div>
            <div style={{gridColumn: 'kw'}} className={clsx(commonStyle, styles.kw)}>
                <Translate id="event.eventGrid.th.kw" description='th: kw'>
                    KW
                </Translate>
            </div>
            <div style={{gridColumn: 'day'}} className={clsx(commonStyle, styles.day)}>
                <Translate id="event.eventGrid.th.day" description='th: day'>
                    Tag
                </Translate>
            </div>
            <div style={{gridColumn: 'description'}} className={clsx(commonStyle, styles.description)}>
                <Translate id="event.eventGrid.th.description" description='th: description'>
                    Stichworte
                </Translate>
            </div>
            <div style={{gridColumn: 'startDate'}} className={clsx(commonStyle, styles.startDate)}>
                <Translate id="event.eventGrid.th.startDate" description='th: startDate'>
                    Start
                </Translate>
            </div>
            <div style={{gridColumn: 'startTime'}} className={clsx(commonStyle, styles.startTime)}>
                <Translate id="event.eventGrid.th.startTime" description='th: startTime'>
                    Zeit
                </Translate>
            </div>
            <div style={{gridColumn: 'endDate'}} className={clsx(commonStyle, styles.endDate)}>
                <Translate id="event.eventGrid.th.endDate" description='th: endDate'>
                    Ende
                </Translate>
            </div>
            <div style={{gridColumn: 'endTime'}} className={clsx(commonStyle, styles.endTime)}>
                <Translate id="event.eventGrid.th.endTime" description='th: endTime'>
                    Zeit
                </Translate>
            </div>
            <div style={{gridColumn: 'location'}} className={clsx(commonStyle, styles.location)}>
                <Translate id="event.eventGrid.th.location" description='th: location'>
                    Ort
                </Translate>
            </div>
            <div style={{gridColumn: 'departments'}} className={clsx(commonStyle, styles.departments, props.isEditGrid && styles.editGrid)}>
                <Translate id="event.eventGrid.th.departments" description='th: departments'>
                    Abteilungen
                </Translate>
            </div>
            <div style={{gridColumn: 'classes'}} className={clsx(commonStyle, styles.classes, props.isEditGrid && styles.editGrid)}>
                <Translate id="event.eventGrid.th.classes" description='th: classes'>
                    Klassen
                </Translate>
            </div>
            <div style={{gridColumn: 'descriptionLong'}} className={clsx(commonStyle, styles.descriptionLong)}>
                <Translate id="event.eventGrid.th.descriptionLong" description='th: descriptionLong'>
                    Beschreibung
                </Translate>
            </div>
            <div style={{gridColumn: 'actions'}} className={clsx(commonStyle, styles.actions)}>
                <Icon path={mdiTools} size={SIZE_S} />
                {viewStore.fullscreen && (
                    <div className={clsx(styles.navbar)}>
                        <div className={clsx(styles.button)}>
                            <FullScreenButton />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
});

export default EventHeader;