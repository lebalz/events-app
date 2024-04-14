import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import {default as RegistrationPeriodModel} from '@site/src/models/RegistrationPeriod';
import DefinitionList from '../shared/DefinitionList';
import Translate, { translate } from '@docusaurus/Translate';
import Badge from '../shared/Badge';
import Edit from '../shared/Button/Edit';
import TextArea from '../shared/TextArea';
import TextInput from '../shared/TextInput';
import DateTimePicker from '../shared/DateTimePicker';
import Select, { Theme, ThemeConfig } from 'react-select';
import { selectClassNamesConfig, selectStyleConfig, selectThemeConfig } from '../Event/Filter';
import Department from '@site/src/models/Department';
import _ from 'lodash';
import Save from '../shared/Button/Save';
import Discard from '../shared/Button/Discard';
import Delete from '../shared/Button/Delete';
import Checkbox from '../shared/Checkbox';
import { Icon } from '../shared/icons';
import { mdiCheckboxBlank, mdiCheckboxBlankBadge, mdiCheckboxBlankBadgeOutline, mdiCheckboxBlankOffOutline, mdiCheckboxMarked } from '@mdi/js';


interface Props {
    period: RegistrationPeriodModel;
}

const IS_OPEN_CB_LABEL = {
    enabled: translate({
        message: 'Termineingaben (ausserhalb des Eingabefensters) erlauben?',
        id: 'RegistrationPeriod.isOpen.enabled'
    }),
    disabled: translate({
        message: 'Eingabefenster bereits offen',
        id: 'RegistrationPeriod.isOpen.disabled'
    })
}

