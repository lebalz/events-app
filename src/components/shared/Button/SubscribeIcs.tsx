import React from 'react';
import { observer } from 'mobx-react-lite';
import Button from '.';
import { useSubscriptionUrl } from '@site/src/hookes/useSubscriptionUrl';
import { mdiMicrosoftOutlook } from '@mdi/js';
import { SIZE_S } from '../icons';
import { translate } from '@docusaurus/Translate';

interface Props {
    locale: 'de' | 'fr';
    name: string;
    icsName: string;
    color?: string;
    className?: string;
}

const SubscribeIcs = observer((props: Props) => {
    const { locale, name, icsName } = props;
    const url = useSubscriptionUrl(locale, icsName, name);

    return (
        <Button
            target="_blank"
            href={url}
            text={name}
            title={translate({
                message: 'Abonniere den Kalender in Outlook',
                id: 'user.ical.outlook-button.title',
                description: 'Button text for adding the calendar to Outlook'
            })}
            icon={mdiMicrosoftOutlook}
            size={SIZE_S}
            color={props.color}
            className={props.className}
        />
    );
});

export default SubscribeIcs;
