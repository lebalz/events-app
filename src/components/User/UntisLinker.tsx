import React from 'react';
import clsx from 'clsx';

import styles from './untisLinker.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Select from 'react-select';

const UntisLinker = observer(() => {
    const userStore = useStore('userStore');
    const untisStore = useStore('untisStore');
    const { current } = userStore;
    if (!current) {
        return null;
    }
    return (
        <div className={clsx(styles.container)}>
            <Select
                className={clsx(styles.select)}
                classNamePrefix="select"
                value={{value: current.untisId, label: current.untisTeacher ? `${current.shortName} - ${current.untisTeacher?.longName}` : '-'}}
                options={
                    untisStore.teachers.slice().map((t) => ({
                        value: t.id,
                        label: `${t.shortName} - ${t.longName}`
                    }))
                }
                onChange={(opt) => {
                    console.log(opt);
                    current.linkUntis(opt?.value);
                }}
                isMulti={false}
                isSearchable={true}
                isClearable={!!current.untisTeacher}
            />

        </div>
    )
});

export default UntisLinker;