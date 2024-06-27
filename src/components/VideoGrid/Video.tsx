import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';

interface Props {
    src: string,
    title: string,
    autoplay?: boolean,
    href?: string,
}

const Video = observer((props: Props) => {
    const ref = React.useRef<HTMLVideoElement>(null);
    React.useEffect(() => {
        if (ref.current) {
            ref.current.playbackRate = 0.5;
        }
    }, [ref]);
    return (
        <div className={clsx(styles.video, 'card')}>
            <div className="card__image">
                <video
                    autoPlay={props.autoplay}
                    controls
                    muted
                    loop
                    ref={ref}
                    style={{ width: '100%', height: '100%', maxHeight: '1200px' }}
                >
                    <source src={useBaseUrl(props.src)} type="video/mp4" />
                </video>
            </div>
            
            <div className="card__footer">
                {
                    props.href ? (
                        <Link
                            className="button button--primary button--block"
                            to={useBaseUrl(props.href)}
                        >
                            {props.title}
                        </Link>
                    ) : (
                        <h3>
                            {props.title}
                        </h3>
                    )
                }
            </div>
        </div>
    );
});

export default Video;
