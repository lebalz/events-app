import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styles from './styles.module.scss';
import { Icon, SIZE_S } from '../../shared/icons';
import { mdiToolbox, mdiTools } from '@mdi/js';
import FullScreenButton from '../../shared/FullScreenButton';
import Checkbox from '../../shared/Checkbox';

interface SelectProps {
    checked?: boolean;
    partialChecked?: boolean;
    onSelectAll?: (v: boolean) => void;
}

const NAVBAR_HEIGHT = 60;
const EventHeader = observer((props: SelectProps) => {
    const viewStore = useStore('viewStore');
    const commonStyle = clsx(styles.cell, styles.header);
    return (
        <>
            {props.onSelectAll && (
                <div style={{gridColumn: 'select'}} className={clsx(commonStyle, styles.select)}>
                    <Checkbox checked={props.checked} onChange={(v) => props.onSelectAll(v)} partialChecked={props.partialChecked} />
                </div>
            )}
            <div style={{gridColumn: 'kw'}} className={clsx(commonStyle, styles.kw)}>KW</div>
            <div style={{gridColumn: 'day'}} className={clsx(commonStyle, styles.day)}>Tag</div>
            <div style={{gridColumn: 'description'}} className={clsx(commonStyle, styles.description)}>Stichworte</div>
            <div style={{gridColumn: 'startDate'}} className={clsx(commonStyle, styles.startDate)}>Start</div>
            <div style={{gridColumn: 'startTime'}} className={clsx(commonStyle, styles.startTime)}>Zeit</div>
            <div style={{gridColumn: 'endDate'}} className={clsx(commonStyle, styles.endDate)}>Ende</div>
            <div style={{gridColumn: 'endTime'}} className={clsx(commonStyle, styles.endTime)}>Zeit</div>
            <div style={{gridColumn: 'location'}} className={clsx(commonStyle, styles.location)}>Ort</div>
            <div style={{gridColumn: 'departments'}} className={clsx(commonStyle, styles.departments)}>Abteilungen</div>
            <div style={{gridColumn: 'classes'}} className={clsx(commonStyle, styles.classes)}>Klassen</div>
            <div style={{gridColumn: 'descriptionLong'}} className={clsx(commonStyle, styles.descriptionLong)}>Beschreibung</div>
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