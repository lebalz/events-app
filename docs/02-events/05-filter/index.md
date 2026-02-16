import Video from '@site/src/components/VideoGrid/Video';

# Termine Filtern

Termine lassen sich nach verschiedenen Kriterien filtern. So können beispielsweise nur Termine einer bestimmten Klasse oder Abteilung angezeigt werden.

:::info[Standardfilter]
Standardmässig wird nach Abteilungen gefiltert, in welchen man Klassen unterrichtet.
:::

{/**<Video
    src="/videos/events-ruttl-de.mp4"
    title="Rückmeldung geben"
    autoplay
/> */}

## Filteroptionen

Textsuche
: Es wird in allen verfügbaren Feldern nach einer Übereinstimmung mit dem eingegebenen Text gesucht.
: (z.B. "Sporttag", "25h", "27.06.2024")
Meine
: Ist dieser Filter aktiv, werden nur Termine angezeigt, die für mich relevant sind.
: Als Klassenlehrperson werden auch die für die eigene Klasse relevanten Termine angezeigt.
Abteilung
: Es werden nur für diese Abteilung relevante Termine angezeigt.
Klasse
: Es werden nur für diese Klasse relevante Termine angezeigt.
: Es können auch Platzhalter wie `28G*` verwendet werden, um alle Klassen anzuzeigen, die mit "28G" beginnen.
Während meinen Unterrichtslektionen
: Es werden nur Termine angezeigt, die während der Unterrichtslektionen stattfinden.
Unterricht betroffen?
: Es werden nur Termine angezeigt, die den Unterricht __ganz__/__teilweise__/__nicht__ betreffen.
: ⚠️ Eingebende LP's entscheiden, ob ein Termin den Unterricht betrifft oder nicht - die Filterung ist nur so gut wie die Angaben der LP's.
Betroffene Tage
: Es werden nur Termine angezeigt, die an diesen Tagen stattfinden.
: Termine, die über mehrere Tage gehen, werden angezeigt, wenn sie an mindestens einem der ausgewählten Tage stattfinden.
Startdatum
: Es werden nur Termine ab diesem Datum angezeigt.
Enddatum
: Es werden nur Termine bis zu diesem Datum angezeigt.