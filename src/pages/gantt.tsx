import Layout from '@theme/Layout';
import 'gantt-task-react/dist/index.css';
import { observer } from 'mobx-react-lite';
import Filter from '../components/Event/Filter';
import Timeline from '../components/Event/Views/Timeline';
import { useStore } from '../stores/hooks';

const GanttView = observer(() => {
    const viewStore = useStore('viewStore');
    const { eventTable } = viewStore;
    if (!eventTable) {
        return null;
    }
    return (
        <Layout>
            <Filter showCurrentAndFuture eventTable={eventTable} />
            <Timeline events={eventTable.events} />
        </Layout>
    );
});

export default GanttView;
