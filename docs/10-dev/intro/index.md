---
sidebar_position: 2
---

# Events App

## Technology Stack

![](images/events-app-architecture.svg#gh-light-mode-only)![](images/events-app-architecture-dark.svg#gh-dark-mode-only)

### Client Side

- [Docusaurus](https://docusaurus.io/) - a modern Documentation Framework
- [React](https://react.dev/) a library to create interfaces and components
- [TypeScript](https://www.typescriptlang.org/) - a typing system for type-safety
- [MobX](https://mobx.js.org/README.html) a state management library. Stores keep data and it's modification and ensures, the client is updated.
- [Axios](https://axios-http.com/docs/intro) HTTP Client for Browsers


### Server Side
- [Node JS](https://nodejs.org/) JavaScript runtime
- [TypeScript](https://www.typescriptlang.org/) - a typing system for type-safety
- [Express JS](https://expressjs.com/) Fast, lightweight web framework for Node JS
- [Prisma JS](https://www.prisma.io/) a modern ORM to access database records in a typesafe manner.


### Client Server Communication Protocols
- HTTP Protocol for API calls to the server
- Websockets (through [SocketIO](https://socket.io/)) for a permanent connection between the server and the client. Ensures all connected clients are kept synced.


### Data
All data is stored in a relational database - PSQL is used.


### External Services
The webuntis data from the school is synced for each semester. This includes
- Departments
- Teachers
- Classes
- Lectures

Like that it's possible to match events to coresponding classes and teachers.
