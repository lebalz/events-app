import React from 'react';
import clsx from 'clsx';

import styles from './cstyles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { default as DepartmentModel } from '@site/src/models/Department';
import Klass from '@site/src/models/Untis/Klass';
import { default as EventModel } from '@site/src/models/Event';
import Button from '../Button';


interface Props {
    event: EventModel;
    departments: DepartmentModel[]
}

const Department = observer((props: Props) => {
    const { departments, event } = props;
    const klasses: { [year: number]: Klass[] } = {};
    departments.map(d => d.classes).flat().forEach((c) => {
        if (!klasses[c.graduationYear]) {
            klasses[c.graduationYear] = [];
        }
        klasses[c.graduationYear] = [...klasses[c.graduationYear], c].sort((a, b) => a.letter.localeCompare(b.letter));
    })
    return (
        <div className={clsx(styles.department)}>{
            Object.keys(klasses).map((year) => {
                if (klasses[year].length === 1) {
                    const kl = klasses[year][0];
                    return (
                        <div className={clsx(styles.year)} key={year}>
                            <Button 
                                text={kl._name} 
                                title={kl._name} 
                                active={event.affectsClass(kl)}
                                color="primary"
                                onClick={() => event.toggleClass(kl._name)}
                            />
                        </div>
                    )
                };
                const some = klasses[year].some(c => event.isAudience(c._name));
                const all = some && klasses[year].every(c => event.isAudience(c._name));
                return (<div className={clsx(styles.year)} key={year}>
                    <Button 
                        text={year.slice(2)} 
                        active={all}
                        color={some ? 'primary' : 'secondary'}
                        onClick={() => {
                            if (all) {
                                klasses[year].forEach(c => {
                                    event.toggleClass(c._name)
                                })
                            } else {
                                klasses[year].forEach(c => {
                                    if (!event.isAudience(c._name)) {
                                        event.toggleClass(c._name)
                                    }
                                })
                            }
                        }}
                    />
                    {klasses[year].map((kl: Klass) => {
                        return (<Button
                            key={kl.id}
                            color="primary"
                            active={event.isAudience(kl._name)}
                            text={kl.letter}
                            title={kl._name}
                            onClick={() => event.toggleClass(kl._name)}
                        />)
                    })}
                </div>);
            })
        }</div>
    )
});

export default Department;