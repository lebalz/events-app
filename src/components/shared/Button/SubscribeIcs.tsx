import { translate } from '@docusaurus/Translate';
import { mdiMicrosoftOutlook } from '@mdi/js';
import { useSubscriptionUrl } from '@site/src/hooks/useSubscriptionUrl';
import { observer } from 'mobx-react-lite';
import Button from '.';
import { SIZE_S } from '../icons';

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
