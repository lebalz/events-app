import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import customFiels from '@site/src/components/utils/customFields';
import Subscription from '@site/src/models/Subscription';
import { observer } from 'mobx-react-lite';
import CopyIcs from '../../shared/Button/CopyIcs';
import SubscribeIcs from '../../shared/Button/SubscribeIcs';
const { EVENTS_API } = customFiels;

interface Props {
    subscription: Subscription;
}

const IcalProps = observer((props: Props) => {
    const { subscription } = props;
    const { i18n } = useDocusaurusContext();
    const { currentLocale } = i18n;
    return (
        <>
            <dt>
                <Translate id="subscriptions.ical.openOutlook">In Outlook öffnen</Translate>
            </dt>
            <dd>
                <SubscribeIcs
                    name={translate({
                        message: 'GBSL',
                        id: 'user.ical.outlook.calendar-name',
                        description: 'Name of the calendar in Outlook'
                    })}
                    icsName={subscription.icsLocator}
                    locale={currentLocale as 'de' | 'fr'}
                    color="primary"
                />
            </dd>
            <dt>
                <Translate id="subscriptions.ical.url">Kalender URL</Translate>
            </dt>
            <dd>
                <CopyIcs
                    locale={currentLocale as 'de' | 'fr'}
                    icsName={subscription.icsLocator}
                    title={translate({
                        message: 'Kopiere den Link zum persönlichen Kalender.',
                        id: 'user.ical.personal-calendar.copy-button.title'
                    })}
                />
            </dd>
        </>
    );
});

export default IcalProps;
