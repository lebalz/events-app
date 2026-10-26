import clsx from 'clsx';

import { default as UserModel } from '@site/src/models/User';
import { useStore } from '@site/src/stores/hooks';
import _ from 'es-toolkit/compat';
import { observer } from 'mobx-react-lite';
import Select from 'react-select';
import styles from './untisLinker.module.scss';

interface Props {
    user: UserModel;
}

const UntisLinker = observer((props: Props) => {
    const untisStore = useStore('untisStore');
    const { user } = props;
    if (!user) {
        return null;
    }
    return (
        <div className={clsx(styles.container)}>
            <Select
                menuPortalTarget={document.body}
                styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 'var(--ifm-z-index-overlay)' }),
                    valueContainer: (base) => ({ ...base, flexBasis: '12em' })
                }}
                className={clsx(styles.select)}
                classNamePrefix="select"
                value={{
                    value: user.untisId,
                    label: user.untisTeacher ? `${user.shortName} - ${user.untisTeacher?.longName}` : '-'
                }}
                options={_.orderBy(untisStore.teachers.slice(), ['hasUser', 'name'], ['asc', 'asc']).map(
                    (t) => ({
                        value: t.id,
                        label: `${t.shortName} - ${t.longName}${t.hasUser ? ' 🔗' : ''}`,
                        isDisabled: t.hasUser
                    })
                )}
                onChange={(opt) => {
                    user.linkUntis(opt?.value);
                }}
                isMulti={false}
                isSearchable={true}
                isClearable={!!user.untisTeacher}
            />
        </div>
    );
});

export default UntisLinker;
