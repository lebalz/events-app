import React from 'react';

import { observer } from 'mobx-react-lite';
import Departments from '../Departments';
import { Props as CommonProps } from '../iEventField';
import Klasses from '../Klasses';
import LinkedUsers from '../LinkedUsers';
import Edit from './Edit';

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
