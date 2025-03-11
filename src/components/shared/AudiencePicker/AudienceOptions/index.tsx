import React from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';
import Button from '@site/src/components/shared/Button';
import { EventAudience, EventAudienceTranslationShort, TeachingAffected } from '@site/src/api/event';
import Translate, { translate } from '@docusaurus/Translate';
import Badge from '@site/src/components/shared/Badge';
import Event from '@site/src/models/Event';
import Audience from '../Audience';
import LabeledBox from '../../LabeledBox';
interface Props {
    event: Event;
}

const AudienceOptions = observer((props: Props) => {
    const { event } = props;
    if (!event.isEditable || !event.isEditing) {
        return null;
    }
    return (
        <div className={clsx(styles.affects)}>
            <div className={clsx(styles.control)}>
                <span className={clsx(styles.label)}>
                    <Translate
                        id="shared.text.people.concerned"
                        description="The text in the window used to select the participants involved in the event asking which people is concerned by an event"
                    >
                        Betrifft
                    </Translate>
                </span>
                <div className={clsx(styles.buttonGroup, 'button-group', 'button-group--block')}>
                    {Object.keys(EventAudience).map((audience) => {
                        return (
                            <Button
                                text={EventAudienceTranslationShort[audience]}
                                onClick={() => event.update({ audience: EventAudience[audience] })}
                                active={event.audience === audience}
                                key={audience}
                                noWrap
                            />
                        );
                    })}
                </div>
                <LabeledBox
                    label={translate({ message: 'Info', id: 'shared.audiencePicker.infobox' })}
                    color="info"
                >
                    <Audience event={event} showExample />
                </LabeledBox>
            </div>
            {[EventAudience.ALL, EventAudience.LP].includes(event.audience) &&
                event.affectedDepartments.some((d) => d.isSubDepartment && !!d.department2_Id) && (
                    <div className={clsx(styles.toggle)}>
                        <span className={clsx(styles.label)}>
                            <Translate
                                id="shared.text.bilingual.people.concerned"
                                description="The text in the window used to select the participants concerned in the event asking if the bilingual people are concerned by an event"
                            >
                                Bilingue Lehrpersonen betroffen?
                            </Translate>
                        </span>
                        <div className={clsx(styles.buttonGroup, 'button-group', 'button-group--block')}>
                            <Button
                                text={translate({
                                    message: 'Ja',
                                    id: 'shared.button.yes',
                                    description: 'Button text yes'
                                })}
                                onClick={() => event.update({ affectsDepartment2: true })}
                                active={event.affectsDepartment2}
                                noWrap
                            />
                            <Button
                                text={translate({
                                    message: 'Nein',
                                    id: 'shared.button.no',
                                    description: 'Button text no'
                                })}
                                onClick={() => event.update({ affectsDepartment2: false })}
                                active={!event.affectsDepartment2}
                                noWrap
                            />
                        </div>
                    </div>
                )}
        </div>
    );
});

export default AudienceOptions;
