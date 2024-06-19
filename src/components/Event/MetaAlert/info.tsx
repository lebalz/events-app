import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Event from '@site/src/models/Event';

interface Props {
    event: Event;
}

const MetaInfoAlert = observer((props: Props) => {
    const { event } = props;
    if (!event.meta?.infos || event.meta.infos.length < 1) {
        return null;
    }
    return (
        <div className={clsx(styles.metaAlert, 'alert', 'alert--info')} role="alert">
            {!event.meta.infosReviewed && (
                <button
                    aria-label="Close"
                    className="clean-btn close"
                    type="button"
                    onClick={() => event.setInfosReviewed()}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            )}
                {event.meta.infos.length === 1 ? (
                    event.meta.infos[0]
                ) : (
                    <ul className={clsx(styles.info)}>
                        {event.meta.infos.map((info, idx) => (
                            <li key={`i-${idx}`}>{info}</li>
                        ))}
                    </ul>
                )}
        </div>
    );
});

export default MetaInfoAlert;
