import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import Video, { Props as VideoProps } from './Video';

interface Props {
    videos: VideoProps[];
}

const VideoGrid = (props: Props) => {
    return (
        <div className={clsx(styles.grid)}>
            {props.videos.map((video, index) => (
                <Video {...video} key={index} />
            ))}
        </div>
    );
};

export default VideoGrid;
