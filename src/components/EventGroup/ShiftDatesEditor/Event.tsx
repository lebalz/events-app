import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import {default as EventModel} from '@site/src/models/Event';
import DefinitionList from '../../shared/DefinitionList';
import Translate from '@docusaurus/Translate';


interface Props {
    event: EventModel;
    title: string;
}

const Event = observer((props: Props) => {
    const {event} = props;
    return (
        <div className={clsx(styles.event, 'card')}>
            <div className={clsx(styles.header, 'card__header')}>
                <h4>{props.title}</h4>
            </div>
            <div className={clsx(styles.header, 'card__body')}>
                <DefinitionList>
                    <dt>
                        <Translate
                            id="joi.event.start"
                            description='Start of event'
                        >
                            Start
                        </Translate>
                    </dt>
                    <dd>{event.fStartDate}{' '}{event.fStartTime}</dd>
                    <dt>
                        <Translate
                            id="joi.event.end"
                            description='End of event'
                        >
                            Ende
                        </Translate>
                    </dt>
                    <dd>{event.fEndDate}{' '}{event.fEndTime}</dd>                
                    <dt>
                        <Translate
                            id="event.kw"
                            description='for a single event: kw'
                        >
                            KW
                        </Translate>
                    </dt>
                    <dd>{event.kw}</dd>
                    <dt>
                        <Translate
                            id="event.weekday"
                            description='for a single event: weekday'
                        >
                            Wochentag
                        </Translate>
                    </dt>
                    <dd>{event.dayFullStart}{event.fStartDate !== event.fEndDate ? ` - ${event.dayFullEnd}` : ''}</dd>
                    <dt>
                        <Translate
                            id="event.description"
                            description='for a single event: description'
                        >
                            Titel
                        </Translate>
                    </dt>
                    <dd>
                        {event.description}
                    </dd>
                    <dt>
                        <Translate
                            id="event.descriptionLong"
                            description='for a single event: description long'
                        >
                            Beschreibung
                        </Translate>
                    </dt>
                    <dd>{props.event.descriptionLong}</dd>
                </DefinitionList>
            </div>
        </div>
    )
});

export default Event;