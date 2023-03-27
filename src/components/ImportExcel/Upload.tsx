import React, { useState, type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './Upload.module.scss';
import { importExcel } from '@site/src/api/event';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../shared/Button';
import { mdiFileUploadOutline } from '@mdi/js';
import { Icon, SIZE, SIZE_S } from '../shared/icons';


const Upload = observer(() => {
    const [selectedFile, setSelectedFile] = useState<File>(null);
    const jobStore = useStore('jobStore');

    return (
        <label className={clsx(styles.dropArea)} htmlFor="excel-import">
                <input
                    className={clsx('button', 'button--secondary')}
                    type="file"
                    id="excel-import"
                    name="terminplan"
                    accept=".xlsx"
                    style={{ marginBottom: '12px' }}
                    onChange={(e) => setSelectedFile(e.currentTarget!.files![0])}
                />
                <Button
                    text='Upload'
                    title="Importiere Excel-Datei"
                    disabled={!selectedFile}
                    className={clsx('button--primary')}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!selectedFile) {
                            throw 'No file was selected';
                        }
                        jobStore.importExcel(selectedFile);
                        return false;
                    }}
                    icon={<Icon path={mdiFileUploadOutline} size={SIZE_S}/>}
                />
        </label>
    );
});

export default Upload;