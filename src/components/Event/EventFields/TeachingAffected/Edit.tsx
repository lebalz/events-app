import React from 'react';
import clsx from 'clsx';

import sharedStyles from '../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Props as DefaultProps } from '.';
import styles from './styles.module.scss';
import Button from '@site/src/components/shared/Button';
import { TeachingAffected } from '@site/src/api/event';
import Translate, { translate } from '@docusaurus/Translate';
import Example from './Example';

export const TranslationsTA: { [key in TeachingAffected]: string } = {
    [TeachingAffected.YES]: translate({
        message: 'Ja',
        description: 'Yes, the teaching is affected and the class is not present',
        id: 'TeachingAffected.YES.description'
    }),
    [TeachingAffected.NO]: translate({
        message: 'Nein',
        description: 'No, the teaching happens as usual',
        id: 'TeachingAffected.NO.description'
    }),
    [TeachingAffected.PARTIAL]: translate({
        message: 'Teilweise',
        description: 'Only a part of the class will be present',
        id: 'TeachingAffected.PARTIAL.description'
    })
};

export interface Props extends DefaultProps {
    preventHideExample?: boolean;
}

const Edit = observer((props: Props) => {
    const { event } = props;
    if (!event.isEditable || !event.isEditing) {
        return null;
    }
    return (
        <div
            style={{ gridColumn: 'teachingAffected' }}
            className={clsx(sharedStyles.teachingAffected, styles.teachingAffected, props.className)}
        >
            <div className={clsx(styles.control, props.hideLabel && styles.hideLabel)}>
                {!props.hideLabel && (
                    <div className={clsx(styles.label)}>
                        <Translate id="TeachingAffected.label">Unterricht betroffen?</Translate>
                    </div>
                )}
                <div className={clsx(styles.buttonGroup, 'button-group', 'button-group--block')}>
                    {Object.keys(TeachingAffected).map((affected) => {
                        return (
                            <Button
                                text={TranslationsTA[affected]}
                                onClick={() => event.update({ teachingAffected: TeachingAffected[affected] })}
                                active={event.teachingAffected === affected}
                                key={affected}
                                noWrap
                            />
                        );
                    })}
                </div>
            </div>
            <div className={clsx(styles.example)}>
                <Example event={event} preventHideExample={props.preventHideExample} />
            </div>
        </div>
    );
});

export default Edit;
