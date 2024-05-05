/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {} from 'react';
import clsx from 'clsx';
import Color from 'color';
import Translate, { translate } from '@docusaurus/Translate';
import {useColorMode} from '@docusaurus/theme-common';
import CodeBlock from '@theme/CodeBlock';
import Details from '@theme/Details';

import {
  getAdjustedColors,
} from './colorUtils';
import styles from './styles.module.css';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import Button from '../shared/Button';
import { mdiMoonWaningCrescent, mdiRestore, mdiWhiteBalanceSunny } from '@mdi/js';

function wcagContrast(foreground: string, background: string) {
  const contrast = Color(foreground).contrast(Color(background));
  // eslint-disable-next-line no-nested-ternary
  return contrast > 7 ? 'AAA 🏅' : contrast > 4.5 ? 'AA 👍' : 'Fail 🔴';
}

const ColorGenerator = observer(() => {
  const {colorMode, setColorMode} = useColorMode();
  const viewStore = useStore('viewStore');
  const { colors } = viewStore;

  return (
    <div>
      <div className={styles.actions}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="primary_color">
          <strong className="margin-right--sm">
            <Translate id="colorGenerator.inputs.primary.label">
              Hauptfarbe
            </Translate>
          </strong>
        </label>{' '}
        <input
          type="color"
          className={styles.colorInput}
          // value has to always be a valid color, so baseColor instead of
          // inputColor
          value={colors.data[colorMode].colors.primary}
          onChange={(e) => colors.setColor('primary', e.target.value, colorMode)}
        />
        <div className={styles.spacer} />
        <Button
          icon={colorMode === 'dark' ? mdiMoonWaningCrescent : mdiWhiteBalanceSunny}
          iconSide='left'
          onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}
          text={
            translate({
              id: 'colorGenerator.inputs.modeToggle.label',
              message: '{colorMode} Modus',
              description: 'The label for the button that toggles color mode',
            }, {
              colorMode: colorMode === 'dark'
                ? translate({id: 'colorGenerator.inputs.modeToggle.label.colorMode.light', message: 'heller'})
                : translate({id: 'colorGenerator.inputs.modeToggle.label.colorMode.dark', message: 'dunkler'})
            })
          }
        />
        <Button
          icon={mdiRestore}
          iconSide='left'
          onClick={() => colors.reset(colorMode)}
          text={
            translate({
              id: 'colorGenerator.inputs.resetButton.label',
              message: 'Reset',
            })
          }
        />
      </div>
      {/* <p>
        <label htmlFor="background_color">
          <strong className="margin-right--sm">
            <Translate id="colorGenerator.inputs.background.label">
              Hintergrund:
            </Translate>
          </strong>
        </label>
        <input
          id="background_color"
          type="color"
          className={clsx(styles.colorInput, 'margin-right--sm')}
          value={colors.data[colorMode].colors.background}
          onChange={(e) => colors.setColor('background' ,e.target.value, colorMode)}
        />
      </p>
      <p>
        <label htmlFor="background_surface_color">
          <strong className="margin-right--sm">
            <Translate id="colorGenerator.inputs.navBarBackground.label">
              Navigationsleiste:
            </Translate>
          </strong>
        </label>
        <input
          id="background_surface_color"
          type="color"
          className={clsx(styles.colorInput, 'margin-right--sm')}
          value={colors.data[colorMode].colors.navBarBackground}
          onChange={(e) => colors.setColor('navBarBackground' ,e.target.value, colorMode)}
        />
      </p>
      */}
      <div>
        <table className={styles.colorTable}>
          <thead>
            <tr>
             <th>
                <Translate
                  id="colorGenerator.table.heading2"
                  description="This column is the color's representation in hex">
                  Farbe
                </Translate>
              </th>
              <th>
                <Translate
                  id="colorGenerator.table.heading3"
                  description="This column is the adjusted shades' adjustment values relative to the primary color">
                  Justierung
                </Translate>
              </th>
              <th>
                <Translate
                  id="colorGenerator.table.heading4"
                  description="This column is WCAG contrast rating: AAA, AA, Fail">
                  Kontrast Bewertung
                </Translate>
              </th>
            </tr>
          </thead>
          <tbody>
            {getAdjustedColors(colors.data[colorMode].shades, colors.data[colorMode].colors.primary)
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((value) => {
                const {variableName, adjustment, adjustmentInput, hex} = value;
                return (
                  <tr key={variableName}>
                    <td>
                      <span
                        className={styles.color}
                        style={{
                          backgroundColor: hex,
                        }}
                      />
                      <code className="margin-left--sm">
                        {hex.toLowerCase()}
                      </code>
                    </td>
                    <td>
                      {variableName === '--ifm-color-primary' ? (
                        0
                      ) : (
                        <input
                          aria-label={`${variableName} CSS variable name`}
                          className={styles.input}
                          type="number"
                          value={adjustmentInput}
                          onChange={(event) => {
                            const newValue = parseFloat(event.target.value);
                            colors.setShades({
                              ...colors.data[colorMode].shades,
                              [variableName]: {
                                ...colors.data[colorMode].shades[variableName]!,
                                adjustmentInput: event.target.value,
                                adjustment: Number.isNaN(newValue)
                                  ? adjustment
                                  : newValue / 100.0,
                              },
                            }, colorMode);
                          }}
                        />
                      )}
                    </td>
                    <td
                      style={{
                        fontSize: 'medium',
                        backgroundColor: colors.data[colorMode].colors.background,
                        color: hex,
                      }}>
                      <b>{wcagContrast(hex, colors.data[colorMode].colors.background)}</b>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Details
        summary={translate({id: 'colorGenerator.codeBlock.summary', message: 'Farben-Code anzeigen'})}
        style={{maxWidth: '100%'}}
      >
          <Translate id="colorGenerator.codeBlock.Description">
            Farbvorschläge für die Hauptfarben, zum Senden an den Entwickler...
          </Translate>
          <CodeBlock className="language-css">
            {`${colorMode === 'dark' ? "[data-theme='dark']" : ':root'} {\n${getAdjustedColors(colors.data[colorMode].shades, colors.data[colorMode].colors.primary)
      .sort((a, b) => a.codeOrder - b.codeOrder)
      .map((value) => `    ${value.variableName}: ${value.hex.toLowerCase()};`)
      .join('\n')}\n}`}
          </CodeBlock>
      </Details>
    </div>
  );
});

export default ColorGenerator