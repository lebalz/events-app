import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import { mdiCircle } from '@mdi/js';
import { Icon, SIZE_XS, SIZE_XXS } from '../../shared/icons';
import { TeachingAffected as TeachingAffectedType } from '@site/src/api/event';
import { translate } from '@docusaurus/Translate';
import Tooltip from '../../shared/Tooltip';
import Button from '../../shared/Button';

interface Props extends ReadonlyProps {
    show: 'icon' | 'text' | 'both';
    align?: 'left' | 'center' | 'right';
    toggleExpanded?: boolean;
}

export const TeachingAffectedColors: { [key in TeachingAffectedType]: string } = {
    [TeachingAffectedType.NO]: 'green',
    [TeachingAffectedType.PARTIAL]: 'orange',
    [TeachingAffectedType.YES]: 'red'
};

const DescriptionMap: { [key in TeachingAffectedType]: string } = {
    [TeachingAffectedType.NO]: translate({
        message: 'Nein',
        id: 'eventField.teachingAffected.no',
        description: 'Label for the Event Field'
    }),
    [TeachingAffectedType.PARTIAL]: translate({
        message: 'Teilweise',
        id: 'eventField.teachingAffected.partial',
        description: 'Label for the Event Field'
    }),
    [TeachingAffectedType.YES]: translate({
        message: 'Ja',
        id: 'eventField.teachingAffected.yes',
        description: 'Label for the Event Field'
    })
};

export const TitleMap: { [key in TeachingAffectedType]: string } = {
    [TeachingAffectedType.NO]: translate({
        message: 'Betrifft den Unterricht nicht',
        id: 'eventField.teachingAffected.no.title',
        description: 'Label for the Event Field'
    }),
    [TeachingAffectedType.PARTIAL]: translate({
        message: 'Unterricht teilweise betroffen',
        id: 'eventField.teachingAffected.partial.title',
        description: 'Label for the Event Field'
    }),
    [TeachingAffectedType.YES]: translate({
        message: 'Unterricht betroffen',
        id: 'eventField.teachingAffected.yes.title',
        description: 'Label for the Event Field'
    })
};

const TeachingAffected = observer((props: Props) => {
    const { event, show } = props;
    return (
        <Tooltip title={TitleMap[event.teachingAffected]}>
            <div
                style={{ gridColumn: 'teachingAffected' }}
                className={clsx(
                    styles.teachingAffected,
                    show === 'icon' && styles.iconOnly,
                    props.className,
                    styles[props.align ?? 'center']
                )}
            >
                <>
                    {(show === 'icon' || show === 'both') && (
                        <>
                            {props.toggleExpanded ? (
                                <Button
                                    onClick={() => event.isExpanded && event.setExpanded(false)}
                                    icon={
                                        <Icon
                                            path={mdiCircle}
                                            color={TeachingAffectedColors[event.teachingAffected]}
                                            size={SIZE_XXS}
                                        />
                                    }
                                    size={SIZE_XXS}
                                />
                            ) : (
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        event.setExpanded(!event.isExpanded);
                                    }}
                                    icon={mdiCircle}
                                    size={SIZE_XXS}
                                    color={TeachingAffectedColors[event.teachingAffected]}
                                    className={clsx(styles.teachingAffectedBtn)}
                                />
                                // <Icon path={mdiCircle} color={ColorMap[event.teachingAffected]} size={SIZE_XXS} />
                            )}
                        </>
                    )}
                    {(show === 'text' || show === 'both') && (
                        <span style={{ display: 'inline-block' }}>
                            {DescriptionMap[event.teachingAffected]}
                        </span>
                    )}
                </>
            </div>
        </Tooltip>
    );
});

export default TeachingAffected;
