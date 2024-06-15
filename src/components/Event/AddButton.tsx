import React from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import Button from '../shared/Button';
import { mdiPlusCircleOutline } from '@mdi/js';
import { Icon, SIZE } from '../shared/icons';
import { ApiState } from '@site/src/stores/iStore';
interface Props {
    text: string;
    onAdd: () => void;
    color?: string;
    apiState?: ApiState;
    size?: number;
    title?: string;
    className?: string;
}

const AddButton = observer((props: Props) => {
    return (
        <Button
            text={props.text}
            icon={<Icon path={mdiPlusCircleOutline} size={props.size || SIZE} />}
            iconSide="left"
            color={props.color || 'primary'}
            apiState={props.apiState}
            onClick={props.onAdd}
            title={props.title}
            className={clsx(props.className)}
        />
    )
});

export default AddButton;