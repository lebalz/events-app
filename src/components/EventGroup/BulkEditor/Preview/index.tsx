import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as EventModel } from '@site/src/models/Event';
import { ArrowLeft, ArrowRight, SIZE_S } from '../../../shared/icons';
import { translate } from '@docusaurus/Translate';
import Button from '../../../shared/Button';
import Badge from '../../../shared/Badge';
import DiffViewer from '../../../Event/DiffViewer';
import Icon from '@mdi/react';
import { mdiEye, mdiEyeCircleOutline } from '@mdi/js';

interface Props {
    events: EventModel[];
    changedEvent?: EventModel;
    onChange: (idx: number) => void;
}

const Preview = observer((props: Props) => {
    const { events } = props;
    const [shiftedEventIdx, setShiftedEventIdx] = React.useState(0);
    const viewed = events[shiftedEventIdx];
    if (!viewed) {
        return null;
    }

    return (
        <div>
            <div className={clsx(styles.eventPicker)}>
                <Button
                    icon={<ArrowLeft size={SIZE_S} />}
                    noOutline
                    className={clsx('badge', styles.button)}
                    onClick={() => {
                        const idx = (events.length + shiftedEventIdx - 1) % events.length;
                        setShiftedEventIdx(idx);
                        props.onChange(idx);
                    }}
                />
                <div className={clsx('dropdown', 'dropdown--hoverable', styles.label)}>
                    <button className={clsx('button', 'button--sm', styles.labelBadge, 'button--primary')}>
                        {shiftedEventIdx + 1}. {viewed.description}
                    </button>
                    <ul className={clsx('dropdown__menu', styles.dropdownMenu)}>
                        {events.map((evnt, idx) => (
                            <li
                                key={idx}
                                onClick={() => {
                                    setShiftedEventIdx(idx);
                                    props.onChange(idx);
                                }}
                            >
                                <div
                                    className={clsx(
                                        styles.dropdown,
                                        shiftedEventIdx === idx && 'dropdown__link--active',
                                        'dropdown__link'
                                    )}
                                >
                                    <span className={clsx(styles.labelBadge)}>
                                        {`${idx + 1}. ${evnt.description}`}
                                    </span>
                                    {shiftedEventIdx === idx ? (
                                        <>
                                            {' '}
                                            <Icon
                                                className={clsx(styles.currentBadge)}
                                                path={mdiEye}
                                                size={0.4}
                                                color="var(--ifm-color-primary)"
                                            />
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <Button
                    icon={<ArrowRight size={SIZE_S} />}
                    noOutline
                    className={clsx('badge', styles.button)}
                    onClick={() => {
                        const idx = (shiftedEventIdx + 1) % events.length;
                        setShiftedEventIdx(idx);
                        props.onChange(idx);
                    }}
                />
            </div>
            {props.changedEvent && (
                <DiffViewer
                    compare={[{ a: viewed, b: props.changedEvent }]}
                    labels={{
                        a: translate({ id: 'shiftedDatesEditor.current.label', message: 'Vorher' }),
                        b: translate({ id: 'shiftedDatesEditor.next.label', message: 'Nachher' })
                    }}
                    hideHeader
                />
            )}
        </div>
    );
});

export default Preview;
