# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn install
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

## Translations

The translations can be found in the `i18n` folder. The `de` folder contains the german (default) translations. The `fr` folder contains the french translations.
Update the translations with:

```bash
# for german
yarn write-translations --locale de
# for french
yarn write-translations --locale fr
```

existing translations will not be overwritten, except you pass the `--overwrite` flag.

After updating the translations, make sure to update the new keys (you can see in git, which keys are new...)

To start docusaurus with the new translations in e.g. french, run:

```bash
yarn run start --locale fr
```

Checkout [Docusaurus](https://docusaurus.io/docs/i18n/tutorial) for further information.

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
