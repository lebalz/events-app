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

const ClassSubscriptions = observer(() => {
    const viewStore = useStore('viewStore');
    const { currentLocale } = i18n;

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
                    {_.orderBy(viewStore.icalListClassesFiltered, ['name'], ['asc']).map((c) => (
                        <div className={clsx(styles.publicIcal)} key={c.name}>
                            <div className={clsx(styles.icalButton)}>
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
                    ))}
                </div>
            </div>
        </div>
    );
});

export default ClassSubscriptions;
