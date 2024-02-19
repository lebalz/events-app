import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { toGlobalDate } from '@site/src/models/helpers/time';
import Button from '../shared/Button';
import { mdiPlusCircleOutline } from '@mdi/js';
import { Icon, SIZE } from '../shared/icons';
import { translate } from '@docusaurus/Translate';
import { ApiState } from '@site/src/stores/iStore';
interface Props {
    text: string;
    onAdd: () => void;
    color?: string;
    apiState?: ApiState;
    size?: number;
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
        />
    )
});

export default AddButton;