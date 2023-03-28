import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import {default as LessonModel} from '@site/src/models/Untis/Lesson'; 
import Badge from '../shared/Badge';
import { Clock } from '../shared/icons';


interface Props {
    lesson: LessonModel;
}

const Lesson = observer((props: Props) => {
    const {lesson} = props;
    const userStore = useStore('userStore');
    const {current} = userStore;
    return (
        <div className={clsx('card', styles.card)}>
            <div className={clsx('card__body', styles.lesson)}>
                <Badge text={lesson.subject} className={clsx(styles.subject)}/>
                {lesson.teachers.map((teacher, idx) => (
                    <Badge key={teacher.id} text={teacher.name} className={clsx(styles.teacher)} color={teacher.name === current.shortName ? 'primary' : undefined} />
                ))}
                <Badge 
                text={`${lesson.fStart} - ${lesson.fEnd}`} 
                icon={<Clock hour={lesson.start.getHours()} color="blue" />} 
                iconSide="left" 
                className={clsx(styles.duration)}
                />
                <Badge text={lesson.day} className={clsx(styles.day)}/>
                
            </div>
        </div>
    )
});

export default Lesson;