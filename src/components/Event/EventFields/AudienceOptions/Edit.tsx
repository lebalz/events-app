import React from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';
import Button from '@site/src/components/shared/Button';
import { EventAudience, EventAudienceTranslationShort } from '@site/src/api/event';
import Translate, { translate } from '@docusaurus/Translate';
import LabeledBox from '@site/src/components/shared/LabeledBox';
import Info from './Info';
import { Props } from '.';
import { useStore } from '@site/src/stores/hooks';
import { action } from 'mobx';

const Edit = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const { event } = props;
    if (!event.isEditable || !event.isEditing) {
        return null;
    }
    return (
        <div className={clsx(styles.affects)}>
            <div className={clsx(styles.control)}>
                {!props.hideLabel && (
                    <span className={clsx(styles.label)}>
                        <Translate
                            id="shared.text.people.concerned"
                            description="The text in the window used to select the participants involved in the event asking which people is concerned by an event"
                        >
                            Betrifft
                        </Translate>
                    </span>
                )}
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
                    showContent={viewStore.userSettings.showEventAudienceInfo}
                    onChangeVisibility={action((val) => viewStore.userSettings.setShowEventAudienceInfo(val))}
                >
                    <Info event={event} showExample />
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

export default Edit;
