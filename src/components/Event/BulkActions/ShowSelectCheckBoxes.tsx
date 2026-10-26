import clsx from 'clsx';

import { translate } from '@docusaurus/Translate';
import { mdiCheckboxBlankBadgeOutline } from '@mdi/js';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import Button from '../../shared/Button';
import { SIZE_S } from '../../shared/icons';
import styles from './styles.module.scss';

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
                onClick={() => viewStore.eventTable?.toggleShowSelect()}
                title={translate({
                    id: 'event.bulkActions.show_select',
                    message: 'Terminauswahl anzeigen'
                })}
            />
        </div>
    );
});

export default ShowSelectCheckBoxes;
