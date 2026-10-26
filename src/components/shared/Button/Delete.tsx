import { translate } from '@docusaurus/Translate';
import { Base } from '.';
import { DeleteIcon, SIZE_S } from '../icons';
import Confirm from './Confirm';

interface Props {
    onClick: () => void;
    flyoutSide?: 'left' | 'right';
    size?: number;
}

type DeleteProps = Props & Base;

const Delete = (props: DeleteProps) => {
    return (
        <Confirm
            confirmTitle={translate({
                id: 'share.button.delete.confirm',
                description: 'Text of the button confirm',
                message: 'Wirklich Löschen?'
            })}
            consentText={translate({
                message: 'Ja',
                id: 'share.button.delete.confirm.yes',
                description: 'Text of the button confirm yes'
            })}
            rejectText={translate({
                message: 'Nein',
                id: 'share.button.delete.confirm.no',
                description: 'Text of the button confirm no'
            })}
            onClick={() => props.onClick()}
            icon={<DeleteIcon size={props.size ?? SIZE_S} />}
            color="red"
            position={['bottom center', 'top center']}
        />
    );
};

export default Delete;
