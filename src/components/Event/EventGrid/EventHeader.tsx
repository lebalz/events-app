import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styles from './styles.module.scss';

interface RowProps {
}
const NAVBAR_HEIGHT = 60;
const EventHeader = observer((props: RowProps) => {
    const [scrollTop, setScrollTop] = React.useState(0);
    const [hiddenNavbar, setHiddenNavbar] = React.useState(false);

    React.useEffect(() => {
        const onScroll = (e) => {
            const top = e.target.scrollingElement.scrollTop;
            setHiddenNavbar(top > NAVBAR_HEIGHT && top > scrollTop)
            setScrollTop(top);
        }
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [scrollTop])
    const commonStyle = clsx(styles.cell, styles.header, hiddenNavbar && styles.hiddenNavbar);
    return (
        <>
            <div className={clsx(commonStyle, styles.kw)}>KW</div>
            <div className={clsx(commonStyle, styles.day)}>Tag</div>
            <div className={clsx(commonStyle, styles.description)}>Stichworte</div>
            <div className={clsx(commonStyle, styles.startDate)}>Start</div>
            <div className={clsx(commonStyle, styles.startTime)}>Zeit</div>
            <div className={clsx(commonStyle, styles.endDate)}>Ende</div>
            <div className={clsx(commonStyle, styles.endTime)}>Zeit</div>
            <div className={clsx(commonStyle, styles.location)}>Ort</div>
            <div className={clsx(commonStyle, styles.departments)}>Abteilungen</div>
            <div className={clsx(commonStyle, styles.classes)}>Klassen</div>
            <div className={clsx(commonStyle, styles.descriptionLong)}>Beschreibung</div>
        </>
    );
});

export default EventHeader;