import React, { useState, type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './Upload.module.scss';
import { importExcel } from '@site/src/api/event';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../shared/Button';
import Icon from '@mdi/react';
import { mdiFileUploadOutline } from '@mdi/js';
import { SIZE, SIZE_S } from '../shared/icons';


const Upload = observer(() => {
    const [selectedFile, setSelectedFile] = useState<File>(null);
    const jobStore = useStore('jobStore');

    const handleFileUpload = () => {
        if (!selectedFile) {
          throw 'No file was selected';
        }
        jobStore.importExcel(selectedFile);        
    }

    return (
        <div className="App">
            <form style={{display: 'flex', alignItems: 'baseline'}}>
                <input
                    className={clsx('button', 'button--secondary')}
                    type="file"
                    name="terminplan"
                    accept=".xlsx"
                    style={{ marginBottom: '12px' }}
                    onChange={(e) => setSelectedFile(e.currentTarget!.files![0])}
                />
                <Button
                    text='Upload'
                    onClick={handleFileUpload}
                    noOutline
                    icon={<Icon path={mdiFileUploadOutline} size={SIZE_S}/>}
                />
            </form>
        </div>
    );
});

export default Upload;