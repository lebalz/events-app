import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { ArrowLeft, ArrowRight, Calendar, Loading, SIZE_S, SIZE_XS } from '../icons';
import Button from '../Button';
import { ApiState } from '@site/src/stores/iStore';
import { useWindowSize } from '@docusaurus/theme-common';

const SemesterSelector = observer(() => {
    const viewStore = useStore('viewStore');
    const semesterStore = useStore('semesterStore');
    const windowSize = useWindowSize();
    if (semesterStore.apiStateFor('loadAll') === ApiState.LOADING) {
        return <Loading />;
    }
    if (semesterStore.semesters.length < 1) {
        return null;
    }
    return (
        <div className={clsx(styles.semesterSelector)}>
            {windowSize === 'desktop' && (
                <Button
                    icon={<ArrowLeft size={SIZE_XS} />}
                    noOutline
                    className={clsx('badge', styles.button)}
                    onClick={() => viewStore.nextSemester(-1)}
                />
            )}
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
                        overflow: 'hidden'
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
                                {semester.name}
                                {semester.isCurrent ? (
                                    <>
                                        {' '}
                                        <Calendar size={SIZE_XS} style={{ float: 'right' }} />
                                    </>
                                ) : (
                                    ''
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {windowSize === 'desktop' && (
                <Button
                    icon={<ArrowRight size={SIZE_XS} />}
                    noOutline
                    className={clsx('badge', styles.button)}
                    onClick={() => viewStore.nextSemester(1)}
                />
            )}
        </div>
    );
});

export default SemesterSelector;
