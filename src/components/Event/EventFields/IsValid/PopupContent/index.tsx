import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Event from '@site/src/models/Event';
import sharedStyles from '../../styles.module.scss';
import EventOverviewSmall from '../../../EventOverviewSmall';
import Translate, { translate } from '@docusaurus/Translate';

interface Props {
    event: Event;
}

const PopupContent = observer((props: Props) => {
    const { event } = props;
    const errors = event._errors?.details || [];
    const metaWarnings = event.meta?.warningsReviewed ? [] : event.meta?.warnings || [];
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
            {metaWarnings.length > 0 && (
                <ul className={clsx(sharedStyles.warnings)}>
                    {metaWarnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                    ))}
                </ul>
            )}
            {event.overlappingEvents.length > 0 && (
                <div className={clsx(styles.alert, 'alert', 'alert--warning')} role="alert">
                    <div className={clsx(styles.conflicts)}>
                        <h4 className={clsx(styles.title)}>
                            {translate(
                                {
                                    id: 'event.isValid.conflicts',
                                    description:
                                        'Conflicts between events that are overlapping and concerning the same event',
                                    message: '{count} Konflikte'
                                },
                                { count: event.overlappingEvents.length }
                            )}
                        </h4>
                        <div className={clsx(styles.alert, styles.overlappingEvents)}>
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
                </div>
            )}
            {!event.hasOpenRegistrationPeriod && (
                <div className={clsx(styles.alert, 'alert', 'alert--warning')} role="alert">
                    <h4 className={clsx(styles.title)}>
                        <Translate
                            id="event.isValid.noRegistrationPeriod.title"
                            description="Alert message for event without open registration period"
                        >
                            Kein Anmeldefenster
                        </Translate>
                    </h4>
                    <Translate
                        id="event.isValid.noRegistrationPeriod.text"
                        description="Alert message for event without open registration period"
                    >
                        Es gibt keinen offenen Anmeldezeitraum für dieses Event.
                    </Translate>
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
