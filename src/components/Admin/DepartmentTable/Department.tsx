import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import {default as DepartmentModel} from '@site/src/models/Department';
import { formatDateTime } from '@site/src/models/helpers/time';
import Badge from '../../shared/Badge';
import Save from '../../shared/Button/Save';
import Delete from '../../shared/Button/Delete';
import Discard from '../../shared/Button/Discard';
import TextArea from '../../shared/TextArea';
import TextInput from '../../shared/TextInput';
import Select from 'react-select';
import { DepartmentLetter } from '@site/src/api/department';
import Button from '../../shared/Button';
import { mdiArrowBottomRightThick, mdiArrowCollapseRight, mdiArrowRightBottomBold, mdiCircle, mdiCircleSmall } from '@mdi/js';
import { SIZE_S } from '../../shared/icons';
import { Popover, ArrowContainer } from "react-tiny-popover";

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface Props {
    department: DepartmentModel;
}

const Department = observer((props: Props) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const departmentStore = useStore('departmentStore');
    const {department} = props;
    return (
        <tr className={clsx(styles.department, department.isSubDepartment && styles.subDepartment)}>
            <td>
                <Popover
                    isOpen={isPopoverOpen}
                    positions={["bottom"]}
                    align="center"
                    padding={0}
                    onClickOutside={() => setIsPopoverOpen(false)}
                    content={({ position, childRect, popoverRect }) => (
                        <ArrowContainer
                            position={position}
                            childRect={childRect}
                            popoverRect={popoverRect}
                            arrowColor={'var(--ifm-color-primary)'}
                            arrowSize={8}
                        >
                            <div className="card">
                                <div className="card__header">
                                    <h3>Zugehörigkeit der Schule</h3>
                                </div>
                                <div className="card__body">
                                    <h4>Zugehörige Schule</h4>
                                    <Select 
                                        menuPortalTarget={document.body}
                                        styles={{ 
                                            menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                        }}
                                        value={{value: department.department1_Id, label: department.department1?.name}}
                                        options={
                                            departmentStore.departments.filter(d => !d.isSubDepartment && d.id !== department.id).map(d => ({value: d.id, label: d.name}))
                                        }
                                        onChange={(opt) => {
                                            department.update({department1_Id: opt?.value as string});
                                        }}
                                        isMulti={false}
                                        isSearchable={true}
                                        isClearable={true}
                                    />
                                </div>
                                <div className="card__body">
                                    <h4>Zweite Schule</h4>
                                    <Select 
                                        menuPortalTarget={document.body}
                                        styles={{ 
                                            menuPortal: (base) => ({ ...base, zIndex: 9999 })
                                        }}
                                        value={{value: department.department2_Id, label: department.department2?.name}}
                                        options={
                                            departmentStore.departments.filter(d => !d.isSubDepartment && d.id !== department.id).map(d => ({value: d.id, label: d.name}))
                                        }
                                        onChange={(opt) => {
                                            department.update({department2_Id: opt?.value as string});
                                        }}
                                        isMulti={false}
                                        isSearchable={true}
                                        isClearable={true}
                                    />
                                </div>
                            </div>
                        </ArrowContainer>
                    )}
                >
                    <div onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                        <Button 
                            icon={department.isSubDepartment ? mdiArrowRightBottomBold : mdiCircleSmall}
                            size={SIZE_S}
                            color={department.isSubDepartment ? department.department1.color : department.color}
                        />
                    </div>
                </Popover>
            </td>
            <td>
                <TextInput text={department.name} onChange={(txt) => department.update({name: txt})} />
            </td>
            <td className={clsx(styles.description)}>
                <TextArea text={department.description} onChange={(txt) => department.update({description: txt})} rows={2}/>
            </td>
            <td>
                {/* Department Letter */}
                <Select 
                    menuPortalTarget={document.body}
                    styles={{ 
                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                    }}
                    value={{value: department.letter, label: department.letter}}
                    options={
                        ALPHABET.split('').map((l) => ({
                            value: l,
                            label: l
                        }))
                    }
                    onChange={(opt) => {
                        department.update({letter: opt?.value as DepartmentLetter});
                    }}
                    isMulti={false}
                    isSearchable={true}
                    isClearable={false}
                />
            </td>
            <td className={clsx(styles.colorData)}>
                <label className={clsx(styles.color)}>
                    <Badge 
                        text={department.color} 
                        color={department.color}
                    />
                    <input 
                        type="color" 
                        value={department.color} 
                        onChange={(e) => department.update({color: e.target.value})} 
                    />
                </label>
            </td>
            <td>
                {/* Class Letters */}
                <div className={clsx(styles.classLetters)}>
                    {department.validClassLetters.map((l) => (
                        <Button 
                            key={l}
                            text={l}
                            className={clsx(styles.classLetter)}
                            color={department.color}
                            active={department.classLetters.has(l)}
                            onClick={() => {
                                department.toggleClassLetter(l);
                            }}
                        />
                    ))}
                </div>
            </td>
            <td>{formatDateTime(department.createdAt)}</td>
            <td>{formatDateTime(department.updatedAt)}</td>
            <td><Badge text={department.id} /></td>
            <td>
                <div className={clsx(styles.actions)}>
                    {department.isDirty && <Discard onClick={() => department.reset()} />}
                    {department.isDirty && <Save onClick={() => departmentStore.save(department)} />}
                    <Delete onClick={() => departmentStore.destroy(department)} disabled={department.events.length > 0 || department.classes.length > 0} />
                </div>
            </td>
        </tr>
    )
});

export default Department;