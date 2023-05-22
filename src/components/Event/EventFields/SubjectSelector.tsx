import React from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Select, {createFilter} from 'react-select';
import { Props } from './iEventField';

const SubjectSelector = observer((props: Props) => {
    const untisStore = useStore('untisStore');
    const { event, styles } = props;
    return (
        <div className={clsx(styles.container)}>
            <Select
                menuPortalTarget={document.body}
                styles={{ 
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    valueContainer: (base) => ({...base, flexBasis: '12em'})
                }}
                className={clsx(styles.select)}
                classNamePrefix="select"
                value={[...event.subjects].map((s) => {
                    const subj = untisStore.findSubject(s);
                    const label = subj ? `${subj.name} - ${subj.description}` : s;
                    return {value: s, label: label}
                })}                
                options={
                    untisStore.subjects.slice().map((s) => ({
                        value: s.name,
                        label: `${s.name} - ${s.description} - ${s.departmentNames}`
                    }))
                }
                onChange={(opt) => {
                    event.setSubjects(opt?.map((o) => o.value));
                }}
                filterOption={createFilter({stringify: (o) => o.label})}
                isMulti
                isSearchable
                isClearable
            />

        </div>
    )
});

export default SubjectSelector;