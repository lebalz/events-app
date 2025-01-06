import React from 'react';
import Translate from '@docusaurus/Translate';
import clsx from 'clsx';

interface Props {
    onClose: () => void;
}

const DraftAlert = (props: Props) => {
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
            <Translate id="shiftEditor.invalidEvents.alert">
                Der Editor kann nur Entwürfe bearbeiten. Aktuell sind auch eingereichte, zurückgewiesene oder
                veröffentlichte Termine vorhanden.
            </Translate>
        </div>
    );
};

export default DraftAlert;
