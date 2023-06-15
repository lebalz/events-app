import { default as EventModel } from '@site/src/models/Event';
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Badge from '../../shared/Badge';
import KW from '../EventFields/Kw';
import Day from '../EventFields/Day';
import Description from '../EventFields/Description';
import DescriptionLong from '../EventFields/DescriptionLong';
import Actions from '../EventFields/Actions';
import DateTime from '../EventFields/DateTime';
import Location from '../EventFields/Location';
import Audience from '../EventFields/Audience';
import Select from '../EventFields/Select';
import Author from '../EventFields/Author';
import IsValid from '../EventFields/IsValid';
import State from '../EventFields/State';
import {useWindowSize} from '@docusaurus/theme-common';
import { useStore } from '@site/src/stores/hooks';

interface RowProps {
    event: EventModel;
    isEditGrid?: boolean; /** true when at least one element of the grid is edited */
    rowIndex: number;
    onSelect?: (selected: boolean, shiftKey: boolean) => void;
    styles: { [className: string]: string };
}

const Event = observer((props: RowProps) => {
    const viewStore = useStore('viewStore');
    const windowSize = useWindowSize();
    const { event, styles } = props;

    const onClick = windowSize === 'desktop' ? 
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.ctrlKey || e.metaKey) {
                viewStore.setEventModalId(event.id);
            } else if (e.shiftKey && event.isEditable) {
                event.setEditing(true);
            } else {
                event.setExpanded(true);
            }

         } : 
        () => viewStore.setEventModalId(event.id);

    const commonStyle = clsx(
        styles.cell,
        event.isExpanded ? styles.expanded : styles.collapsed,
        props.rowIndex % 2 === 0 ? styles.even : styles.odd,
        event.isDeleted && styles.deleted
    )

    return (
        <React.Fragment>
            <State event={event} styles={styles} className={clsx(commonStyle)} expandeable onClick={onClick} />
            <IsValid event={event} styles={styles} className={clsx(commonStyle)} expandeable onClick={onClick} />
            <Select event={event} styles={styles} className={clsx(commonStyle)} onSelect={props.onSelect} expandeable onClick={onClick} />
            <KW event={event} styles={styles} className={clsx(commonStyle)} expandeable onClick={onClick} />
            <Author event={event} styles={styles} className={clsx(commonStyle)} expandeable onClick={onClick} />
            <Day event={event} styles={styles} className={clsx(commonStyle)} expandeable onClick={onClick} />
            <Description event={event} styles={styles} className={clsx(commonStyle)} isEditable={true} expandeable onClick={onClick} />
            <DateTime event={event} styles={styles} time='start' className={clsx(commonStyle)} isEditable={true} expandeable onClick={onClick} />
            <DateTime event={event} styles={styles} time='end' className={clsx(commonStyle)} isEditable={true} expandeable onClick={onClick} />
            <Location event={event} styles={styles} className={clsx(commonStyle)} isEditable={true} expandeable onClick={onClick} />
            <Audience event={event} styles={styles} className={clsx(commonStyle)} isEditable={true} expandeable onClick={onClick} isEditGrid={props.isEditGrid} />
            <DescriptionLong event={event} styles={styles} className={clsx(commonStyle)} isEditable={true} expandeable onClick={onClick} />
            <Actions event={event} styles={styles} className={clsx(commonStyle)} expandeable />
        </React.Fragment>
    );
});

export default Event;