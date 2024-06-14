# WebUntis

![Webuntis](images/webuntis-db-light.svg#gh-light-mode-only)![Webuntis](images/webuntis-db-dark.svg#gh-dark-mode-only)

The library [👉 webuntis](https://www.npmjs.com/package/webuntis) is used to interface the public API of WebUntis. This [class diagram](#webuntis-api-class-diagram) shows the fields of the raw data gathered from the API.

We want to extract the lessons, it's classes and teachers. Therefore some **assumptions** are made:
- The timetable is the same for every week of a semester
  - The first schoolweek after the fall break (Herbstferien) is used as the reference for the 1. Semesert
  - The first schoolweek after spring break (Frühlingsferien) is used as the reference for the 2. Semester
- The data is syncronized for 3 semesters: the last, the current and the next semester. When no data is available, the semester is ignored.
- The teachers are synced to the database with the original `id` and the according `shortName` from the API. In case the `shortName` changes (e.g. marriage), it will be updated automatically on the next sync.

## WebUntis API: Class Diagram

![Webuntis](images/classdiagram-light.png#gh-light-mode-only)![Webuntis](images/classdiagram-dark.png#gh-dark-mode-only)
