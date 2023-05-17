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

interface RowProps {
    event: EventModel;
    rowIndex: number;
    onSelect?: (selected: boolean, shiftKey: boolean) => void;
    styles: { [className: string]: string };
}

const Event = observer((props: RowProps) => {
    const { event, styles } = props;

    const commonStyle = clsx(
        styles.cell,
        event.isExpanded ? styles.expanded : styles.collapsed,
        props.rowIndex % 2 === 0 ? styles.even : styles.odd
    )

    return (
        <React.Fragment>
            <State event={event} styles={styles} className={clsx(commonStyle)} expandeable />
            <IsValid event={event} styles={styles} className={clsx(commonStyle)} expandeable />
            <Select event={event} styles={styles} className={clsx(commonStyle)} onSelect={props.onSelect} expandeable />
            <KW event={event} styles={styles} className={clsx(commonStyle)} expandeable />
            <Author event={event} styles={styles} className={clsx(commonStyle)} expandeable />
            <Day event={event} styles={styles} className={clsx(commonStyle)} expandeable />
            <Description event={event} styles={styles} className={clsx(commonStyle)} isEditable={true} expandeable />
            <DateTime event={event} styles={styles} time='start' className={clsx(commonStyle)} isEditable={true} expandeable />
            <DateTime event={event} styles={styles} time='end' className={clsx(commonStyle)} isEditable={true} expandeable />
            <Location event={event} styles={styles} className={clsx(commonStyle)} isEditable={true} expandeable />
            <Audience event={event} styles={styles} className={clsx(commonStyle)} isEditable={true} expandeable />
            <DescriptionLong event={event} styles={styles} className={clsx(commonStyle)} isEditable={true} expandeable />
            <Actions event={event} styles={styles} className={clsx(commonStyle)} expandeable />
        </React.Fragment>
    );
});

export default Event;