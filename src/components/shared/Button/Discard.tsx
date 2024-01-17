import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { DeleteIcon, DiscardIcon, SIZE_S } from '../icons';
import Button, { Base, extractSharedProps } from '.';
import Translate, { translate } from '@docusaurus/Translate';

interface Props {
    onClick: () => void;
    size?: number;
}

type DiscardProps = Props & Base;

const Discard = (props: DiscardProps) => {
    return (
        <Button 
            title={translate({
                message : "Änderungen verwerfen",
                id : "share.button.discard.title",
                description : "Text of the button discard"
            })}
            {...extractSharedProps(props)}
            className={clsx(styles.discard, 'button--sm', props.className)}
            color='secondary'
            onClick={props.onClick}
            icon={<DiscardIcon size={props.size ?? SIZE_S} />}
        />
    );
};

export default Discard;