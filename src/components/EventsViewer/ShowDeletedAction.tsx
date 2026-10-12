import React from 'react';

import { observer } from 'mobx-react-lite';
import Button from '../shared/Button';
import { useEventTable } from '../Event/hooks/useEventTable';
import { translate } from '@docusaurus/Translate';
import { mdiEye, mdiEyeOffOutline } from '@mdi/js';

const ShowDeletedTitle = translate({
    message: 'Gelöschte Termine anzeigen',
    id: 'components.event.eventviewer.showdeletedaction.title'
});

const HideDeletedTitle = translate({
    message: 'Gelöschte Termine ausblenden',
    id: 'components.event.eventviewer.hidedeletedaction.title'
});

const ShowDeletedAction = observer(() => {
    const eventTable = useEventTable();
    return (
        <Button
            text={translate({
                message: 'Gelöschte',
                id: 'components.event.eventviewer.showdeletedaction.text'
            })}
            iconSide="left"
            icon={eventTable.hideDeleted ? mdiEyeOffOutline : mdiEye}
            color={eventTable.hideDeleted ? 'secondary' : 'primary'}
            onClick={() => eventTable.toggleHideDeleted()}
            title={eventTable.hideDeleted ? ShowDeletedTitle : HideDeletedTitle}
        />
    );
});

export default ShowDeletedAction;
