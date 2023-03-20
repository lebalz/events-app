import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { ArrowLeft, ArrowRight, Calendar } from '../icons';
import Button from '../Button';


const SemesterSelector = observer(() => {
    const viewStore = useStore('viewStore');
    const semesterStore = useStore('semesterStore');
    if (semesterStore.semesters.length < 1) {
        return null;
    }
    return (<div className={clsx(styles.semesterSelector)} >
        <Button
            icon={<ArrowLeft size={0.8} />}
            classNames={['badge', 'badge--secondary', 'badge--sm', styles.button]}
            onClick={() => viewStore.nextSemester(-1)}
        />
        <div className={clsx('dropdown', 'dropdown--hoverable', styles.label)}>
            <button
                className={clsx(
                    'button',
                    'button--sm',
                    styles.labelBadge,
                    viewStore.semester?.isCurrent ? 'button--primary' : 'button--secondary'
                )}
                style={{
                    textOverflow: 'ellipsis',
                    width: '100px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}
            >
                {viewStore.semester?.name}
            </button>
            <ul className="dropdown__menu">
                {semesterStore.semesters.map((semester, idx) => (
                    <li key={idx} onClick={() => viewStore.setSemester(semester)}>
                        <div
                            className={clsx(
                                styles.dropdown,
                                viewStore.semester?.id === semester.id ? 'dropdown__link--active' : '',
                                'dropdown__link'
                            )}
                        >
                            {semester.name}{semester.isCurrent ? <>{' '}<Calendar size={0.6} style={{float: 'right'}} /></> : ''}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        <Button
            icon={<ArrowRight size={0.8} />}
            classNames={['badge', 'badge--secondary', 'badge--sm', styles.button]}
            onClick={() => viewStore.nextSemester(1)}
        />
    </div>);
});

export default SemesterSelector;