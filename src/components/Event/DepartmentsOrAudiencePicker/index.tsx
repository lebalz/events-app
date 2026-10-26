import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import AudiencePicker from '../../shared/AudiencePicker';
import AudienceOptions from '../EventFields/AudienceOptions';
import Departments from '../EventFields/Departments';
import { Props as CommonProps } from '../EventFields/iEventField';
import TeachingAffected from '../EventFields/TeachingAffected';
import styles from './styles.module.scss';

interface Props extends CommonProps {
    isEditGrid?: boolean /** true when at least one element of the grid is edited */;
}

const DepartmentsOrAudiencePicker = observer((props: Props) => {
    const { event } = props;
    if (event.isEditing) {
        return (
            <div className={clsx(styles.departmentsOrAudience)}>
                <div className={clsx(styles.left)}>
                    <TeachingAffected event={event} isEditable />
                    <AudienceOptions event={event} />
                </div>
                <AudiencePicker event={event} className={clsx(styles.right)} />
            </div>
        );
    }
    return <Departments {...props} />;
});

export default DepartmentsOrAudiencePicker;
