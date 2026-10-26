import { EventAudience, EventState, TeachingAffected } from '@site/src/api/event';
import Event from '@site/src/models/Event';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Example from '.';

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
