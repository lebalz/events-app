import type { WrapperProps } from '@docusaurus/types';
import EventModal from '@site/src/components/Event/Modal';
import Layout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';
import React, { ReactNode } from 'react';

type Props = WrapperProps<typeof LayoutType>;

export default function LayoutWrapper(props: Props & { children?: ReactNode }): React.ReactNode {
    return (
        <>
            <Layout
                {...props}
                children={
                    <>
                        {props.children}
                        <EventModal />
                        <div id="popup-root" />
                    </>
                }
            />
        </>
    );
}
