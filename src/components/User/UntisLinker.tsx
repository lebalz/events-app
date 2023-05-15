import React from 'react';
import clsx from 'clsx';

import styles from './untisLinker.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Select from 'react-select';
import {default as UserModel} from '@site/src/models/User';

interface Props {
    user: UserModel;
}

const UntisLinker = observer((props: Props) => {
    const untisStore = useStore('untisStore');
    const { user } = props;
    if (!user) {
        return null;
    }
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
                value={{value: user.untisId, label: user.untisTeacher ? `${user.shortName} - ${user.untisTeacher?.longName}` : '-'}}
                options={
                    untisStore.teachers.slice().map((t) => ({
                        value: t.id,
                        label: `${t.shortName} - ${t.longName}`
                    }))
                }
                onChange={(opt) => {
                    user.linkUntis(opt?.value);
                }}
                isMulti={false}
                isSearchable={true}
                isClearable={!!user.untisTeacher}
            />

        </div>
    )
});

export default UntisLinker;