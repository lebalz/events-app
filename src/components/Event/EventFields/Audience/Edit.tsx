import clsx from 'clsx';

import AudiencePicker from '@site/src/components/shared/AudiencePicker';
import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from '../iEventField';
import sharedStyles from '../styles.module.scss';

interface Props extends CommonProps {
    isEditGrid?: boolean /** true when at least one element of the grid is edited */;
}

const Edit = observer((props: Props) => {
    const { event } = props;
    if (!event.isEditable || !event.isEditing) {
        return null;
    }
    return (
        <div className={clsx(sharedStyles.audience, 'grid-audience', props.className)}>
            <AudiencePicker event={event} />
        </div>
    );
});

export default Edit;
