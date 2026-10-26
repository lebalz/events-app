import { EventAudience, EventState } from '@site/src/api/event';
import Event from '@site/src/models/Event';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { default as InfoComponent } from '.';

interface Props {}

const Info = observer((props: Props) => {
    const [dummyEvent, _] = React.useState(
        new Event({ state: EventState.Draft, audience: EventAudience.LP } as any, {} as any)
    );
    return <InfoComponent event={dummyEvent} />;
});

export default Info;
