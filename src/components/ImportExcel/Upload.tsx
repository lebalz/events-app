import React, { useState, type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './Upload.module.scss';
import { importExcel } from '@site/src/api/event';


const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileUpload = (event) => {
        if (!selectedFile) {
          throw 'No file was selected';
        }
        
        const fd = new FormData();
        fd.append('terminplan', selectedFile);
    
        importExcel(fd).then((response) => {
            console.log(response);
        });
    }

    return (
        <div className="App">
            <form>
                <input
                    className={clsx('button', 'button--secondary')}
                    type="file"
                    name="terminplan"
                    accept=".xlsx"
                    style={{ marginBottom: '12px' }}
                    onChange={(e) => setSelectedFile(e.currentTarget!.files![0])}
                />
                <div className={clsx('button', 'button--secondary')} onClick={handleFileUpload}>Upload</div>
            </form>
        </div>
    );
}

export default Upload;