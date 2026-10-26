import clsx from 'clsx';
import { type MouseEventHandler } from 'react';

import { translate } from '@docusaurus/Translate';
import Button, { Base, extractSharedProps } from '.';
import { DiscardIcon, SIZE_S } from '../icons';
import styles from './styles.module.scss';

interface Props {
    onClick: MouseEventHandler<HTMLButtonElement>;
    size?: number;
}

type DiscardProps = Props & Base;

const Discard = (props: DiscardProps) => {
    return (
        <Button
            title={
                props.title ??
                translate({
                    message: 'Änderungen verwerfen',
                    id: 'share.button.discard.title',
                    description: 'Text of the button discard'
                })
            }
            {...extractSharedProps(props)}
            className={clsx(styles.discard, 'button--sm', props.className)}
            color="secondary"
            onClick={props.onClick}
            icon={<DiscardIcon size={props.size ?? SIZE_S} />}
        />
    );
};

export default Discard;
