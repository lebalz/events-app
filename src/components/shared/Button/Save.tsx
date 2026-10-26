import clsx from 'clsx';
import { type MouseEventHandler } from 'react';

import { translate } from '@docusaurus/Translate';
import Button, { Base, extractSharedProps } from '.';
import { SaveIcon, SaveVersionIcon, SIZE_S } from '../icons';
import styles from './styles.module.scss';

interface Props {
    onClick: MouseEventHandler<HTMLButtonElement>;
    size?: number;
    newVersion?: boolean;
}

type SaveProps = Props & Base;

const Save = (props: SaveProps) => {
    return (
        <Button
            title={
                props.title ??
                translate({
                    message: 'Speichern',
                    id: 'share.button.save.title',
                    description: 'Text of the button save'
                })
            }
            {...extractSharedProps(props)}
            className={clsx(styles.save, props.className)}
            color="green"
            onClick={props.onClick}
            icon={
                props.newVersion ? (
                    <SaveVersionIcon size={props.size ?? SIZE_S} />
                ) : (
                    <SaveIcon size={props.size ?? SIZE_S} />
                )
            }
        />
    );
};

export default Save;
