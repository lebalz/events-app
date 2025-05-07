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
export interface Props {
    src: string;
    title?: string;
    autoplay?: boolean;
    href?: string;
    playbackRate?: number;
    loop?: boolean;
    steps?: Step[];
    maxWidth?: number | string;
    maxHeight?: number | string;
    style?: React.CSSProperties;
}

const Video = observer((props: Props) => {
    const ref = React.useRef<HTMLVideoElement>(null);
    const [isHover, setIsHover] = React.useState(false);
    const vidSrc = useBaseUrl(props.src);
    const href = useBaseUrl(props.href);
    const hasFooter = props.href || props.title || props.steps;
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
        <div className={clsx(styles.video, 'card', !hasFooter && styles.noFooter)} style={props.style}>
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
                    style={{
                        width: '100%',
                        height: '100%',
                        maxHeight: props.maxHeight ?? '1200px',
                        maxWidth: props.maxWidth
                    }}
                >
                    <source src={vidSrc} type="video/mp4" />
                </video>
            </div>
            {hasFooter && (
                <div className="card__footer">
                    {props.href ? (
                        <Link className="button button--primary button--block" to={href}>
                            {props.title || href}
                        </Link>
                    ) : (
                        <>{props.title && <h3>{props.title}</h3>}</>
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
            )}
        </div>
    );
});

export default Video;
