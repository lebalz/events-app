
import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import Button from '../Button';
import { mdiChevronDown, mdiChevronRight } from '@mdi/js';


interface Props {
    event: EventModel;
}

const AudiencePicker = observer((props: Props) => {
    const [open, setOpen] = React.useState(true);
    const untisStore = useStore('untisStore');
    const { classTree } = untisStore;
    const { event } = props;
    return (
        <div className={clsx('dropdown', styles.audience, 'dropdown--show')}>
            <Button
                className={clsx('button', 'button--secondary', 'button--active', styles.button)}
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
                        return (<div key={idx}>
                            <div>
                                <input id={gradYear} type='checkbox' onChange={() => {
                                    event.toggleClass(`${gradYear.slice(2)}*`);
                                }} checked={event.isAudience(`${gradYear.slice(2)}*`)} />
                                <label htmlFor={gradYear}>{`${gradYear}*`}</label>
                            </div>
                            {
                                Object.keys(classTree[gradYear]).map((dep, iidx) => {
                                    return (<div key={iidx} style={{ marginLeft: '0.75em' }}>
                                        <div>
                                            <input
                                                id={dep}
                                                type='checkbox'
                                                onChange={action(() => {
                                                    if (classTree[gradYear][dep].every(c => event.isAudience(c))) {
                                                        classTree[gradYear][dep].forEach(c => {
                                                            event.toggleClass(c)
                                                        })
                                                    } else {
                                                        classTree[gradYear][dep].forEach(c => {
                                                            if (!event.isAudience(c)) {
                                                                event.toggleClass(c)
                                                            }
                                                        })
                                                    }
                                                })}
                                                checked={classTree[gradYear][dep].every(c => event.isAudience(c))} />
                                            <label htmlFor={dep}>{`${dep}*`}</label>
                                        </div>
                                        {classTree[gradYear][dep].map((kl, iiidx) => {
                                            return (
                                                <div key={iiidx} style={{ marginLeft: '1.5em' }}>
                                                    <input id={kl} type='checkbox' onChange={() => {
                                                        event.toggleClass(kl);
                                                    }} checked={event.isAudience(kl)} />
                                                    <label htmlFor={kl}>{kl}</label>
                                                </div>
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