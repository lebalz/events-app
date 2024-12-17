import clsx from 'clsx';
import styles from '../styles.module.scss';
import { observer } from 'mobx-react-lite';
import Translate, { translate } from '@docusaurus/Translate';
import { useStore } from '@site/src/stores/hooks';
import TextInput from '../../shared/TextInput';
import Button from '../../shared/Button';
import { mdiClipboardText, mdiDownloadOutline, mdiMicrosoftOutlook } from '@mdi/js';
import { SIZE_S, SIZE_XS } from '../../shared/icons';
import { EVENTS_API } from '@site/src/authConfig';
import i18n from '@generated/i18n';
import _ from 'lodash';
import Copy from '../../shared/Button/Copy';

const DepartmentSubscriptions = observer(() => {
    const viewStore = useStore('viewStore');
    const { currentLocale } = i18n;

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
                    {_.orderBy(viewStore.icalListDepartmentsFiltered, ['name'], ['asc']).map((d) => (
                        <div className={clsx(styles.publicIcal)} key={d.name}>
                            <div className={clsx(styles.icalButton, styles.department)}>
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
                    ))}
                </div>
            </div>
        </div>
    );
});

export default DepartmentSubscriptions;
