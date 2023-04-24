
import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { toGlobalDate } from '@site/src/models/helpers/time';
import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';


interface Props {
    event: EventModel;
}

const AudiencePicker = observer((props: Props) => {
    const untisStore = useStore('untisStore');
    const {classTree} = untisStore;
    const {event} = props;
    return (
        <div className={clsx('dropdown', styles.audience)}>
            <button
                className={clsx('button', 'button--secondary')}
                data-toggle="dropdown"
                onClick={(e) => {
                    if (!props.event.isEditable) {
                        return;
                    }
                    const toggle = e.currentTarget;
                    const dropdown = toggle.parentElement;
                    function dismissDropdown(ev) {
                        if (toggle.contains(ev.target) || dropdown.contains(ev.target)) {
                            return;
                        }
                        toggle.classList.remove('button--active');
                        dropdown.classList.remove('dropdown--show');
                        document.removeEventListener('click', dismissDropdown);
                    }
                    if (!dropdown.classList.contains('dropdown--show')) {
                        toggle.classList.add('button--active');
                        dropdown.classList.add('dropdown--show');
                        setTimeout(() => {
                            document.addEventListener('click', dismissDropdown);
                        }, 0);
                    }
                }}
            >
                Edit
            </button>
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
                                return (<div key={iidx} style={{marginLeft: '0.75em'}}>
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
                                            <div key={iiidx} style={{marginLeft: '1.5em'}}>
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