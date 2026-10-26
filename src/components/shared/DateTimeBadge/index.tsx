import clsx from 'clsx';

import { formatDate, formatTime } from '@site/src/models/helpers/time';
import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';

interface Props {
    date: Date;
    showTime?: boolean;
    compact?: boolean;
}

const DateTimeBadge = observer((props: Props) => {
    return (
        <div className={clsx(styles.badge, props.compact && styles.compact)}>
            <div className={clsx(styles.date)}>{formatDate(props.date, true)}</div>
            {props.showTime && <div className={clsx(styles.time)}>{formatTime(props.date, true)}</div>}
        </div>
    );
});

export default DateTimeBadge;
