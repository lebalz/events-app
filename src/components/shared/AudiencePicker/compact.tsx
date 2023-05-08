
import React from 'react';
import clsx from 'clsx';

import styles from './cstyles.module.scss';
import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import Button from '../Button';
import { mdiChevronDown, mdiChevronRight } from '@mdi/js';
import Toggle from './Toggle';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


interface Props {
    event: EventModel;
}

const AudiencePicker = observer((props: Props) => {
    const [expanded, setExpanded] = React.useState<string[]>([]);
    const [open, setOpen] = React.useState(true);
    const untisStore = useStore('untisStore');
    const departmentStore = useStore('departmentStore');
    const userStore = useStore('userStore');
    const { current } = userStore;
    if (!current) {
        return null
    };

    const {departments} = departmentStore;


    const { classTree } = untisStore;
    const { event } = props;
    React.useEffect(() => {
        const classes = userStore.current?.classes ?? [];
        const classesSet = new Set([
            ...classes.map(c => `${c.graduationYear}`),
            ...classes.map(c => `${c.graduationYear}-${c.departmentName}`),
            ...expanded
        ]);
        setExpanded([...classesSet])
    }, [userStore.current?.classes]);
    
    current.departments;
    return (
        <div className={clsx(styles.audience)}>
            {/* @ts-ignore */}
            <Tabs className={clsx(styles.tabs)}>
                {departments.filter(d => d.classes.length > 0).map((dep, idx) => {
                    return (
                        // @ts-ignore
                        <TabItem value={dep.name} label={dep.name} key={idx}>
                            {dep.classes.map((c, idx) => c._name).join(', ')}
                        </TabItem>
                    )
                })}
            </Tabs>
        </div>
    )
});

export default AudiencePicker;