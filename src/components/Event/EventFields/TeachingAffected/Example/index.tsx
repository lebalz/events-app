import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { Props, TeachingAffectedColors } from '..';
import Translate, { translate } from '@docusaurus/Translate';
import { TeachingAffected } from '@site/src/api/event';
import { Stack } from '@mdi/react';
import {
    mdiArrowRight,
    mdiCalendarBlankOutline,
    mdiCircle,
    mdiCircleSmall,
    mdiInformationVariantCircle
} from '@mdi/js';
import { ArrowLeft, ArrowRight, Icon, SIZE_S, SIZE_XS, SIZE_XXS } from '@site/src/components/shared/icons';
import DefinitionList from '@site/src/components/shared/DefinitionList';
import Tooltip from '@site/src/components/shared/Tooltip';
import Button from '@site/src/components/shared/Button';
import Badge from '@site/src/components/shared/Badge';
import LabeledBox from '@site/src/components/shared/LabeledBox';
import { StorageKey } from '@site/src/stores/utils/Storage';
import { action } from 'mobx';

interface Example {
    example: string;
    description: string;
}

export const ExampleMap: { [key in TeachingAffected]: Example[] } = {
    [TeachingAffected.NO]: [
        {
            example: translate({
                message: 'Noteneingabe in Evento.',
                id: 'teachingAffected.no.example.1'
            }),
            description: translate({
                message: 'Dieser Termin betrifft den Regelunterricht nicht.',
                id: 'teachingAffected.no.example.description.1'
            })
        },
        {
            example: translate({
                message: 'Termin: Abgabe Sonderwochenprogramm',
                id: 'teachingAffected.no.example.2'
            }),
            description: translate({
                message: 'Der Unterricht findet normal statt.',
                id: 'teachingAffected.no.example.description.2'
            })
        }
    ],
    [TeachingAffected.PARTIAL]: [
        {
            example: translate({
                message: 'Exkursion im EF-IN.',
                id: 'teachingAffected.partial.example.1'
            }),
            description: translate({
                message: 'Der Regelunterricht findet normal statt, die EF-IN Schüler:innen fehlen aber.',
                id: 'teachingAffected.partial.example.description.1'
            })
        },
        {
            example: translate({
                message: 'Orchesterprobe.',
                id: 'teachingAffected.partial.example.2'
            }),
            description: translate({
                message:
                    'Der Regelunterricht findet normal statt, die mitwirkenden Schüler:innen 🎻🎵🎸 einer Klasse fehlen aber.',
                id: 'teachingAffected.partial.example.description.2'
            })
        },
        {
            example: translate({
                message: 'GYM4: Besuchstag ETH.',
                id: 'teachingAffected.partial.example.3'
            }),
            description: translate({
                message:
                    'Der Regelunterricht findet normal statt, die am Besuchstag angemeldeten Schüler:iunnen fehlen aber.',
                id: 'teachingAffected.partial.example.description.3'
            })
        }
    ],
    [TeachingAffected.YES]: [
        {
            example: translate({
                message: 'Exkursion mit der Klasse 28Gj',
                id: 'teachingAffected.yes.example.1'
            }),
            description: translate({
                message: 'Der Regelunterricht fällt aus - die Klasse ist nicht da.',
                id: 'teachingAffected.yes.example.description.1'
            })
        },
        {
            example: translate({
                message: 'Klassenstunde: Zeugnisse',
                id: 'teachingAffected.yes.example.2'
            }),
            description: translate({
                message:
                    'Der Regelunterricht fällt aus - die Klasse hat zur gegebenen Zeit ein Spezialprogramm.',
                id: 'teachingAffected.yes.example.description.2'
            })
        }
    ]
};

const Example = observer((props: Props) => {
    const { event } = props;
    const viewStore = useStore('viewStore');
    const exampleSize = React.useMemo(() => {
        return ExampleMap[event.teachingAffected].length;
    }, [event.teachingAffected]);
    const [_idx, setIdx] = React.useState(0);
    const idx = React.useMemo(() => {
        return _idx % exampleSize;
    }, [_idx, exampleSize]);
    return (
        <div className={clsx(styles.container)}>
            <LabeledBox
                color="blue"
                label={translate({ message: 'Beispiel', id: 'teachingAffected.exampleBox.label' })}
                actions={
                    exampleSize > 1 ? (
                        <div className={clsx(styles.selector)}>
                            <Button
                                icon={<ArrowLeft size={SIZE_XS} />}
                                noOutline
                                className={clsx('badge', styles.button)}
                                onClick={() => setIdx((curr) => (curr < 1 ? exampleSize - 1 : curr - 1))}
                            />
                            <Badge
                                text={`${idx + 1} / ${exampleSize}`}
                                title={translate(
                                    {
                                        message: 'Beispiel {nr} von {total}',
                                        id: 'teachingAffected.example.nr'
                                    },
                                    { nr: idx + 1, total: exampleSize }
                                )}
                            />
                            <Button
                                icon={<ArrowRight size={SIZE_XS} />}
                                noOutline
                                className={clsx('badge', styles.button)}
                                onClick={() => setIdx((curr) => curr + 1)}
                            />
                        </div>
                    ) : undefined
                }
                showContent={viewStore.userSettings.showTeachingAffectedExample}
                onChangeVisibility={action((val) =>
                    viewStore.userSettings.setShowTeachingAffectedExample(val)
                )}
            >
                <DefinitionList gridTemplateColumns="2em minmax(4em, 1fr)" className={clsx(styles.example)}>
                    <dt>
                        <span className={clsx(styles.stacked, styles.icon)}>
                            <Tooltip
                                title={translate({
                                    message: 'Terminbeispiel',
                                    id: 'teachingAffected.example.tooltip'
                                })}
                            >
                                <Icon path={mdiCalendarBlankOutline} size={SIZE_S} />
                            </Tooltip>
                            <Icon
                                path={mdiCircle}
                                color={TeachingAffectedColors[event.teachingAffected]}
                                size={SIZE_XXS}
                                className={clsx(styles.bottomRight)}
                            />
                        </span>
                    </dt>
                    <dd className={clsx(styles.scenario)}>
                        {ExampleMap[event.teachingAffected][idx].example}
                    </dd>
                    <dt>
                        <Icon
                            path={mdiInformationVariantCircle}
                            color="blue"
                            size={SIZE_S}
                            className={clsx(styles.icon)}
                        />
                    </dt>
                    <dd className={clsx(styles.description)}>
                        {ExampleMap[event.teachingAffected][idx].description}
                    </dd>
                </DefinitionList>
            </LabeledBox>
        </div>
    );
});

export default Example;
