import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { translate } from '@docusaurus/Translate';
import UserEventGroup from '../..';
import _ from 'lodash';
import EventGroup from '@site/src/models/EventGroup';
import Selector from './Selector';
import NoGroupsAlert from './NoGroupsAlert';
import { DEFAULT_COLLECTION } from '@site/src/api/event_group';
import Button from '@site/src/components/shared/Button';
import { DiscardIcon, EditIcon, SIZE_S } from '@site/src/components/shared/icons';

interface Props {
    name: string;
    groups: EventGroup[];
    onChangeCollection?: (collection: string) => void;
}

const Collection = observer((props: Props) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const name = props.name === 'false' ? DEFAULT_COLLECTION : props.name;
    if (props.groups.length < 1) {
        return <NoGroupsAlert collection={name} />;
    }
    return (
        <div className={clsx(styles.collection)}>
            <div className={clsx(styles.name)}>
                {isEditing ? (
                    <Selector
                        group={props.groups[0]}
                        onSelect={(name) => {
                            props.groups.forEach((group) => {
                                group.setCollection(name);
                                props.onChangeCollection?.(name);
                            });
                        }}
                    />
                ) : (
                    <h4>{name}</h4>
                )}
                <Button
                    icon={isEditing ? <DiscardIcon size={SIZE_S} /> : <EditIcon size={SIZE_S} />}
                    color={isEditing ? 'black' : 'orange'}
                    onClick={() => setIsEditing(!isEditing)}
                />
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
