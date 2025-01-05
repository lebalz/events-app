import React from 'react';
import { observer } from 'mobx-react-lite';
import AudienceShifter from './AudienceShifter';
import Badge from '@site/src/components/shared/Badge';
import Icon from '@mdi/react';
import styles from './styles.module.scss';
import clsx from 'clsx';
import { mdiArrowRightBoldCircle, mdiClose, mdiRestore, mdiShuffle } from '@mdi/js';
import { SIZE, SIZE_S, SIZE_XS } from '@site/src/components/shared/icons';
import Button from '@site/src/components/shared/Button';
import { translate } from '@docusaurus/Translate';
import Popup from 'reactjs-popup';
import CreatableSelect from 'react-select/creatable';
import { useStore } from '@site/src/stores/hooks';
import useIsMobileView from '@site/src/hookes/useIsMobileView';
import { PopupActions } from 'reactjs-popup/dist/types';

interface ShiftProps {
    audienceShifter: AudienceShifter;
    name: string;
}

const displayName = (name: string | null) => {
    if (!name) {
        return '';
    }
    if (name.length >= 4) {
        return name;
    }
    return `${name}*`;
};

const AudienceShift = observer((props: ShiftProps) => {
    const ref = React.useRef<PopupActions>(null);
    const { audienceShifter, name } = props;
    const untisStore = useStore('untisStore');
    const departmentStore = useStore('departmentStore');
    const isMobileView = useIsMobileView(470);

    return (
        <div className={clsx(styles.shift)}>
            <Badge text={displayName(name)} className={clsx(styles.audienceBadge)} />
            <Icon path={mdiArrowRightBoldCircle} size={SIZE} color="var(--ifm-color-blue)" />
            <div className={clsx(styles.shifted)}>
                <Badge
                    text={displayName(audienceShifter.audience.get(name))}
                    className={clsx(styles.audienceBadge)}
                    title={
                        audienceShifter.audience.get(name)
                            ? undefined
                            : translate({
                                  id: 'shiftAudienceEditor.noAudience',
                                  message: 'Keine Zuordnung - die Klasse wird vom Termin entfernt.'
                              })
                    }
                />
                <Popup
                    ref={ref}
                    trigger={
                        <span>
                            <Button
                                className="button"
                                size={SIZE_XS}
                                icon={mdiShuffle}
                                color="blue"
                                title={translate({
                                    id: 'shiftAudienceEditor.changeAudience',
                                    message: 'Zuordnung manuell ändern'
                                })}
                            />
                        </span>
                    }
                    modal={isMobileView}
                    overlayStyle={{ background: isMobileView ? 'rgba(0,0,0,0.5)' : undefined }}
                    lockScroll
                >
                    <div>
                        <CreatableSelect
                            isClearable
                            closeMenuOnSelect
                            className={clsx(styles.audienceSelector)}
                            menuIsOpen
                            formatCreateLabel={(inputValue) => {
                                if (inputValue.endsWith('*')) {
                                    return translate(
                                        {
                                            id: 'shiftAudienceEditor.createWhitelist',
                                            message: '{inputValue} (Ganze Jahrgangsstufe der Abteilung)'
                                        },
                                        { inputValue }
                                    );
                                }
                                return translate(
                                    {
                                        id: 'shiftAudienceEditor.createClass',
                                        message: 'Neue Klasse: {inputValue}'
                                    },
                                    { inputValue }
                                );
                            }}
                            isValidNewOption={(inputValue) => {
                                if (inputValue.length !== 4) {
                                    return false;
                                }
                                if (inputValue.endsWith('*')) {
                                    return departmentStore.isValidClassGroup(inputValue.substring(0, 3));
                                }
                                return departmentStore.isValidClass(inputValue);
                            }}
                            options={untisStore.classes.map((c) => ({ value: c.name, label: c.displayName }))}
                            onChange={(option) => {
                                // selected an existing class
                                if (option) {
                                    audienceShifter.setAudienceFor(name, option.value);
                                }
                                ref.current?.close();
                            }}
                            onCreateOption={(inputValue) => {
                                if (inputValue.endsWith('*')) {
                                    audienceShifter.setAudienceFor(name, inputValue.substring(0, 3));
                                } else {
                                    audienceShifter.setAudienceFor(name, inputValue);
                                }
                                ref.current?.close();
                            }}
                        />
                    </div>
                </Popup>
                {audienceShifter.isCustom(name) ? (
                    <Button
                        icon={mdiRestore}
                        color="blue"
                        size={SIZE_XS}
                        onClick={() => {
                            audienceShifter.reset(name);
                        }}
                        title={translate({
                            id: 'shiftAudienceEditor.resetAudience',
                            message: 'Zuordnung zurücksetzen'
                        })}
                    />
                ) : (
                    <Button
                        icon={mdiClose}
                        size={SIZE_XS}
                        onClick={() => {
                            audienceShifter.setAudienceFor(name, null);
                        }}
                        title={translate({
                            id: 'shiftAudienceEditor.removeAudience',
                            message: 'Zuordnung entfernen'
                        })}
                    />
                )}
            </div>
        </div>
    );
});

export default AudienceShift;
