import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from '../iEventField';
import { mdiCircle } from '@mdi/js';
import { Icon, SIZE_XXS } from '../../../shared/icons';
import { TeachingAffected as TeachingAffectedType } from '@site/src/api/event';
import { translate } from '@docusaurus/Translate';
import Tooltip from '../../../shared/Tooltip';
import Button from '../../../shared/Button';
import Edit from './Edit';
import Example from './Example';

export interface Props extends ReadonlyProps {
    align?: 'left' | 'center' | 'right';
    toggleExpanded?: boolean;
    hideLabel?: boolean;
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
        message: 'Betrifft den Regelunterricht nicht.',
        id: 'eventField.teachingAffected.no.title'
    }),
    [TeachingAffectedType.PARTIAL]: translate({
        message: 'Regelunterricht teilweise betroffen.',
        id: 'eventField.teachingAffected.partial.title'
    }),
    [TeachingAffectedType.YES]: translate({
        message: 'Regelunterricht findet nicht statt.',
        id: 'eventField.teachingAffected.yes.title'
    })
};

const TeachingAffected = observer((props: Props) => {
    const { event, isEditable } = props;
    if (isEditable && event.isEditing) {
        return <Edit {...props} />;
    }
    return (
        <>
            <Tooltip title={TitleMap[event.teachingAffected]}>
                <div
                    style={{ gridColumn: 'teachingAffected' }}
                    className={clsx(
                        styles.teachingAffected,
                        props.className,
                        styles[props.align ?? 'center']
                    )}
                >
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
                    <span style={{ display: 'inline-block' }}>{DescriptionMap[event.teachingAffected]}</span>
                </div>
            </Tooltip>
        </>
    );
});

export default TeachingAffected;
