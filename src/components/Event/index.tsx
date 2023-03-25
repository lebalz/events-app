import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { toGlobalDate } from '@site/src/models/helpers/time';
import Button from '../shared/Button';
import Icon from '@mdi/react';
import { mdiPlusCircleOutline } from '@mdi/js';
import { SIZE } from '../shared/icons';
interface Props {
}

const Event = observer((props: Props) => {
    const eventStore = useStore('eventStore');
    return (
        <div>
            <Button
                text="Neues Event"
                icon={<Icon path={mdiPlusCircleOutline} size={SIZE} />}
                iconSide="left"
                className={clsx("button--primary")}
                apiState={eventStore.apiStateFor('create')}
                onClick={() => {
                    const now = toGlobalDate(new Date());
                    const t1 = new Date(now);
                    t1.setHours(t1.getHours() + 1);
                    eventStore.create({start: now.toISOString(), end: t1.toISOString()});
                }}
            />
        </div>
    )
});

export default Event;