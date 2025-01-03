import React from 'react';
import Loader from '../../shared/Loader';
import { observer } from 'mobx-react-lite';
import Event from '@site/src/models/Event';
import { translate } from '@docusaurus/Translate';
import { action } from 'mobx';

interface ValidationCheckerProps {
    events: Event[];
    timeout?: number;
    noLoader?: boolean;
}
const ValidationChecker = observer((props: ValidationCheckerProps) => {
    const [checking, setChecking] = React.useState(false);
    const { events } = props;
    React.useEffect(() => {
        if (events.length < 1) {
            return;
        }
        if (events.every((e) => e._initialValidationTriggered)) {
            return;
        }
        events.forEach(
            action((event) => {
                event.triggerInitialValidation();
            })
        );
        setChecking(true);
    }, [events]);
    React.useEffect(() => {
        if (checking) {
            const cancelId = setTimeout(() => {
                setChecking(false);
            }, props.timeout || 1500);
            return () => clearTimeout(cancelId);
        }
    }, [checking]);

    if (!checking || props.noLoader) {
        return null;
    }
    return <Loader label={translate({ id: 'event.validate.inProgress', message: 'Validieren' })} />;
});

export default ValidationChecker;
