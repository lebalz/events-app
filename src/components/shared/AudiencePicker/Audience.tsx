import React from 'react';
import clsx from 'clsx';

import styles from './audience.module.scss';
import { observer } from 'mobx-react-lite';
import { AffectedAudience, EventAudience, EventAudienceIcons, EventAudienceTranslationLong, EventAudienceTranslationShort } from '@site/src/api/event';
import { Icon, SIZE_S } from '../icons';
import Event from '@site/src/models/Event';
import { translate } from '@docusaurus/Translate';


interface Props {
    event: Event
    showExample?: boolean
    marginLeft?: string
}

const Audience = observer((props: Props) => {
    const { event } = props;
    return (
        <div className={clsx(styles.info)}>
            {[EventAudience.LP, EventAudience.KLP, EventAudience.STUDENTS].map(audience => {
                if (!(audience in AffectedAudience[event.audience])) {
                    return null;
                }
                return (
                    <div className={clsx(styles.audience)} key={audience} style={{marginLeft: props.marginLeft}}>
                        <div className={clsx(styles.audienceIcon)}>
                            <Icon path={EventAudienceIcons[audience]} size={SIZE_S} />
                        </div>
                        <div className={clsx(styles.audienceDescription)}>
                            <Icon 
                                path={AffectedAudience[event.audience][audience].icon} 
                                color={AffectedAudience[event.audience][audience].color} 
                                size={SIZE_S} 
                            />
                            {AffectedAudience[event.audience][audience].description || EventAudienceTranslationLong[audience]}
                            {props.showExample && audience === event.audience && (
                                <>
                                    <br />
                                    {`${translate({
                                        message: 'z.B.', 
                                        id: 'EventAudience.forExample'
                                    })} ${AffectedAudience[event.audience].example}`}
                                </>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
});

export default Audience;