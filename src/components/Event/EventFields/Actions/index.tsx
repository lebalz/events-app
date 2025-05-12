import React from 'react';
import clsx from 'clsx';
import sharedStyles from '../styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from '../iEventField';
import Button from '@site/src/components/shared/Button';
import { mdiArrowExpandUp } from '@mdi/js';
import { SIZE_S } from '@site/src/components/shared/icons';
import { translate } from '@docusaurus/Translate';
import OptionsPopup, { EditRowMode } from '../../EventActions/OptionsPopup';
import Edit from './Edit';

interface Props extends ReadonlyProps {
    hideShare?: boolean;
}

const Actions = observer((props: Props) => {
    const { event } = props;
    if (event.isEditable && event.isEditing) {
        return <Edit {...props} />;
    }
    return (
        <div
            style={{ gridColumn: 'actions' }}
            className={clsx(props.className, sharedStyles.actions, 'grid-actions')}
        >
            <div className={clsx(sharedStyles.flex)}>
                {event.isDraft && <EditRowMode event={event} />}
                <OptionsPopup event={event} hideEdit={event.isDraft} />
            </div>
            <div className={clsx(sharedStyles.expand, sharedStyles.flex)}>
                {props.expandeable && event.isExpanded && (
                    <>
                        <Button
                            icon={mdiArrowExpandUp}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                event.setExpanded(false);
                            }}
                            size={SIZE_S}
                            title={translate({
                                message: 'Auf eine Zeile reduzieren',
                                id: 'event.reduce.title',
                                description:
                                    'Button Title (hover) to reduce an expanded event in the table view'
                            })}
                        />
                    </>
                )}
            </div>
        </div>
    );
});

export default Actions;
