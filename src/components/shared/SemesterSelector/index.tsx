import clsx from 'clsx';

import { useWindowSize } from '@docusaurus/theme-common';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import Button from '../Button';
import { ArrowLeft, ArrowRight, Calendar, Loading, SIZE_XS } from '../icons';
import styles from './styles.module.scss';

const SemesterSelector = observer(() => {
    const canUseBrowser = useIsBrowser();
    const viewStore = useStore('viewStore');
    const semesterStore = useStore('semesterStore');
    const windowSize = useWindowSize();
    if (!canUseBrowser) {
        return null;
    }
    if (!semesterStore.currentSemester) {
        return <Loading />;
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
                <ul className={clsx('dropdown__menu', styles.dropdownMenu)}>
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
