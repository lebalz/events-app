import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Example from '.';
import Event from '@site/src/models/Event';
import { EventAudience, EventState, TeachingAffected } from '@site/src/api/event';

interface Props {}

const TeachingAffectedExample = observer((props: Props) => {
    const [dummyEvent, _] = React.useState(
        new Event(
            {
                state: EventState.Draft,
                audience: EventAudience.LP,
                teachingAffected: TeachingAffected.YES
            } as any,
            {} as any
        )
    );
    return <Example event={dummyEvent} />;
});

export default TeachingAffectedExample;
