import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Icon from '@mdi/react';
import { mdiFullscreen, mdiFullscreenExit } from '@mdi/js';
import { ArrowLeft, ArrowRight } from '../icons';


const SemesterSelector = observer(() => {
    const viewStore = useStore('viewStore');
    const semesterStore = useStore('semesterStore');
    if (semesterStore.semesters.length < 1) {
        return null;
    }
    return (<div className={clsx(styles.semesterSelector)} >
        <button
            className={clsx('badge', 'badge--secondary', 'badge--sm', styles.badgeButton)}
            onClick={() => {
                viewStore.nextSemester(-1);
            }}
        >
            <ArrowLeft />
        </button>
        <div className={clsx(styles.navBadge, 'dropdown', 'dropdown--hoverable')}>
            <button
                className={clsx(
                    'badge',
                    styles.nameBadge,
                    viewStore.semester?.isCurrent ? 'badge--primary' : 'badge--warning'
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
                                styles.userBadge,
                                'badge',
                                'badge--secondary',
                                'dropdown__link'
                            )}
                        >
                            {semester.name}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        <button
            className={clsx('badge', 'badge--secondary', 'badge--sm', styles.badgeButton)}
            onClick={() => {
                viewStore.nextSemester(1);
            }}
        >
            <ArrowRight />
        </button>
    </div>);
});

export default SemesterSelector;