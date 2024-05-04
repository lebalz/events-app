/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import Color from 'color';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import {useColorMode} from '@docusaurus/theme-common';
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';
import Details from '@theme/Details';

import {
  type ColorState,
  COLOR_SHADES,
  LIGHT_PRIMARY_COLOR,
  DARK_PRIMARY_COLOR,
  LIGHT_BACKGROUND_COLOR,
  DARK_BACKGROUND_COLOR,
  getAdjustedColors,
  lightStorage,
  darkStorage,
  updateDOMColors,
} from './colorUtils';
import styles from './styles.module.css';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';

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
          value={colors.data[colorMode].primary}
          onChange={(e) => colors.setPrimaryColor(e.target.value, colorMode)}
        />
        <button
          type="button"
          className="clean-btn button button--primary margin-left--md"
          onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}>
          <Translate
            id="colorGenerator.inputs.modeToggle.label"
            values={{
              colorMode: colorMode === 'dark' ? (
                <Translate id="colorGenerator.inputs.modeToggle.label.colorMode.light">
                  heller
                </Translate>
              ) : (
                <Translate id="colorGenerator.inputs.modeToggle.label.colorMode.dark">
                  dunkler
                </Translate>
              ),
            }}>
            {'{colorMode} Modus'}
          </Translate>
        </button>
        <button
          type="button"
          className="clean-btn button button--secondary margin-left--md"
          onClick={() => colors.reset(colorMode)}>
          <Translate id="colorGenerator.inputs.resetButton.label">
            Reset
          </Translate>
        </button>
      </div>
      <p>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
          value={colors.data[colorMode].background}
          onChange={(e) => colors.setBackgroundColor(e.target.value, colorMode)}
        />
      </p>
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
            {getAdjustedColors(colors.data[colorMode].shades, colors.data[colorMode].primary)
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
                        backgroundColor: colors.data[colorMode].background,
                        color: hex,
                      }}>
                      <b>{wcagContrast(hex, colors.data[colorMode].background)}</b>
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
          <CodeBlock className="language-css" title="/src/css/custom.css">
            {`${colorMode === 'dark' ? "[data-theme='dark']" : ':root'} {
    ${getAdjustedColors(colors.data[colorMode].shades, colors.data[colorMode].primary)
      .sort((a, b) => a.codeOrder - b.codeOrder)
      .map((value) => `  ${value.variableName}: ${value.hex.toLowerCase()};`)
      .join('\n')}${`\n  --ifm-background-color: ${colors.data[colorMode].background};`}
    }`}
          </CodeBlock>
      </Details>
    </div>
  );
});

export default ColorGenerator