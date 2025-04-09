import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as EventModel } from '@site/src/models/Event';
import Klass from '@site/src/models/Untis/Klass';
import Button from '../../../Button';
import _ from 'lodash';
import { translate } from '@docusaurus/Translate';
import { mdiToggleSwitchOffOutline, mdiToggleSwitchOutline } from '@mdi/js';
import { action } from 'mobx';
import { SIZE_S, ToggleHalf } from '../../../icons';

interface Props {
    event: EventModel;
    klasses: Klass[];
    isSpecial?: boolean;
}

const GraduationYear = observer((props: Props) => {
    const { event, klasses } = props;
    if (klasses.length < 1) {
        return null;
    }
    const { groupName, year, displayDepartmentLetter, departmentName } = klasses[0];
    const hasActive = klasses.some((k) => event.classes.has(k.name));
    const allActive = hasActive && klasses.every((k) => event.classes.has(k.name));
    return (
        <div className={clsx(styles.year)} key={year}>
            <Button
                text={`${year % 100}${displayDepartmentLetter}`}
                active={event.affectedClassGroups.has(groupName)}
                className={clsx(
                    styles.classGroup,
                    event.affectedClassGroups.has(groupName) &&
                        !event.classGroups.has(groupName) &&
                        styles.derived
                )}
                color={event.affectedClassGroups.has(groupName) ? 'primary' : 'secondary'}
                title={translate(
                    {
                        message: '{groupName}*: Alle {department}-Klassen des Jahrgangs {year} ausgewählt',
                        id: 'audiencePicker.groupName'
                    },
                    { year: year, groupName: groupName, department: departmentName }
                )}
                onClick={() => {
                    event.toggleClassGroup(groupName);
                }}
            />
            <Button
                icon={allActive ? mdiToggleSwitchOutline : hasActive ? ToggleHalf : mdiToggleSwitchOffOutline}
                color={allActive ? 'green' : hasActive ? 'orange' : 'primary'}
                size={SIZE_S}
                title={translate(
                    {
                        message: 'Alle klassen {action}',
                        id: 'audiencePicker.toggleClasses'
                    },
                    { action: allActive ? 'abwählen' : 'auswählen' }
                )}
                onClick={action(() => {
                    klasses.forEach((k) => {
                        event.setClass(k.name, !allActive);
                    });
                })}
                noBorder
            />
            {_.sortBy(klasses, ['letter']).map((kl: Klass, idx) => {
                return (
                    <Button
                        key={idx}
                        color={kl.department?.color}
                        active={event.affectedClassNames.has(kl.name)}
                        className={clsx(
                            event.affectedClassNames.has(kl.name) &&
                                !event.classes.has(kl.name) &&
                                styles.derived
                        )}
                        text={kl.letter}
                        title={
                            event.affectedClassNames.has(kl.name) && !event.classes.has(kl.name)
                                ? translate(
                                      {
                                          message: `{name} bereits aktiv über Jahrgang oder Abteilung {department}`,
                                          id: 'audiencePicker.className.derived'
                                      },
                                      { name: kl.displayName, department: kl.departmentName }
                                  )
                                : `${kl.displayName}: ${kl.departmentName}`
                        }
                        onClick={() => {
                            event.toggleClass(kl.name);
                        }}
                    />
                );
            })}
        </div>
    );
});

export default GraduationYear;
