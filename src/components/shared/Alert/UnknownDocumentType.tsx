import Icon from '@mdi/react';
import Alert from '.';
import { mdiAlert } from '@mdi/js';
import { IfmColors } from '../Colors';
import { SIZE_S } from '../icons';

interface Props {
    type: string;
}

const UnknownDocumentType = (props: Props) => {
    return (
        <Alert type="warning">
            <Icon path={mdiAlert} size={SIZE_S} color={IfmColors.orange} /> Keine Anzeigekomponente für{' '}
            <code>{props.type}</code> gefunden.
        </Alert>
    );
};

export default UnknownDocumentType;
