import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import {useWindowSize} from '@docusaurus/theme-common';

import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { toGlobalDate } from '@site/src/models/helpers/time';
import Button from '../shared/Button';
import { mdiPlusCircleOutline } from '@mdi/js';
import { Icon, SIZE } from '../shared/icons';
import { translate } from '@docusaurus/Translate';
interface Props {
}

const AddButton = observer((props: Props) => {
    const eventStore = useStore('eventStore');
    const viewStore = useStore('viewStore');
    const windowSize = useWindowSize();
    return (
        <Button
            text={translate({
                message: 'Neues Event',
                description: 'AddButton text',
                id: 'event.AddButton.text'
            })}
            icon={<Icon path={mdiPlusCircleOutline} size={SIZE} />}
            iconSide="left"
            color='primary'
            apiState={eventStore.apiStateFor('create')}
            onClick={() => {
                const now = toGlobalDate(new Date());
                const t1 = new Date(now);
                t1.setHours(t1.getHours() + 1);
                eventStore.create({start: now.toISOString(), end: t1.toISOString()}).then((newEvent) => {
                    if (windowSize === 'mobile') {
                        viewStore.setEventModalId(newEvent.id);
                    }
                })
            }}
        />
    )
});

export default AddButton;