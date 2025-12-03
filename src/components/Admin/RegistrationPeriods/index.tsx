import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import RegistrationPeriod from '../../RegistrationPeriod';
import AddButton from '../../Event/AddButton';
import { SEC_2_MS, WEEK_2_MS, toGlobalDate } from '@site/src/models/helpers/time';
import { translate } from '@docusaurus/Translate';

interface Props {}

const RegistrationPeriods = observer((props: Props) => {
    const regPeriodStore = useStore('registrationPeriodStore');
    const semesterStore = useStore('semesterStore');
    return (
        <div>
            <AddButton
                onAdd={() => {
                    const start = toGlobalDate(new Date());
                    const end = toGlobalDate(new Date(start.getTime() + 3 * WEEK_2_MS));
                    const nextSemester = semesterStore.nextSemester(semesterStore.currentSemester?.id, 1);
                    const erStart = nextSemester ? nextSemester.start : start;
                    const erEnd = nextSemester ? nextSemester.end : end;
                    regPeriodStore.create({
                        start: start.toISOString(),
                        end: end.toISOString(),
                        eventRangeStart: erStart.toISOString(),
                        eventRangeEnd: erEnd.toISOString(),
                        name: nextSemester ? nextSemester.name : `Eingabefenster ${start.getFullYear()}`
                    });
                }}
                text={translate({
                    message: 'Eingabefenster hinzufügen',
                    id: 'RegistrationPeriod.addButton.text',
                    description: 'Text of button to add RegistrationPeriod'
                })}
                apiState={regPeriodStore.apiStateFor('create')}
                color="primary"
            />
            <div className={clsx(styles.regPeriods)}>
                {regPeriodStore.registrationPeriods.map((period) => {
                    return (
                        <RegistrationPeriod
                            period={period}
                            key={period.id}
                            className={clsx(styles.regPeriod)}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default RegistrationPeriods;
