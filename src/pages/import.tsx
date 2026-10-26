import Layout from '@theme/Layout';
import { observer } from 'mobx-react-lite';
import ImportEvents from '../components/ImportEvents';

const Import = observer(() => {
    return (
        <Layout>
            <ImportEvents />
        </Layout>
    );
});

export default Import;
