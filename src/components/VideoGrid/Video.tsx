import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import Badge from '../shared/Badge';
import { formatSeconds } from '@site/src/models/helpers/time';
interface Step {
    time: number;
    label: string;
    indentLevel?: number;
}
interface Props {
    src: string;
    title: string;
    autoplay?: boolean;
    href?: string;
    playbackRate?: number;
    loop?: boolean;
    steps?: Step[];
    maxWidth?: number;
    style?: React.CSSProperties;
}

const Video = observer((props: Props) => {
    const ref = React.useRef<HTMLVideoElement>(null);
    const [isHover, setIsHover] = React.useState(false);
    React.useEffect(() => {
        if (ref.current) {
            ref.current.playbackRate = props.playbackRate || 1;
        }
    }, [ref]);
    const handleStepClick = (time: number) => {
        if (ref.current) {
            ref.current.currentTime = time;
            ref.current.pause();
        }
    };
    return (
        <div className={clsx(styles.video, 'card')} style={props.style}>
            <div
                className="card__image"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <video
                    autoPlay={props.autoplay}
                    controls={isHover}
                    muted
                    loop={props.loop}
                    ref={ref}
                    style={{ width: '100%', height: '100%', maxHeight: '1200px' }}
                >
                    <source src={useBaseUrl(props.src)} type="video/mp4" />
                </video>
            </div>

            <div className="card__footer">
                {props.href ? (
                    <Link className="button button--primary button--block" to={useBaseUrl(props.href)}>
                        {props.title}
                    </Link>
                ) : (
                    <h3>{props.title}</h3>
                )}
                {props.steps && (
                    <ul className={clsx(styles.steps)}>
                        {props.steps.map((step, index) => (
                            <li
                                key={index}
                                onClick={() => handleStepClick(step.time)}
                                className={clsx(styles.step)}
                                style={{
                                    marginLeft: step.indentLevel
                                        ? `${step.indentLevel * 3 || 0}em`
                                        : undefined
                                }}
                            >
                                <Badge color="primary" text={`${formatSeconds(step.time)}`} />
                                {step.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
});

export default Video;
