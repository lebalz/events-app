import React, { useState } from 'react';
import clsx from 'clsx';

import styles from './Upload.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../shared/Button';
import { mdiFileUploadOutline, mdiFileExcel, mdiFileDelimited } from '@mdi/js';
import { Icon, SIZE_S } from '../shared/icons';
import { ImportType } from '@site/src/api/event';
import Translate, { translate } from '@docusaurus/Translate';

interface Props {
    type: ImportType;
}
const FileEnding: { [key in ImportType]: '.xlsx' | '.csv' } = {
    [ImportType.V1]: '.xlsx',
    [ImportType.GBJB_CSV]: '.csv',
    [ImportType.GBSL_XLSX]: '.xlsx'
};
const FileIcon: { [key in ImportType]: string } = {
    [ImportType.V1]: mdiFileExcel,
    [ImportType.GBJB_CSV]: mdiFileDelimited,
    [ImportType.GBSL_XLSX]: mdiFileExcel
};
const FileIconColor: { [key in ImportType]: string } = {
    [ImportType.V1]: 'green',
    [ImportType.GBJB_CSV]: 'blue',
    [ImportType.GBSL_XLSX]: 'teal'
};

const Upload = observer((props: Props) => {
    const [selectedFile, setSelectedFile] = useState<File>(null);
    const [fileInputKey, setFileInputKey] = useState<number>(1);
    const jobStore = useStore('jobStore');

    return (
        <label className={clsx(styles.dropArea)} htmlFor="excel-import">
            <Icon
                path={FileIcon[props.type]}
                size={4}
                className={clsx(styles.icon)}
                color={FileIconColor[props.type]}
            />
            <input
                className={clsx('button', 'button--secondary')}
                key={fileInputKey}
                type="file"
                id="excel-import"
                name="terminplan"
                accept={FileEnding[props.type]}
                multiple={false}
                onChange={(e) => setSelectedFile(e.currentTarget!.files![0])}
            />
            <Button
                text={translate({
                    id: 'upload.button.text',
                    message: 'Upload',
                    description: 'text on the button upload'
                })}
                title={translate({
                    id: 'upload.button.title',
                    message: 'Importiere Excel-Datei',
                    description: 'Text displayed on mouse-over over the upload button'
                })}
                disabled={!selectedFile}
                color="primary"
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
                className={clsx(styles.button)}
                icon={<Icon path={mdiFileUploadOutline} size={SIZE_S} />}
            />
        </label>
    );
});

export default Upload;
