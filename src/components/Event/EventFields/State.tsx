import clsx from 'clsx';
import styles from './styles.module.scss';

import { mdiDeleteForever } from '@mdi/js';
import { EventState, EventStateButton, EventStateColor, EventStateTranslation } from '@site/src/api/event';
import Badge from '@site/src/components/shared/Badge';
import { SIZE_S } from '@site/src/components/shared/icons';
import Event from '@site/src/models/Event';
import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';

interface Props extends ReadonlyProps {
    showText?: boolean;
}

const State = observer((props: Props) => {
    const { event, showText } = props;
    const state = event.isDirty && !event.isDraft ? EventState.Draft : event.state;
    return (
        <div
            style={{ gridColumn: 'state' }}
            className={clsx('state', styles.state, !showText && styles.flex, props.className, 'grid-isValid')}
        >
            <div className={clsx(showText && styles.flex)}>
                <Badge
                    icon={EventStateButton[state]}
                    color={EventStateColor[state]}
                    size={SIZE_S}
                    title={EventStateTranslation[state]}
                    text={showText ? EventStateTranslation[state] : undefined}
                    iconSide="left"
                />
            </div>
            {event.deletedAt && (
                <Badge
                    icon={mdiDeleteForever}
                    color="red"
                    size={SIZE_S}
                    title={`Gelöscht am ${Event.fDate(event.deletedAt)}`}
                    text={Event.fDate(event.deletedAt)}
                    iconSide="left"
                />
            )}
        </div>
    );
});

export default State;
