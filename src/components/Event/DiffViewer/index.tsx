import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as EventModel } from '@site/src/models/Event';
import Translate from '@docusaurus/Translate';
import EventOverviewSmall from '../../EventOverviewSmall';

interface Props {
    compare: { a: EventModel; b: EventModel }[];
    labels?: {
        a: string;
        b: string;
    };
    hideHeader?: boolean;
}

const DiffViewer = observer((props: Props) => {
    const { compare, labels } = props;
    return (
        <div className={clsx(styles.diffViewer, 'card')}>
            {!props.hideHeader && (
                <div className={clsx('card__header')}>
                    <h3>
                        <Translate id="diffViewer.title">Unterschiede</Translate>
                    </h3>
                </div>
            )}
            {compare.map((comparison, idx) => {
                return (
                    <div className={clsx(styles.diff, 'card__body')} key={idx}>
                        <div className={styles.event}>
                            {idx === 0 && labels && <h4>{labels.a}</h4>}
                            <EventOverviewSmall event={comparison.a} expandDescriptionLong />
                        </div>
                        <div className={styles.event}>
                            {idx === 0 && labels && <h4>{labels.b}</h4>}
                            <EventOverviewSmall
                                event={comparison.b}
                                compareWith={comparison.a}
                                expandDescriptionLong
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

export default DiffViewer;
