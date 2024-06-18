import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { EditIcon, EditVersionIcon, SIZE_S } from '../icons';
import Button, { Base, extractSharedProps } from '.';
import { translate } from '@docusaurus/Translate';

interface Props {
    onClick: () => void;
    size?: number;
    newVersion?: boolean;
}

type EditProps = Props & Base;

const Edit = (props: EditProps) => {
    return (
        <Button
            title={
                props.newVersion
                    ? translate({
                          message: 'Bearbeiten (Es wird eine neue Version erstellt)',
                          id: 'share.button.edit.versioned.title',
                          description: 'Text of the button edit'
                      })
                    : translate({
                          message: 'Bearbeiten',
                          id: 'share.button.edit.title',
                          description: 'Text of the button edit'
                      })
            }
            {...extractSharedProps(props)}
            className={clsx(styles.edit, props.className)}
            color="orange"
            onClick={props.onClick}
            icon={
                props.newVersion ? (
                    <EditVersionIcon size={props.size ?? SIZE_S} />
                ) : (
                    <EditIcon size={props.size ?? SIZE_S} />
                )
            }
        />
    );
};

export default Edit;