const RegistrationPeriod = observer((props: Props) => {
    const { period } = props;
    const departmentStore = useStore('departmentStore');
    if (period.isEditing) {
        return (
            <div className={clsx('card', styles.regPeriod)}>
                <div className={clsx('card__header', styles.header)}>
                    <h4>{period.name}</h4>
                    <div className={clsx(styles.actions)}>
                        {period.isDirty
                            ? (
                                <>
                                    <Save onClick={() => period.save()} apiState={period.apiStateFor(`save-${period.id}`)} />
                                    <Discard onClick={() => period.reset()} />
                                    <Delete onClick={() => period.destroy()} apiState={period.apiStateFor(`destroy-${period.id}`)}/>
                                </>
                            )
                            : (
                                <Discard onClick={() => period.setEditing(false)} title={translate({message: 'Bearbeitungsmodus schliessen', id: 'RegistrationPeriod.action.edit.discard'})} />
                            )
                        }
                    </div>
                </div>
                <div className={clsx('card__body')}>
                    <DefinitionList>
                        <dt>
                            <Translate id="RegistrationPeriod.Name">
                                Name
                            </Translate>
                        </dt>
                        <dd>
                            <TextInput
                                onChange={(name) => period.update({name: name})}
                                text={period.name}
                            />
                        </dd>
                        <dt>
                            <Translate id="RegistrationPeriod.Description">
                                Beschreibung
                            </Translate>
                        </dt>
                        <dd>
                            <TextArea
                                onChange={(descr) => period.update({description: descr})}
                                text={period.description}
                                placeholder={translate({message: 'Beschreibung', id: 'RegistrationPeriod.Description.Placeholder'})}
                            />
                        </dd>
                        <dt>
                            <Translate id="RegistrationPeriod.inputWindow">
                                Eingabefenster
                            </Translate>
                        </dt>
                        <dt>
                            <Translate id="RegistrationPeriod.inputWindow.Start">
                                Start
                            </Translate>
                        </dt>
                        <dd>
                            <DateTimePicker
                                date={period.start}
                                onChange={(date) => period.update({start: date.toISOString()})}
                            />
                        </dd>
                        <dt>
                            <Translate id="RegistrationPeriod.inputWindow.End">
                                Ende
                            </Translate>
                        </dt>
                        <dd>
                            <DateTimePicker
                                date={period.end}
                                onChange={(date) => period.update({end: date.toISOString()})}
                            />
                        </dd>
                        <dt>
                            <Translate id="RegistrationPeriod.datePeriod">
                                Termin-Periode
                            </Translate>
                        </dt>
                        <dt>
                            <Translate id="RegistrationPeriod.eventPeriod.Start">
                                Start
                            </Translate>
                        </dt>
                        <dd>
                            <DateTimePicker
                                date={period.start}
                                onChange={(date) => period.update({eventRangeStart: date.toISOString()})}
                            />
                        </dd>
                        <dt>
                            <Translate id="RegistrationPeriod.eventPeriod.End">
                                Ende
                            </Translate>
                        </dt>
                        <dd>
                            <DateTimePicker
                                date={period.end}
                                onChange={(date) => period.update({eventRangeEnd: date.toISOString()})}
                            />
                        </dd>
                        <dt>
                            <Translate id="RegistrationPeriod.departments">
                                Abteilungen
                            </Translate>
                        </dt>
                        <dd>
                            <Select
                                isMulti
                                closeMenuOnSelect={false}
                                placeholder={translate({
                                    message: 'Abteilungen',
                                    id: 'RegistrationPeriod.departments',
                                })}
                                name="regPeriods.departments"
                                menuPortalTarget={document.body}
                                options={_.orderBy(departmentStore.usedDepartments, ['name']).map(d => ({ value: d.id, label: d.name, color: d?.color }))}
                                styles={selectStyleConfig}
                                className={clsx(styles.select)}
                                classNames={selectClassNamesConfig}
                                value={[...period.departmentIds].map(id => {
                                    const department = departmentStore.find<Department>(id);
                                    return { value: id, label: department?.name || '', color: department?.color || '#ccc' }
                                })}
                                onChange={(opt) => {
                                    const ids = opt.map(o => o.value);
                                    period.setDepartmentIds(ids);
                                }}
                                theme={selectThemeConfig}
                            />
                        </dd>
                        <dd>
                            <DateTimePicker
                                date={period.end}
                                onChange={(date) => period.update({eventRangeEnd: date.toISOString()})}
                            />
                        </dd>
                        <dt>
                            <Translate id="RegistrationPeriod.isOpen">
                                Eingabe Fenster offen?
                            </Translate>
                        </dt>
                        <dd>
                            <Checkbox
                                checked={period.isPeriodOpen}
                                disabled={period.isWithinOpenPeriod}
                                onChange={(checked) => period.update({isOpen: checked})}
                                label={IS_OPEN_CB_LABEL[period.isWithinOpenPeriod ? 'disabled' : 'enabled']}
                            />
                        </dd>
                    </DefinitionList>
                </div>
    
            </div>
        )
    }
    return (
        <div className={clsx('card', styles.regPeriod)}>
            <div className={clsx(styles.header, 'card__header')}>
                <h4>{period.name}</h4>
                <Edit onClick={() => period.setEditing(true)}/>
            </div>
            <div className={clsx('card__body')}>
                <small className={clsx('avatar__subtitle', styles.description)}>
                        {period.description}
                </small>
                <DefinitionList>
                    <dt>
                        <Translate id="RegistrationPeriod.inputWindow">
                            Eingabefenster
                        </Translate>
                    </dt>
                    <dd>
                        <Badge
                            text={`${period.fStart} - ${period.fEnd}`}
                            color='primary'
                        />
                    </dd>
                    <dt>
                        <Translate id="RegistrationPeriod.datePeriod">
                            Termin-Periode
                        </Translate>
                    </dt>
                    <dd>
                        <Badge
                            text={`${period.fEventRangeStart} - ${period.fEventRangeEnd}`}
                            color='primary'
                        />
                    </dd>
                    <dt>
                        <Translate id="RegistrationPeriod.departments">
                            Abteilungen
                        </Translate>
                    </dt>
                    <dd>
                        <div className={styles.badges}>
                            {period.departments.map(d => (<Badge text={d.shortName} color={d.color} title={d.name} key={d.id}/>))}
                        </div>
                    </dd>
                    <dt>
                        <Translate id="RegistrationPeriod.isOpen">
                            Eingabe Fenster offen?
                        </Translate>
                    </dt>
                    <dd>
                        {period.isPeriodOpen 
                            ? <Icon path={mdiCheckboxMarked} color="green" />
                            : <Icon path={mdiCheckboxBlankOffOutline} color="red" />
                        }
                    </dd>
                </DefinitionList>
            </div>

        </div>
    )
});

export default RegistrationPeriod;