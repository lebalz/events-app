import Layout from '@theme/Layout';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import VirtualizedTable from '../components/shared/VirtualizedTable';

// These item sizes are arbitrary.
// Yours should be based on the content of the item.

const Example = observer(() => {
    const store = useStore('eventStore');
    console.log('rerender p1', store.events.length)
    return (
        <Layout>
            <VirtualizedTable />
        </Layout >
    )
});

export default Example;