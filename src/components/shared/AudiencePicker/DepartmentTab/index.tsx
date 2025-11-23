import React from 'react';
import clsx from 'clsx';
import styles from '../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { default as DepartmentModel } from '@site/src/models/Department';
import Event from '@site/src/models/Event';
import TabItem from '@theme/TabItem';
import Department from './Department';
import Tabs from '@theme/Tabs';
import siteConfig from '@generated/docusaurus.config';
import _ from 'lodash';
const { CURRENT_LOCALE } = siteConfig.customFields as { CURRENT_LOCALE?: 'de' | 'fr' };

interface Props {
    event: Event;
    className?: string;
    departments: { [name: string]: DepartmentModel[] };
}

const PRIORITY_MAP_DE = ['W', 'F', 'G'];
const PRIORITY_MAP_FR = ['c', 's', 'm'];

const DepartmentTab = observer((props: Props) => {
    const { departments, event } = props;
    const departmentStore = useStore('departmentStore');
    const departmentKeys: string[] = React.useMemo(() => {
        const prios =
            CURRENT_LOCALE === 'de'
                ? [...PRIORITY_MAP_FR, ...PRIORITY_MAP_DE]
                : [...PRIORITY_MAP_DE, ...PRIORITY_MAP_FR];
        return _.orderBy(Object.keys(departments), (key) => prios.indexOf(departments[key][0]?.letter), [
            'desc'
        ]);
    }, [departments]);

    return (
        <Tabs className={clsx(styles.tabs)} lazy>
            {departmentKeys.map((letter, idx) => {
                const color = (departments[letter] as DepartmentModel[])[0]?.color;
                const touched = ((departments[letter] ?? []) as DepartmentModel[]).some((d) =>
                    d.classes.some((c) => event.affectsClass(c))
                );
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
                        <Department
                            departments={departments[letter]}
                            event={event}
                            isSpecial={letter.length > 1}
                        />
                    </TabItem>
                );
            })}
        </Tabs>
    );
});

export default DepartmentTab;
