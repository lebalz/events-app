import clsx from 'clsx';
import styles from '../shared.module.scss';
import { observer } from 'mobx-react-lite';
import Translate, { translate } from '@docusaurus/Translate';
import { useStore } from '@site/src/stores/hooks';
import TextInput from '../../shared/TextInput';
import Button from '../../shared/Button';
import { mdiBellPlus, mdiBellPlusOutline } from '@mdi/js';
import { SIZE_S } from '../../shared/icons';
import i18n from '@generated/i18n';
import _ from 'lodash';
import SubscribeIcs from '../../shared/Button/SubscribeIcs';
import CopyIcs from '../../shared/Button/CopyIcs';
import DownloadIcs from '../../shared/Button/DownloadIcs';

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
                                            icon={subscribed ? mdiBellPlus : mdiBellPlusOutline}
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
                                    <SubscribeIcs
                                        name={c.displayName}
                                        icsName={c.name}
                                        locale={currentLocale as 'de' | 'fr'}
                                        color={c.department?.color}
                                    />
                                    <DownloadIcs
                                        locale={currentLocale as 'de' | 'fr'}
                                        icsName={c.name}
                                        name={c.displayName}
                                        color={c.department?.color}
                                    />
                                </div>
                                <CopyIcs
                                    locale={currentLocale as 'de' | 'fr'}
                                    icsName={c.name.replaceAll('/', '_')}
                                    title={translate(
                                        {
                                            message: 'Kopiere den Link zum Kalender {name}.',
                                            id: 'user.ical.copy-button.title'
                                        },
                                        { name: c.name }
                                    )}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

export default ClassSubscriptions;
