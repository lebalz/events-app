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

const DepartmentSubscriptions = observer(() => {
    const userStore = useStore('userStore');
    const viewStore = useStore('viewStore');
    const { currentLocale } = i18n;
    const { subscription } = userStore.current || {};

    return (
        <div className={clsx('card', styles.card)}>
            <div className={clsx('card__header')}>
                <h4>
                    <Translate id="ical.section.departments" description="departments ical sync address">
                        Abteilungs-Kalender
                    </Translate>
                </h4>
                <TextInput
                    text={viewStore.icalListDepartmentsFilter}
                    onChange={(text) => viewStore.setIcalListDepartmentsFilter(text)}
                    placeholder={translate({
                        message: 'Filtern nach Schule',
                        id: 'user.ical.filter.department.placeholder',
                        description: 'Placeholder text for the filter input'
                    })}
                />
            </div>
            <div className={clsx('card__body')}>
                <div className={clsx(styles.icalWrapper)}>
                    {_.orderBy(viewStore.icalListDepartmentsFiltered, ['name'], ['asc']).map((d) => {
                        const subscribed = !!subscription?.departmentIds.has(d.id);
                        return (
                            <div className={clsx(styles.publicIcal)} key={d.name}>
                                <div className={clsx(styles.icalButton, styles.department)}>
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
                                                subscription.addDepartment(d.id);
                                            }}
                                            size={SIZE_S}
                                            iconSide="left"
                                        />
                                    )}
                                    <Button
                                        href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${currentLocale}/${d.name.replaceAll('/', '_')}.ics&name=${d.name}`}
                                        target="_blank"
                                        text={d.name}
                                        color={d.color}
                                        title={translate({
                                            message: 'Abonniere den Kalender in Outlook',
                                            id: 'user.ical.outlook-button.title',
                                            description: 'Button text for adding the calendar to Outlook'
                                        })}
                                        icon={mdiMicrosoftOutlook}
                                        size={SIZE_S}
                                    />
                                    <Button
                                        href={`${EVENTS_API}/ical/${currentLocale}/${d.name.replaceAll('/', '_')}.ics`}
                                        icon={mdiDownloadOutline}
                                        text={d.name}
                                        color={d.color}
                                        size={SIZE_S}
                                        iconSide="right"
                                    />
                                </div>
                                <div className={clsx(styles.ical)}>
                                    <Copy
                                        value={`${EVENTS_API}/ical/${currentLocale}/${d.name.replaceAll('/', '_')}.ics`}
                                        size={SIZE_XS}
                                        icon={mdiClipboardText}
                                        title={translate(
                                            {
                                                message: 'Kopiere den Link zum Kalender {name}.',
                                                id: 'user.ical.copy-button.title'
                                            },
                                            { name: d.name }
                                        )}
                                        className={clsx(styles.copyButton)}
                                    />
                                    {`${EVENTS_API}/ical/${currentLocale}/${d.name.replaceAll('/', '_')}.ics`}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

export default DepartmentSubscriptions;
