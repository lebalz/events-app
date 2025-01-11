import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { translate } from '@docusaurus/Translate';
import UserEventGroup from '../..';
import _ from 'lodash';
import EventGroup from '@site/src/models/EventGroup';

interface Props {
    name: string;
    groups: EventGroup[];
    onChangeCollection?: (collection: string) => void;
}

const Collection = observer((props: Props) => {
    return (
        <div className={clsx(styles.collection)}>
            <div className={clsx(styles.name)}>
                <h4>
                    {props.name === 'false'
                        ? translate({ id: 'group.collection.default', message: 'Standard' })
                        : props.name}
                </h4>
            </div>
            <div className={clsx(styles.groups)}>
                {props.groups.map((group) => {
                    return (
                        <UserEventGroup
                            group={group}
                            key={group.id}
                            onChangeCollection={props.onChangeCollection}
                        />
                    );
                })}
            </div>
        </div>
    );
});

export default Collection;
