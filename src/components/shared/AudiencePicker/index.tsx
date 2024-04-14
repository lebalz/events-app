
import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { default as DepartmentModel } from '@site/src/models/Department';
import Department from './Department';
import Button from '../Button';
import _ from 'lodash';
import ClassSelector from './ClassSelector';
import Translate, { translate } from '@docusaurus/Translate';
import { EventAudience, EventAudienceTranslationShort, TeachingAffected } from '@site/src/api/event';
import { mdiDotsHorizontalCircleOutline } from '@mdi/js';
import Audience from './Audience';



interface Props {
    event: EventModel;
}

const TranslationsTA: { [key in TeachingAffected]: string } = {
    [TeachingAffected.YES]: translate({
        message: 'Ja',
        description: 'Yes, the teaching is affected and the class is not present',
        id: 'TeachingAffected.YES.description'
    }),
    [TeachingAffected.NO]: translate({
        message: 'Nein',
        description: 'No, the teaching happens as usual',
        id: 'TeachingAffected.NO.description'
    }),
    [TeachingAffected.PARTIAL]: translate({
        message: 'Teilweise',
        description: 'Only a part of the class will be present',
        id: 'TeachingAffected.PARTIAL.description'
    })
}

const AudiencePicker = observer((props: Props) => {
    const [showOptions, setShowOptions] = React.useState(false);
    const departmentStore = useStore('departmentStore');
    const userStore = useStore('userStore');
    const { current } = userStore;
    if (!current) {
        return null
    };

    const departments = departmentStore.groupedByLetter;
    const { event } = props;
    const error = event.errorFor('audience');
    const {
        someDepartments,
        allDepartments,
        allDepartmentsDe,
        allDepartmentsFr,
        someDepartmentsDe,
        someDepartmentsFr
    } = event.departmentState;

    return (
        <div className={clsx(styles.audience)}>
            <div className={clsx(styles.affects)}>
                <h4>
                    <Translate
                        id="shared.header.concerns"
                        description="The title in the window used to select the participants involved in the event"
                    >
                        Publikum
                    </Translate>
                </h4>
                <div className={styles.toggle}>
                    <span className={styles.label}>
                        <Translate
                            id="shared.text.people.concerned"
                            description="The text in the window used to select the participants involved in the event asking which people is concerned by an event"
                        >
                            Betrifft
                        </Translate>
                    </span>
                    <div className={clsx(styles.buttonGroup, 'button-group', 'button-group--block')}>
                        {Object.keys(EventAudience).map(audience => {
                            return (<Button
                                text={EventAudienceTranslationShort[audience]}
                                onClick={() => event.update({ audience: EventAudience[audience] })}
                                active={event.audience === audience}
                                key={audience}
                            />)
                        })}
                    </div>
                    <Audience event={event} showExample marginLeft='2em' />
                </div>
                <div className={styles.toggle}>
                    <span className={styles.label}>
                        <Translate
                            id="shared.text.lesson.concerned"
                            description="The text in the window used to select the participants involved in the event asking if the lessons are concerned by an event"
                        >
                            Unterricht Betroffen?
                        </Translate>
                    </span>
                    <div className={clsx(styles.buttonGroup, 'button-group', 'button-group--block')}>
                        {Object.keys(TeachingAffected).map(affected => {
                            return (<Button
                                text={TranslationsTA[affected]}
                                onClick={() => event.update({ teachingAffected: TeachingAffected[affected] })}
                                active={event.teachingAffected === affected}
                                key={affected}
                            />)
                        })}
                    </div>
                </div>
                {
                    [EventAudience.ALL, EventAudience.LP].includes(event.audience) && event.affectedDepartments.some(d => d.isSubDepartment && !!d.department2_Id) && (
                        <div className={styles.toggle}>
                            <span className={styles.label}>
                                <Translate id="shared.text.bilingual.people.concerned" description="The text in the window used to select the participants concerned in the event asking if the bilingual people are concerned by an event">
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
                                />
                                <Button
                                    text={translate({
                                        message: 'Nein',
                                        id: 'shared.button.no',
                                        description: 'Button text no'
                                    })}
                                    onClick={() => event.update({ affectsDepartment2: false })}
                                    active={!event.affectsDepartment2}
                                />
                            </div>
                        </div>
                    )
                }

            </div>
            <div className={clsx(error && styles.error)}>
                <h4>
                    <Translate
                        id="shared.header.school_departement"
                        description="The title in the window for the event."
                    >
                        Schulen/Klassen
                    </Translate>
                </h4>
                <div className={clsx(styles.flex)}>
                    <Button
                        text={translate({
                            message: 'Alle Schulen',
                            description: 'Button text to toggle all schools on/off',
                            id: 'shared.AudiencePicker'
                        })}
                        active={allDepartments}
                        color={someDepartments ? 'primary' : 'secondary'}
                        onClick={() => {
                            if (!allDepartments) {
                                departmentStore.departments.forEach(d => event.setDepartment(d, true));
                            } else {
                                departmentStore.departments.forEach(d => event.setDepartment(d, false));
                            }
                        }}
                    />
                    <Button
                        text={'GBSL'}
                        active={allDepartmentsDe}
                        color={someDepartmentsDe ? 'primary' : 'secondary'}
                        onClick={() => {
                            if (!allDepartmentsDe) {
                                departmentStore.departmentsDe.forEach(d => event.setDepartment(d, true));
                            } else {
                                departmentStore.departmentsDe.forEach(d => event.setDepartment(d, false));
                            }
                        }}
                    />
                    <Button
                        text={'GBJB'}
                        active={allDepartmentsFr}
                        color={someDepartmentsFr ? 'primary' : 'secondary'}
                        onClick={() => {
                            if (!allDepartmentsFr) {
                                departmentStore.departmentsFr.forEach(d => event.setDepartment(d, true));
                            } else {
                                departmentStore.departmentsFr.forEach(d => event.setDepartment(d, false));
                            }
                        }}
                    />
                </div>
                <Tabs className={clsx(styles.tabs)} lazy>
                    {Object.keys(departments).sort().map((letter, idx) => {
                        const color = (departments[letter] as DepartmentModel[])[0].color
                        const touched = (departments[letter] as DepartmentModel[]).some(d => d.classes.some(c => event.affectsClass(c)));
                        return (
                            <TabItem 
                                value={letter}
                                label={departmentStore.letterToName(letter)}
                                key={letter} 
                                attributes={{ 
                                    className: clsx(touched && styles.touched), 
                                    style: { color: color } 
                                }}
                            >
                                <Department departments={departments[letter]} event={event} />
                            </TabItem>
                        )
                    })}
                </Tabs>
                <div className={clsx(styles.options)}>
                    <Button
                        icon={mdiDotsHorizontalCircleOutline}
                        title={translate({
                            message: 'Erweitert',
                            id: 'shared.button.title.expand',
                            description: 'Text appearing on the expand button'
                        })}
                        onClick={() => setShowOptions(!showOptions)}
                        className={clsx(styles.optionsBtn, (showOptions || event.unknownClassIdentifiers.length > 0) && styles.showOptions)}
                    />
                    {
                        (showOptions || event.unknownClassIdentifiers.length > 0) && (
                            <div>
                                <h4>
                                    <Translate
                                        id="shared.audiencePicker.title.futureClasses"
                                    >
                                        Künftige Klassen
                                    </Translate>
                                </h4>
                                <ClassSelector event={event} />
                            </div>
                        )
                    }
                </div>
                {error && (
                    <div className={styles.errorMessage}>
                        {error.message}
                    </div>
                )}
            </div>
        </div>
    )
});

export default AudiencePicker;