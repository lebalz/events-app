import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Layout from '@theme/Layout';
import HomepageHeader from '../HomepageHeader';

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
