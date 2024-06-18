import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../../shared/Button';
import { mdiCheckboxBlankBadgeOutline } from '@mdi/js';
import { SIZE_S } from '../../shared/icons';
import { translate } from '@docusaurus/Translate';

interface Props {
    label?: string;
}

const ShowSelectCheckBoxes = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    return (
        <div className={clsx(styles.showSelect)}>
            <Button
                icon={mdiCheckboxBlankBadgeOutline}
                text={props.label}
                size={SIZE_S}
                onClick={() => viewStore.eventTable.toggleShowSelect()}
                title={translate({
                    id: 'event.bulkActions.show_select',
                    message: 'Terminauswahl anzeigen'
                })}
            />
        </div>
    );
});

export default ShowSelectCheckBoxes;
