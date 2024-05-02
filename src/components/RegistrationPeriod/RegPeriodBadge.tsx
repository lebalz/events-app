import React from 'react';
import clsx from 'clsx';

import styles from './badge.styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import RegistrationPeriod from '@site/src/models/RegistrationPeriod';
import Badge from '../shared/Badge';
import DateTimeBadge from '../shared/DateTimeBadge';
import { mdiCalendar, mdiCalendarEdit, mdiCalendarMonth } from '@mdi/js';
import { Icon, SIZE_S, SIZE_XS } from '../shared/icons';
import Tooltip from '../shared/Tooltip';
import { translate } from '@docusaurus/Translate';


interface Props {
    period: RegistrationPeriod;
}

const TRANSLATIONS = {
    open: translate({message: 'Offen', id: 'registrationPeriod.open'}),
    closed: translate({message: 'Geschlossen', id: 'registrationPeriod.closed'})
}

const RegPeriodBadge = observer((props: Props) => {
    const { period } = props;
    return (
        <div className={clsx(styles.badge)}>
            <Badge 
                text={period.name}
                title={
                    translate(
                        {
                            message: 'Eingabefenster {open}: {description}', 
                            id: 'registrationPeriod.name.tooltip'
                        },
                        {
                            open: period.isPeriodOpen ? TRANSLATIONS.open : TRANSLATIONS.closed,
                            description: period.description
                        }
                    )} 
                color={period.isPeriodOpen ? 'blue' : 'secondary'}
            />
            <Tooltip title={translate({message: 'Eingabefenster: Einreichen von Terminen', id: 'registrationPeriod.registrationWindow.tooltip'})}>
                <div className={clsx(styles.dateRange, 'badge')}>
                    <Icon path={mdiCalendarEdit} size={SIZE_XS} color="blue"/>
                    <DateTimeBadge date={period.start} showTime compact/>
                    <div>-</div>
                    <DateTimeBadge date={period.end} showTime compact/>
                </div>
            </Tooltip>
            <Tooltip title={translate({message: 'Zeitraum, in dem die Termine stattfinden.', id: 'registrationPeriod.eventWindow.tooltip'})}>
                <div className={clsx(styles.dateRange, 'badge')}>
                    <Icon path={mdiCalendarMonth} size={SIZE_XS} color="primary"/>
                    <DateTimeBadge date={period.eventRangeStart} compact/>
                    <div>-</div>
                    <DateTimeBadge date={period.eventRangeEnd} compact/>
                </div>
            </Tooltip>
            <Tooltip title={translate({message: 'Termineingabe für diese Abteilungen (inkl. Bilingue)', id: 'registrationPeriod.departments.tooltip'})}>
                <div className={clsx(styles.departments)}>
                    {
                        period.departments.map((d) => (
                            <Badge key={d.id} text={d.shortName} color={d.color} />
                        ))
                    }
                </div>
            </Tooltip>
        </div>
    )
});

export default RegPeriodBadge;