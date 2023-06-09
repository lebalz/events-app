# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```


#### Environment

Copy the `example.env` file to `.env` and fill in the values.

```bash
cp example.env .env
```

### Local Development

```
$ yarn run start
```

#### upgrade Docusaurus

```bash
yarn upgrade @docusaurus/core@latest @docusaurus/preset-classic@latest @docusaurus/module-type-aliases@latest @docusaurus/types@latest @tsconfig/docusaurus@latest
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

#### Use unauthorized backend (e.g. when developping offline)

Set the env variables `TEST_USERNAME` to a valid (existing!) user email.

or you could too provide the variable as direct arguments to the start script:

```bash
TEST_USERNAME="Reto.Holz@gbsl.ch" yarn run start
```

and make sure, that the user `Reto.Holz@gbsl.ch` exists on your local api.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
