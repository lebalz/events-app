import clsx from 'clsx';

import Event from '@site/src/models/Event';
import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';

interface Props {
    event: Event;
}

const MetaWarningAlert = observer((props: Props) => {
    const { event } = props;
    if (!event.meta?.warnings || event.meta.warnings.length < 1) {
        return null;
    }
    return (
        <div className={clsx(styles.metaAlert, 'alert', 'alert--warning')} role="alert">
            {!event.meta.warningsReviewed && (
                <button
                    aria-label="Close"
                    className="clean-btn close"
                    type="button"
                    onClick={() => event.setWarningsReviewed()}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            )}
            {event.meta.warnings.length === 1 ? (
                event.meta.warnings[0]
            ) : (
                <ul className={clsx(styles.warning)}>
                    {event.meta.warnings.map((warning, idx) => (
                        <li key={`w-${idx}`}>{warning}</li>
                    ))}
                </ul>
            )}
        </div>
    );
});

export default MetaWarningAlert;
