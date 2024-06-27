---
sidebar_position: 1
---
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import VideoGrid from '@site/src/components/VideoGrid';

# Terminplan

Dokumentation, Anleitungen und Hilfestellungen für die Nutzung des Terminplans.

## Schnellüberblick

```mdx-code-block
<VideoGrid
  videos={[
    {src: '/videos/Events-Anmelden.mp4', title: 'Anmelden'},
    {src: '/videos/Events-Filtern.mp4', title: 'Filtern'},
    {src: '/videos/Events-Abonnieren.mp4', title: 'Abonnieren', href: 'docs/events/subscribe'},
    {src: '/videos/events-ruttl-de.mp4', title: 'Feedback'},
  ]}
/>
```

<ThemedImage
  alt="Terminplan Logo"
  width="400px"
  style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block'}}
  sources={{
    light: useBaseUrl('/img/logo-light.svg'),
    dark: useBaseUrl('/img/logo-dark.svg'),
  }}
/>