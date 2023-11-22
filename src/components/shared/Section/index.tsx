import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';


interface Props {
    title?: string | ReactNode;
    subtitle?: string | ReactNode;
    children?: ReactNode;
    className?: string;
}

const Section = observer((props: Props) => {
    return (
        <div className={clsx('hero', 'shadow--lw', styles.section, props.className)}>
            <div className={clsx('container')}>
                {props.title && (
                    <h1 className={clsx('hero__title')}>{props.title}</h1>
                )}
                {props.subtitle && (
                    <p className={clsx('hero__subtitle')}>{props.subtitle}</p>
                )}
                <div>
                    {props.children}
                </div>
            </div>
        </div>
    )
});

export default Section;