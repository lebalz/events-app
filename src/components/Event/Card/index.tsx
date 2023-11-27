import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Event from '@site/src/models/Event';
import Badge from '../../shared/Badge';
import Button from '../../shared/Button';
import { mdiStickerCircleOutline } from '@mdi/js';
import { SIZE_XS } from '../../shared/icons';


interface Props {
    event: Event
}

const EventCard = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const {event} = props;

    return (
        <div className={clsx(styles.card, 'card')}>
            <div className={clsx('card__header')}>
                <div className={clsx(styles.badges)}>
                    <Badge
                        text={event.fStartDate}
                        color='secondary'
                    />
                    {
                        event.affectedDepartments.map((d, idx) => {
                            return (<Badge key={d.id} text={d.shortName} color={d.color} />);
                        })
                    }
                    {
                        event.cloned && (
                            <Badge icon={mdiStickerCircleOutline} color="gold" size={SIZE_XS}/>
                        )
                    }
                </div>
                <div className={clsx(styles.badges)}>
                    {
                        event.fClasses.map((c, idx) => {
                            const color = c.classes.length === 0 ? 'red' : 'gray';
                            return (<Badge key={idx} text={c.text} title={c.classes.map(cl => cl.displayName).join(', ')} color={color} />);
                        })
                    }
                    {
                        event._unknownClassGroups.map((cg) => {
                            return (<Badge key={cg} text={`${cg}*`} color="red" />);
                        })
                    }
                </div>

            </div>
            <div className={clsx('card__body')}>
                <p>
                    {event.description}
                </p>
            </div>
            <div className={clsx('card__footer')}>
                <Button
                    text="Mehr"
                    onClick={() => {
                        viewStore.setEventModalId(event.id);
                    }}
                />
            </div>

        </div>
    )
});

export default EventCard;