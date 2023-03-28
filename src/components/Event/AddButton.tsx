import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { toGlobalDate } from '@site/src/models/helpers/time';
import Button from '../shared/Button';
import { mdiPlusCircleOutline } from '@mdi/js';
import { Icon, SIZE } from '../shared/icons';
interface Props {
}

const AddButton = observer((props: Props) => {
    const eventStore = useStore('eventStore');
    return (
        <Button
            text="Neuer Event"
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
    )
});

export default AddButton;