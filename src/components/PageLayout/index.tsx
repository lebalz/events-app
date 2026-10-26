import Layout from '@theme/Layout';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import HomepageHeader from '../HomepageHeader';
import styles from './styles.module.scss';

interface Props {
    children?: React.ReactNode;
    className?: string;
    noHeader?: boolean;
    noMarginTop?: boolean;
}

const PageLayout = observer((props: Props) => {
    return (
        <Layout>
            {!props.noHeader && <HomepageHeader />}
            <main className={clsx(styles.main, props.noMarginTop && styles.noMarginTop, props.className)}>
                {props.children}
            </main>
        </Layout>
    );
});

export default PageLayout;
