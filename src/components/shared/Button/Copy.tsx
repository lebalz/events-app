import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { EditIcon, SIZE_S, Copy as CopyIcon, Loading, Success, Error } from '../icons';
import Button, { Base, extractSharedProps } from '.';
import Translate, { translate } from '@docusaurus/Translate';

interface Props {
    size?: number;
    value: string;
    icon?: ReactNode;
}

type EditProps = Props & Base;
type CopyState = 'none' | 'spin' | 'copied' | 'error';

const Copy = (props: EditProps) => {
    const [copyState, setCopyState] = React.useState<CopyState>('none');

    React.useEffect(() => {
        if (['none', 'spin'].includes(copyState)) {
            return;
        }
        const timeoutId = setTimeout(() => setCopyState('none'), 2000);
        return () => clearTimeout(timeoutId);
    }, [copyState]);

    let icon = props.icon ?? <CopyIcon size={props.size} />;
    switch (copyState) {
        case 'spin':
            icon = <Loading size={props.size} />;
            break;
        case 'copied':
            icon = <Success size={props.size} />;
            break;
        case 'error':
            icon = <Error size={props.size} />;
            break;
    }
    return (
        <Button
            title={
                props.title ??
                translate({
                    message: 'Kopieren',
                    id: 'share.button.copy.title',
                    description: 'Text of the button copy'
                })
            }
            {...extractSharedProps(props)}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCopyState('spin');
                navigator.clipboard
                    .writeText(props.value)
                    .then(() => {
                        setCopyState('copied');
                    })
                    .catch(() => {
                        setCopyState('error');
                    });
            }}
            icon={icon}
        />
    );
};

export default Copy;
