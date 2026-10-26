import clsx from 'clsx';

import { mdiPlusCircleOutline } from '@mdi/js';
import { ApiState } from '@site/src/stores/iStore';
import { observer } from 'mobx-react-lite';
import Button from '../shared/Button';
import { Icon, SIZE } from '../shared/icons';
interface Props {
    text?: string;
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
    );
});

export default AddButton;
