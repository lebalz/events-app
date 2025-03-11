import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from '../iEventField';
import { mdiCircle } from '@mdi/js';
import { Icon, SIZE_XXS } from '../../../shared/icons';
import Tooltip from '../../../shared/Tooltip';
import Button from '../../../shared/Button';
import { TeachingAffectedColors, TitleMap } from '.';

export interface Props extends ReadonlyProps {}

const TeachingAffectedIndicator = observer((props: Props) => {
    const { event } = props;
    return (
        <>
            <Tooltip title={TitleMap[event.teachingAffected]}>
                <div
                    style={{ gridColumn: 'teachingAffected' }}
                    className={clsx(styles.teachingAffected, styles.iconOnly, props.className, styles.center)}
                >
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
                </div>
            </Tooltip>
        </>
    );
});

export default TeachingAffectedIndicator;
