import { observer } from 'mobx-react-lite';
import { default as CalendarComponent } from '../components/Event/Views/Calendar';
import { useStore } from '../stores/hooks';

import Layout from '@theme/Layout';
import Filter from '../components/Event/Filter';

const Calendar = observer(() => {
    const viewStore = useStore('viewStore');
    const { eventTable } = viewStore;
    if (!eventTable) {
        return null;
    }
    return (
        <Layout>
            <div>
                <Filter eventTable={eventTable} />
                {eventTable.events.length > 0 && <CalendarComponent events={eventTable.events} />}
            </div>
        </Layout>
    );
});

export default Calendar;
