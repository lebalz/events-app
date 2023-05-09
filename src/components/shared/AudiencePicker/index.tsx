
import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import Button from '../Button';
import { mdiChevronDown, mdiChevronRight } from '@mdi/js';
import Toggle from './Toggle';


interface Props {
    event: EventModel;
}

const AudiencePicker = observer((props: Props) => {
    const [expanded, setExpanded] = React.useState<string[]>([]);
    const [open, setOpen] = React.useState(true);
    const untisStore = useStore('untisStore');
    const userStore = useStore('userStore');
    const { classTree } = untisStore;
    const { event } = props;
    React.useEffect(() => {
        const classes = userStore.current?.classes ?? [];
        const classesSet = new Set([
            ...classes.map(c => `${c.graduationYear}`),
            ...classes.map(c => `${c.graduationYear}-${c.departmentName}`),
            ...expanded
        ]);
        setExpanded([...classesSet])
    }, [userStore.current?.classes]);

    return (
        <div className={clsx('dropdown', styles.audience, 'dropdown--show')}>
            <Button
                className={clsx('button', 'button--active', styles.button)}
                color='secondary'
                data-toggle="dropdown"
                icon={open ? mdiChevronDown : mdiChevronRight}
                iconSide='left'
                onClick={(e) => {
                    if (!event.editing) {
                        return;
                    }
                    const toggle = e.currentTarget;
                    const dropdown = toggle.parentElement;
                    if (dropdown.classList.contains('dropdown--show')) {
                        toggle.classList.remove('button--active');
                        dropdown.classList.remove('dropdown--show');
                        setOpen(false);
                    } else {
                        toggle.classList.add('button--active');
                        dropdown.classList.add('dropdown--show');
                        setOpen(true);
                    }
                }}
                text={event.fClasses.join(', ') || '-'}
            />
            <div className={clsx(styles.dropdownMenu, 'dropdown__menu')}>
                {
                    Object.keys(classTree).map((gradYear, idx) => {
                        const isExapnded = expanded.includes(gradYear);
                        const all = event.isAudience(`${gradYear.slice(2)}*`);
                        const some = Object.keys(classTree[gradYear].departments).some(dep => classTree[gradYear].departments[dep].some(c => event.isAudience(c)));
                        return (<div key={idx}>
                            <Toggle
                                checked={all}
                                label={`${gradYear}`}
                                property={classTree[gradYear].wildcard}
                                onCollapse={() => {
                                    if (isExapnded) {
                                        setExpanded(expanded.filter(e => e !== gradYear));
                                    } else {
                                        setExpanded([...expanded, gradYear]);
                                    }
                                }}
                                collapsed={!isExapnded}
                                onToggle={(kl) => {
                                    event.toggleClass(kl);
                                }}
                                className={clsx(some && styles.some, all && styles.all)}
                            />
                            {
                                isExapnded && Object.keys(classTree[gradYear].departments).map((dep, iidx) => {
                                    const isExapnded = expanded.includes(`${gradYear}-${dep}`);
                                    const some = classTree[gradYear].departments[dep].some(c => event.isAudience(c));
                                    const all = some && classTree[gradYear].departments[dep].every(c => event.isAudience(c));
                                    return (<div key={iidx} style={{ marginLeft: '15px' }}>
                                        <Toggle
                                            checked={all}
                                            className={clsx(some && styles.some, all && styles.all)}
                                            onToggle={() => {
                                                if (all) {
                                                    classTree[gradYear].departments[dep].forEach(c => {
                                                        event.toggleClass(c)
                                                    })
                                                } else {
                                                    classTree[gradYear].departments[dep].forEach(c => {
                                                        if (!event.isAudience(c)) {
                                                            event.toggleClass(c)
                                                        }
                                                    })
                                                }
                                            }}
                                            onCollapse={() => {
                                                if (isExapnded) {
                                                    setExpanded(expanded.filter(e => e !== `${gradYear}-${dep}`));
                                                } else {
                                                    console.log(`${gradYear}-${dep}`)
                                                    setExpanded([...expanded, `${gradYear}-${dep}`]);
                                                }
                                            }}
                                            collapsed={!isExapnded}
                                            property={dep}
                                        />
                                        {isExapnded && classTree[gradYear].departments[dep].map((kl, iiidx) => {
                                            const checked = event.isAudience(kl);
                                            return (
                                                <Toggle
                                                    key={iiidx}
                                                    className={clsx(checked && styles.all, checked && styles.some)}
                                                    checked={checked}
                                                    property={kl}
                                                    onToggle={(kl) => event.toggleClass(kl)}
                                                    marginLeft={35}
                                                />
                                            )
                                        })}
                                    </div>)
                                })
                            }
                        </div>);
                    })
                }
            </div>
        </div>
    )
});

export default AudiencePicker;