import clsx from 'clsx';

import { translate } from '@docusaurus/Translate';
import { mdiContentDuplicate } from '@mdi/js';
import Button, { Base, extractSharedProps } from '.';
import { SIZE_S } from '../icons';

interface Props {
    onClick: () => void;
    size?: number;
}

type EditProps = Props & Base;

const Clone = (props: EditProps) => {
    return (
        <Button
            icon={mdiContentDuplicate}
            title={translate({
                message: 'Duplizieren',
                id: 'share.button.clone.title',
                description: 'Text of the button clone'
            })}
            {...extractSharedProps(props)}
            className={clsx(props.className)}
            size={props.size ?? SIZE_S}
            color="primary"
            onClick={() => {
                props.onClick();
            }}
        />
    );
};

export default Clone;
