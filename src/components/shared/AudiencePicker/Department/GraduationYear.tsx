import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { default as EventModel } from '@site/src/models/Event';
import Klass from '@site/src/models/Untis/Klass';
import Button from '../../Button';
import _ from 'lodash';


interface Props {
    event: EventModel;
    klasses: Klass[];
}

const GraduationYear = observer((props: Props) => {
    const { event, klasses } = props;
    if (klasses.length < 1) {
        return null;
    }
    const { groupName, year, departmentLetter } = klasses[0];
    const some = klasses.some(c => event.affectsClass(c));
    const all = event.classGroups.has(groupName) || (some && klasses.every(c => event.affectsClass(c)));

    return (
        <div className={clsx(styles.year)} key={year}>
            <Button
                text={`${year % 100}${departmentLetter}`}
                active={all}
                color={some ? 'primary' : 'secondary'}
                onClick={() => {
                    event.toggleClassGroup(groupName);
                }}
            />
            {_.sortBy(klasses, ['letter']).map((kl: Klass) => {
                return (<Button
                    key={kl.id}
                    color={kl.department?.color}
                    active={event.affectsClass(kl)}
                    text={kl.letter}
                    title={`${kl.displayName} (${kl.name}) ${kl.department?.name}`}
                    onClick={() => {
                        event.toggleClass(kl.name);
                    }}
                />)
            })}
        </div>
    )
});

export default GraduationYear;