import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { default as DepartmentModel } from '@site/src/models/Department';
import { formatDateTime } from '@site/src/models/helpers/time';
import Badge from '../../shared/Badge';
import Save from '../../shared/Button/Save';
import Delete from '../../shared/Button/Delete';
import Discard from '../../shared/Button/Discard';
import TextArea from '../../shared/TextArea';
import TextInput from '../../shared/TextInput';
import Select from 'react-select';
import { DepartmentLetter } from '@site/src/api/department';
import Button, { POPUP_BUTTON_STYLE } from '../../shared/Button';
import { mdiArrowRightBottomBold, mdiCircleSmall } from '@mdi/js';
import { Icon, SIZE_S } from '../../shared/icons';
import Popup from 'reactjs-popup';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface Props {
    department: DepartmentModel;
}

const Department = observer((props: Props) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const departmentStore = useStore('departmentStore');
    const { department } = props;
    return (
        <tr className={clsx(styles.department, department.isSubDepartment && styles.subDepartment)}>
            <td>
                <Popup
                    position={['bottom left', 'top left', 'center center', 'left center']}
                    trigger={
                        <button
                            className={clsx(POPUP_BUTTON_STYLE)}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                        >
                            <Icon
                                path={department.isSubDepartment ? mdiArrowRightBottomBold : mdiCircleSmall}
                                size={SIZE_S}
                                color={
                                    department.isSubDepartment
                                        ? department.department1.color
                                        : department.color
                                }
                            />
                        </button>
                    }
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
                                    menuPortal: (base) => ({ ...base, zIndex: '1000' })
                                }}
                                value={{
                                    value: department.department1_Id,
                                    label: department.department1?.name
                                }}
                                options={departmentStore.departments
                                    .filter((d) => !d.isSubDepartment && d.id !== department.id)
                                    .map((d) => ({ value: d.id, label: d.name }))}
                                onChange={(opt) => {
                                    department.update({ department1_Id: opt?.value as string });
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
                                    menuPortal: (base) => ({ ...base, zIndex: '1000' })
                                }}
                                value={{
                                    value: department.department2_Id,
                                    label: department.department2?.name
                                }}
                                options={departmentStore.departments
                                    .filter((d) => !d.isSubDepartment && d.id !== department.id)
                                    .map((d) => ({ value: d.id, label: d.name }))}
                                onChange={(opt) => {
                                    department.update({ department2_Id: opt?.value as string });
                                }}
                                isMulti={false}
                                isSearchable={true}
                                isClearable={true}
                            />
                        </div>
                    </div>
                </Popup>
            </td>
            <td>
                <TextInput text={department.name} onChange={(txt) => department.update({ name: txt })} />
            </td>
            <td className={clsx(styles.description)}>
                <TextArea
                    text={department.description}
                    onChange={(txt) => department.update({ description: txt })}
                    rows={2}
                />
            </td>
            <td>
                {/* Department Letter */}
                <Select
                    menuPortalTarget={document.body}
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 'var(--ifm-z-index-overlay)' })
                    }}
                    value={{ value: department.letter, label: department.letter }}
                    options={ALPHABET.split('').map((l) => ({
                        value: l,
                        label: l
                    }))}
                    onChange={(opt) => {
                        department.update({ letter: opt?.value as DepartmentLetter });
                    }}
                    isMulti={false}
                    isSearchable={true}
                    isClearable={false}
                />
            </td>
            <td>
                {/* Department displayLetter */}
                <Select
                    menuPortalTarget={document.body}
                    styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 'var(--ifm-z-index-overlay)' }),
                        placeholder: (base) => ({
                            ...base,
                            color: 'var(--ifm-color-gray-400)',
                            fontStyle: 'italic'
                        })
                    }}
                    value={
                        department.displayLetter
                            ? { value: department.displayLetter, label: department.displayLetter }
                            : undefined
                    }
                    options={ALPHABET.split('').map((l) => ({
                        value: l,
                        label: l
                    }))}
                    onChange={(opt) => {
                        department.update({ displayLetter: opt?.value as DepartmentLetter });
                    }}
                    placeholder={department.letter}
                    isMulti={false}
                    isSearchable={true}
                    isClearable={true}
                />
            </td>
            <td>
                <input
                    type="number"
                    value={department.schoolYears}
                    placeholder="4"
                    min={1}
                    max={4}
                    style={{ float: 'right', width: '3em' }}
                    onChange={(e) => {
                        try {
                            const schoolYears = e.target.value ? Number.parseInt(e.target.value, 10) : 0;
                            department.update({ schoolYears: schoolYears });
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                />
            </td>
            <td className={clsx(styles.colorData)}>
                <label className={clsx(styles.color)}>
                    <Badge text={department.color} color={department.color} />
                    <input
                        type="color"
                        value={department.color}
                        onChange={(e) => department.update({ color: e.target.value })}
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
            <td>
                <Badge text={department.id} />
            </td>
            <td>
                <div className={clsx(styles.actions)}>
                    {department.isDirty && <Discard onClick={() => department.reset()} />}
                    {department.isDirty && <Save onClick={() => departmentStore.save(department)} />}
                    <Delete
                        onClick={() => departmentStore.destroy(department)}
                        disabled={department.events.length > 0 || department.classes.length > 0}
                    />
                </div>
            </td>
        </tr>
    );
});

export default Department;
