import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import {
    AffectedAudience,
    EventAudience,
    EventAudienceIcons,
    EventAudienceTranslationLong
} from '@site/src/api/event';
import { Icon, SIZE_S } from '../../../../shared/icons';
import Event from '@site/src/models/Event';
import { translate } from '@docusaurus/Translate';
import DefinitionList from '@site/src/components/shared/DefinitionList';
import Tooltip from '@site/src/components/shared/Tooltip';
import { mdiInformationVariantCircle } from '@mdi/js';

interface Props {
    event: Event;
    showExample?: boolean;
    marginLeft?: string;
}

const TeachingAffectedTranslation: { [color: string]: string } = {
    red: translate({
        message: 'nicht',
        id: 'audienceInfo.teachingAffected.no'
    }),
    orange: translate({
        message: 'nur teilweise',
        id: 'audienceInfo.teachingAffected.no'
    }),
    green: ''
};

interface InfoProps<T extends EventAudience> {
    audience: T;
    scenario: Exclude<EventAudience, EventAudience.ALL>;
}

const AudienceInfo = observer(({ scenario, audience }: InfoProps<EventAudience>) => {
    const config = AffectedAudience[audience][scenario];
    const color = config.color ?? 'green';
    const iconPath = config.icon ?? EventAudienceIcons[scenario];
    return (
        <>
            <dt>
                <span className={clsx(styles.audience)}>
                    <Tooltip title={EventAudienceTranslationLong[scenario]}>
                        <Icon
                            path={EventAudienceIcons[scenario]}
                            size={SIZE_S}
                            className={clsx(styles.icon)}
                            color="var(--ifm-color-emphasis-700)"
                        />
                    </Tooltip>
                </span>
            </dt>
            <dd className={clsx(styles.scenario)}>
                <Tooltip
                    title={`Betrifft ${EventAudienceTranslationLong[scenario]} ${TeachingAffectedTranslation[color]}`}
                >
                    <Icon
                        path={iconPath}
                        color={color}
                        size={SIZE_S}
                        className={clsx(styles.icon)}
                    />
                </Tooltip>
                {config.description || EventAudienceTranslationLong[scenario]}
            </dd>
        </>
    );
});

const Info = observer((props: Props) => {
    const { event } = props;
    return (
        <DefinitionList gridTemplateColumns="2em minmax(4em, 20em)" className={clsx(styles.info)}>
            <AudienceInfo audience={event.audience} scenario={EventAudience.LP} />
            <AudienceInfo audience={event.audience} scenario={EventAudience.KLP} />
            <AudienceInfo audience={event.audience} scenario={EventAudience.STUDENTS} />
            {props.showExample && (
                <>
                    <dt>
                        <Icon
                            path={mdiInformationVariantCircle}
                            color="blue"
                            size={SIZE_S}
                            className={clsx(styles.audience)}
                        />
                    </dt>
                    <dd className={clsx(styles.example)}>{AffectedAudience[event.audience].example}</dd>
                </>
            )}
        </DefinitionList>
    );
});

export default Info;
