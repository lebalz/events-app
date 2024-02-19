import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import ApiModel from '@site/src/models/ApiModel';
import Button from '../shared/Button';
import { mdiArrowExpandAll } from '@mdi/js';
import Edit from '../shared/Button/Edit';
import Discard from '../shared/Button/Discard';
import Save from '../shared/Button/Save';
import { ApiAction } from '@site/src/stores/iStore';
import Delete from '../shared/Button/Delete';


interface Props {
    className?: string;
    model: ApiModel<any, ApiAction>;
    onEdit?: () => void;
    leftNodes?: React.ReactNode;
    rightNodes?: React.ReactNode;
    hideDelete?: boolean;
}

const ModelActions = observer((props: Props) => {
    const { model } = props;
    return (
        <div className={clsx(styles.flex, props.className)}>
            {props.leftNodes}
            {
                model.isEditable && !model.isEditing && (
                    <Edit onClick={() => {
                        model.setEditing(true);
                        if (props.onEdit) {
                            props.onEdit();
                        }
                    }} />
                )
            }
            {
                model.isEditing && (
                    <>
                        <Discard onClick={() => model.reset()} />
                        <Save
                            disabled={!model.isDirty}
                            onClick={() => model.save()}
                            apiState={model.apiStateFor(`save-${model.id}`)}
                        />
                        {!props.hideDelete && (
                            <Delete 
                                onClick={() => model.destroy()}
                                apiState={model.apiStateFor(`destroy-${model.id}`)} 
                            />
                        )}
                    </>
                )
            }
            {props.rightNodes}
        </div>
    )
});

export default ModelActions;