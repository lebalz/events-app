import React from 'react';
import Translate from '@docusaurus/Translate';
import clsx from 'clsx';

interface Props {
    onClose: () => void;
}

const NoDraftEventsAlert = (props: Props) => {
    return (
        <div className={clsx('alert', 'alert--warning')}>
            <button
                aria-label="Close"
                className="clean-btn close"
                type="button"
                onClick={() => {
                    props.onClose();
                }}
            >
                <span aria-hidden="true">&times;</span>
            </button>
            <Translate id="shiftEditor.noDraftEvent.alert">
                Der Editor kann nur Entwürfe bearbeiten. Aktuell sind keine Entwürfe vorhanden (nur
                eingereichte, zurückgewiesene oder veröffentlichte Termine).
            </Translate>
        </div>
    );
};

export default NoDraftEventsAlert;
