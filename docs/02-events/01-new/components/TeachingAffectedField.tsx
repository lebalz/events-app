import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import Event from '@site/src/models/Event';
import { EventAudience as EA, EventState, TeachingAffected as TA } from '@site/src/api/event';
import {default as TeachingAffected} from '@site/src/components/Event/EventFields/TeachingAffected/Edit';
import {default as AudienceOptions} from '@site/src/components/Event/EventFields/AudienceOptions/Edit';

interface Props {}

const TeachingAffectedField = observer((props: Props) => {
    const [dummyEvent, _] = React.useState(
        new Event(
            {
                state: EventState.Draft,
                audience: EA.LP,
                teachingAffected: TA.YES,
                start: new Date(),
                end: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            } as any,
            {
                canEdit: (_: any) => true,
                getWildcardUntisClasses: () => [],
                getUntisClasses: () => [],
                getDepartments : () => []
            } as any
        )
    );
    React.useEffect(() => {
        if (!dummyEvent._isEditing) {
            dummyEvent.setEditing(true);
        }
    }, [dummyEvent])
    if (!dummyEvent._isEditing) {
        return null;
    }
    return (
        <div>
            <TeachingAffected
                event={dummyEvent}
                preventHideExample
                hideLabel
            />
        </div>
    )
});

export default TeachingAffectedField;
