import React from 'react';

import { observer } from 'mobx-react-lite';
import Popup from 'reactjs-popup';
import { View, ViewIcons, ViewTranslations } from '.';
import Button from '../shared/Button';

interface Props {
    viewType: View;
    setViewType: (view: View) => void;
}

const ChangeViewAction = observer((props: Props) => {
    const { viewType, setViewType } = props;
    return (
        <Popup
            trigger={
                <div>
                    <Button icon={ViewIcons[viewType]} title={ViewTranslations[viewType]} />
                </div>
            }
        >
            <div>
                {Object.values(View).map((v) => (
                    <Button
                        key={v}
                        text={ViewTranslations[v]}
                        iconSide="left"
                        icon={ViewIcons[v]}
                        active={viewType === v}
                        onClick={() => setViewType(v)}
                    />
                ))}
            </div>
        </Popup>
    );
});

export default ChangeViewAction;
