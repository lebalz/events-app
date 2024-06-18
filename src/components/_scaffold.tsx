import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';

interface Props {}

const Component = observer((props: Props) => {
    return <div></div>;
});

export default Component;
