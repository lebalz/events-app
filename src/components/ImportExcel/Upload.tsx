import React, { useState, type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './Upload.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../shared/Button';
import { mdiFileUploadOutline } from '@mdi/js';
import { Icon,  SIZE_S } from '../shared/icons';


const Upload = observer(() => {
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
                    accept=".xlsx"
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
                        jobStore.importExcel(selectedFile);
                        setSelectedFile(null);
                        setFileInputKey(fileInputKey + 1);
                        return false;
                    }}
                    icon={<Icon path={mdiFileUploadOutline} size={SIZE_S}/>}
                />
        </label>
    );
});

export default Upload;