import clsx from 'clsx';
import styles from '../shared.module.scss';
import { observer } from 'mobx-react-lite';
import Translate, { translate } from '@docusaurus/Translate';
import { useStore } from '@site/src/stores/hooks';
import TextInput from '../../shared/TextInput';
import Button from '../../shared/Button';
import {
    mdiCalendarCheck,
    mdiCalendarPlus,
    mdiClipboardText,
    mdiDownloadOutline,
    mdiMicrosoftOutlook
} from '@mdi/js';
import { SIZE_S, SIZE_XS } from '../../shared/icons';
import { EVENTS_API } from '@site/src/authConfig';
import i18n from '@generated/i18n';
import _ from 'lodash';
import Copy from '../../shared/Button/Copy';

const ClassSubscriptions = observer(() => {
    const userStore = useStore('userStore');
    const viewStore = useStore('viewStore');
    const { currentLocale } = i18n;
    const { subscription } = userStore.current || {};

    return (
        <div className={clsx('card', styles.card)}>
            <div className={clsx('card__header')}>
                <h4>
                    <Translate id="ical.section.classes" description="classes ical sync address">
                        Klassen Kalender
                    </Translate>
                </h4>
                <TextInput
                    text={viewStore.icalListClassFilter}
                    onChange={(text) => viewStore.setIcalListClassFilter(text)}
                    placeholder={translate({
                        message: 'Filtern nach Klasse',
                        id: 'user.ical.filter.class.placeholder',
                        description: 'Placeholder text for the filter input'
                    })}
                />
            </div>
            <div className={clsx('card__body')}>
                <div className={clsx(styles.icalWrapper)}>
                    {_.orderBy(viewStore.icalListClassesFiltered, ['name'], ['asc']).map((c) => {
                        const subscribed = !!subscription?.untisClassIds.has(c.id);
                        return (
                            <div className={clsx(styles.publicIcal)} key={c.name}>
                                <div className={clsx(styles.icalButton)}>
                                    {subscription && (
                                        <Button
                                            icon={subscribed ? mdiCalendarCheck : mdiCalendarPlus}
                                            color={subscribed ? 'primary' : 'green'}
                                            disabled={subscribed}
                                            text={
                                                subscribed
                                                    ? translate({
                                                          message: 'Abonniert',
                                                          id: 'user.ical.already-subscribed-button.text',
                                                          description:
                                                              'Button text for subscribing to the calendar'
                                                      })
                                                    : translate({
                                                          message: 'Abonnieren',
                                                          id: 'user.ical.subscribe-button.text',
                                                          description:
                                                              'Button text for subscribing to the calendar'
                                                      })
                                            }
                                            title={
                                                subscribed
                                                    ? translate({
                                                          message:
                                                              'Bereits dem persönlichen Kalenderabo hinzugefügt',
                                                          id: 'user.ical.already-subscribe-button.title',
                                                          description:
                                                              'Button title for subscribing to the calendar'
                                                      })
                                                    : translate({
                                                          message: 'Zum persönlichen Kalenderabo hinzufügen',
                                                          id: 'user.ical.subscribe-button.title',
                                                          description:
                                                              'Button title for subscribing to the calendar'
                                                      })
                                            }
                                            onClick={() => {
                                                subscription.addUntisClass(c.id);
                                            }}
                                            size={SIZE_S}
                                            iconSide="left"
                                        />
                                    )}
                                    <Button
                                        href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${currentLocale}/${c.name}.ics&name=${c.displayName}`}
                                        target="_blank"
                                        text={c.displayName}
                                        title={translate({
                                            message: 'Abonniere den Kalender in Outlook',
                                            id: 'user.ical.outlook-button.title',
                                            description: 'Button text for adding the calendar to Outlook'
                                        })}
                                        icon={mdiMicrosoftOutlook}
                                        size={SIZE_S}
                                        color={c.department?.color}
                                    />
                                    <Button
                                        href={`${EVENTS_API}/ical/${currentLocale}/${c.name}.ics`}
                                        icon={mdiDownloadOutline}
                                        title={translate({
                                            message: 'ICS Date herunterladen',
                                            id: 'user.ical.download-button.title',
                                            description: 'Button text for downloading the ics calendar file'
                                        })}
                                        text={c.displayName}
                                        color={c.department?.color}
                                        size={SIZE_S}
                                        iconSide="right"
                                    />
                                </div>
                                <div className={clsx(styles.ical)}>
                                    <Copy
                                        value={`${EVENTS_API}/ical/${currentLocale}/${c.name.replaceAll('/', '_')}.ics`}
                                        size={SIZE_XS}
                                        icon={mdiClipboardText}
                                        title={translate(
                                            {
                                                message: 'Kopiere den Link zum Kalender {name}.',
                                                id: 'user.ical.copy-button.title'
                                            },
                                            { name: c.name }
                                        )}
                                        className={clsx(styles.copyButton)}
                                    />
                                    {`${EVENTS_API}/ical/${currentLocale}/${c.name}.ics`}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

export default ClassSubscriptions;
