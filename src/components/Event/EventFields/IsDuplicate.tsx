import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';

import { mdiAlert } from '@mdi/js';
import Button from '../../shared/Button';
import { Icon } from '../../shared/icons';
import { ReadonlyProps } from './iEventField';

const IsDuplicate = observer((props: ReadonlyProps) => {
    const { event } = props;
    return (
        <div
            style={{ gridColumn: 'isDuplicate' }}
            className={clsx('isDuplicate', styles.isDuplicate, props.className, 'grid-isDuplicate')}
        >
            {event.isDuplicate ? (
                <Button
                    icon={<Icon color="warning" path={mdiAlert} />}
                    onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        console.log(
                            event.id,
                            event.duplicatedEvents.map((e) => e.id)
                        );
                    }}
                />
            ) : (
                ''
            )}
        </div>
    );
});

export default IsDuplicate;
