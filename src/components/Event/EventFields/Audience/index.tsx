import React from 'react';

import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from '../iEventField';
import Departments from '../Departments';
import Klasses from '../Klasses';
import Edit from './Edit';
import LinkedUsers from '../LinkedUsers';

interface Props extends CommonProps {
    isEditGrid?: boolean /** true when at least one element of the grid is edited */;
}

const Audience = observer((props: Props) => {
    const { event } = props;
    if (event.isEditable && event.isEditing) {
        return <Edit {...props} />;
    }
    return (
        <React.Fragment>
            <Departments {...props} />
            <Klasses {...props} />
            <LinkedUsers {...props} />
        </React.Fragment>
    );
});

export default Audience;
