import React from 'react';
import clsx from 'clsx';
import styles from '../styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from '../iEventField';
import Edit from './Edit';
import { EventAudienceOverviewTranslation } from '@site/src/api/event';
import Badge from '@site/src/components/shared/Badge';
import Popup from 'reactjs-popup';
import Info from './Info';
export interface Props extends CommonProps {
    hideLabel?: boolean;
}
const AudienceOptions = observer((props: Props) => {
    const { event } = props;
    if (event.isEditable && event.isEditing) {
        return <Edit {...props} />;
    }
    return (
        <div
            style={{ gridColumn: 'audienceOptions' }}
            className={clsx(styles.options, props.className, 'grid-AudienceOptions')}
        >
            <Popup
                trigger={
                    <span className={clsx(styles.lighterFont)}>
                        <Badge text={EventAudienceOverviewTranslation[event.audience]} />
                    </span>
                }
                on="hover"
                position={['top center', 'top right', 'top left']}
                nested
                repositionOnResize
            >
                <Info event={event} />
            </Popup>
        </div>
    );
});

export default AudienceOptions;
