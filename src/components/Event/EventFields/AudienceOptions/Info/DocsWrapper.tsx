import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { default as InfoComponent } from '.';
import Event from '@site/src/models/Event';
import { EventAudience, EventState } from '@site/src/api/event';

interface Props {}

const Info = observer((props: Props) => {
    const [dummyEvent, _] = React.useState(
        new Event({ state: EventState.Draft, audience: EventAudience.LP } as any, {} as any)
    );
    return <InfoComponent event={dummyEvent} />;
});

export default Info;
