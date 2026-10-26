import clsx from 'clsx';
import React from 'react';

import ApiModel from '@site/src/models/ApiModel';
import { ApiAction } from '@site/src/stores/iStore';
import { observer } from 'mobx-react-lite';
import Delete from '../shared/Button/Delete';
import Discard from '../shared/Button/Discard';
import Edit from '../shared/Button/Edit';
import Save from '../shared/Button/Save';
import styles from './styles.module.scss';

interface Props {
    className?: string;
    model: ApiModel<any, ApiAction>;
    onEdit?: () => void;
    leftNodes?: React.ReactNode;
    rightNodes?: React.ReactNode;
    hideDelete?: boolean;
    disableDelete?: boolean;
    deleteTitle?: string;
}

const ModelActions = observer((props: Props) => {
    const { model } = props;
    return (
        <div className={clsx(styles.flex, props.className)}>
            {props.leftNodes}
            {model.isEditable && !model.isEditing && (
                <Edit
                    onClick={() => {
                        model.setEditing(true);
                        if (props.onEdit) {
                            props.onEdit();
                        }
                    }}
                />
            )}
            {model.isEditing && (
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
                            disabled={props.disableDelete}
                            title={props.deleteTitle}
                        />
                    )}
                </>
            )}
            {props.rightNodes}
        </div>
    );
});

export default ModelActions;
