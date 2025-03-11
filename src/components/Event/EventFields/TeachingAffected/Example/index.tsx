import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { Props, TeachingAffectedColors } from '..';
import { translate } from '@docusaurus/Translate';
import { TeachingAffected } from '@site/src/api/event';
import { Stack } from '@mdi/react';
import {
    mdiArrowRight,
    mdiCalendarBlankOutline,
    mdiCircle,
    mdiCircleSmall,
    mdiInformationVariantCircle
} from '@mdi/js';
import { Icon, SIZE_S, SIZE_XS, SIZE_XXS } from '@site/src/components/shared/icons';
import DefinitionList from '@site/src/components/shared/DefinitionList';

interface Example {
    example: string;
    description: string;
    hint?: string;
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
            }),
            hint: translate({
                message: 'Proben sollten nicht geplant werden, da nicht die ganze Klasse anwesend ist.',
                id: 'teachingAffected.partial.example.hint.1'
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
            }),
            hint: translate({
                message: 'Proben sollten nicht geplant werden, da nicht die ganze Klasse anwesend ist.',
                id: 'teachingAffected.partial.example.hint.1'
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
            }),
            hint: translate({
                message: 'Proben sollten nicht geplant werden, da nicht die ganze Klasse anwesend ist.',
                id: 'teachingAffected.partial.example.hint.1'
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
    return (
        <DefinitionList gridTemplateColumns="2em minmax(4em, 1fr)" className={clsx(styles.example)}>
            <dt>
                <span className={clsx(styles.stacked, styles.icon)}>
                    <Icon path={mdiCalendarBlankOutline} size={SIZE_S} color="black" />
                    <Icon
                        path={mdiCircle}
                        color={TeachingAffectedColors[event.teachingAffected]}
                        size={SIZE_XXS}
                        className={clsx(styles.bottomRight)}
                    />
                </span>
            </dt>
            <dd className={clsx(styles.scenario)}>{ExampleMap[event.teachingAffected][0].example}</dd>
            <dt>
                <Icon path={mdiArrowRight} size={SIZE_S} className={clsx(styles.icon)} />
            </dt>
            <dd className={clsx(styles.description)}>{ExampleMap[event.teachingAffected][0].description}</dd>
            {ExampleMap[event.teachingAffected][0].hint && (
                <>
                    <dt>
                        <Icon
                            path={mdiInformationVariantCircle}
                            color="blue"
                            size={SIZE_S}
                            className={clsx(styles.icon)}
                        />
                    </dt>
                    <dd className={clsx(styles.hint)}>{ExampleMap[event.teachingAffected][0].hint}</dd>
                </>
            )}
        </DefinitionList>
    );
});

export default Example;
