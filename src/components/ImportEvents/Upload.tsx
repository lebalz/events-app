import React, { useState } from 'react';
import clsx from 'clsx';

import styles from './Upload.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../shared/Button';
import { mdiFileUploadOutline } from '@mdi/js';
import { Icon, SIZE_S } from '../shared/icons';
import { ImportType } from '@site/src/api/event';

interface Props {
    type: ImportType;
}
const FileEnding: {[key in ImportType]: '.xlsx' | '.csv'} = {
    [ImportType.EVENTS_XLSX]: '.xlsx',
    [ImportType.GBJB_CSV]: '.csv',
    [ImportType.GBSL_XLSX]: '.xlsx',
}

const Upload = observer((props: Props) => {
    const [selectedFile, setSelectedFile] = useState<File>(null);
    const [fileInputKey, setFileInputKey] = useState<number>(1);
    const jobStore = useStore('jobStore');

    return (
        <label className={clsx(styles.dropArea)} htmlFor="excel-import">
            <input
                className={clsx('button', 'button--secondary')}
                key={fileInputKey}
                type="file"
                id="excel-import"
                name="terminplan"
                accept={FileEnding[props.type]}
                style={{ marginBottom: '12px' }}
                multiple={false}
                onChange={(e) => setSelectedFile(e.currentTarget!.files![0])}
            />
            <Button
                text='Upload'
                title="Importiere Excel-Datei"
                disabled={!selectedFile}
                color='primary'
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!selectedFile) {
                        throw 'No file was selected';
                    }
                    jobStore.importEvents(selectedFile, props.type);
                    setSelectedFile(null);
                    setFileInputKey(fileInputKey + 1);
                    return false;
                }}
                icon={<Icon path={mdiFileUploadOutline} size={SIZE_S} />}
            />
        </label>
    );
});

export default Upload;