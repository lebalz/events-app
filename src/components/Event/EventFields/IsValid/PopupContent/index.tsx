import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Event from '@site/src/models/Event';
import sharedStyles from '../../styles.module.scss';
import EventOverviewSmall from '../../../EventOverviewSmall';
import { translate } from '@docusaurus/Translate';

interface Props {
    event: Event;
}

const PopupContent = observer((props: Props) => {
    const { event } = props;
    const errors = event._errors?.details || [];
    const warnings = event.meta?.warningsReviewed ? [] : event.meta?.warnings || [];
    const infos = event.meta?.infosReviewed ? [] : event.meta?.infos || [];
    return (
        <>
            {errors.length > 0 && (
                <ul className={clsx(sharedStyles.errors)}>
                    {errors.map((error, index) => (
                        <li key={index}>{error.message}</li>
                    ))}
                </ul>
            )}
            {warnings.length > 0 && (
                <ul className={clsx(sharedStyles.warnings)}>
                    {warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                    ))}
                </ul>
            )}
            {event.overlappingEvents.length > 0 && (
                <div className={clsx(styles.conflicts)}>
                    <h3>
                        {translate(
                            {
                                id: 'event.isValid.conflicts',
                                description:
                                    'Conflicts between events that are overlapping and concerning the same event',
                                message: '{count} Konflikte'
                            },
                            { count: event.overlappingEvents.length }
                        )}
                    </h3>
                    <div className={clsx(styles.overlappingEvents)}>
                        <EventOverviewSmall event={event} className={clsx(styles.main)} />
                        {event.overlappingEvents.map((overlap, idx) => (
                            <EventOverviewSmall
                                event={overlap}
                                key={overlap.id}
                                className={clsx(styles.overview)}
                            />
                        ))}
                    </div>
                </div>
            )}
            {infos.length > 0 && (
                <ul className={clsx(sharedStyles.infos)}>
                    {infos.map((info, index) => (
                        <li key={index}>{info}</li>
                    ))}
                </ul>
            )}
        </>
    );
});

export default PopupContent;
