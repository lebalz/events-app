import Layout from '@theme/Layout';
import React from 'react';
import Upload from '../components/ImportEvents/Upload';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import { Icon } from '../components/shared/icons';
import { mdiFileExcel } from '@mdi/js';
import Section from '../components/shared/Section';
import Job from '../components/Job';
import { translate } from '@docusaurus/Translate';
import { ImportType } from '../api/event';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ImportEvents from '../components/ImportEvents';

const Example = observer(() => {
    return (
        <Layout>
            <ImportEvents />
        </Layout >
    );
});

export default Example;