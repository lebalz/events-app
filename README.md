# Website

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

### Installation

```bash
yarn install
```

#### Environment

Copy the `example.env` file to `.env` and fill in the values.

```bash
cp example.env .env
```

| Variable               | For         | Default                 | Example                                | Description                                                                                                                        |
|:-----------------------|:------------|:------------------------|:---------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------|
| REACT_APP_DOMAIN       | Production  | `http://localhost:3000` |                                        | Domain of the hosted app                                                                                                           |
| REACT_APP_EVENTS_API   | Production  | `http://localhost:3002` |                                        | Url of the API Endpoint                                                                                                            |
| REACT_APP_CLIENT_ID    | Production  |                         |                                        | Azure ID: Client ID                                                                                                                |
| REACT_APP_TENANT_ID    | Production  |                         |                                        | Azure AD: Tenant Id                                                                                                                |
| REACT_APP_API_URI      | Production  |                         |                                        | Azure AD: API Url                                                                                                                  |
| REACT_APP_UMAMI_ID     | Production  |                         |                                        | For user stats                                                                                                                     |
| CROWDIN_PERSONAL_TOKEN | Production  |                         |                                        | Used to download translations during build step. (Not used currently)                                                              |
| TEST_USERNAME          | Development |                         | `admin.bar@bazz.ch`                    | To log in offline. Must be the same as `ADMIN_EMAIL` or `USER_EMAIL` in [👉 Dev-Backend](https://github.com/lebalz/events-api#env) |

### Local Development

```
$ yarn run start
```

#### First time

1. Edit the `.env` file and fill in at least the the values that are relevant for development (see above).
2. Make sure you have Node Version `>=22.12.0` installed. With `nvm` you can
   - check your version with `nvm version`
   - install a new version with `nvm install --default v22.12.0` 
   - and then switch to the correct version with `nvm use v22.12.0` (or restart your computer/login shell).
3. Run
```bash
yarn install
yarn run start
```
This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

If you have troubles with npm or yarn, try to delete the `node_modules` folder and run `yarn install` again.


#### Use unauthorized backend (e.g. when developping offline)

Set the env variables `TEST_USERNAME` to a valid (existing!) user email.

or you could too provide the variable as direct arguments to the start script:

```bash
TEST_USERNAME="Reto.Holz@gbsl.ch" yarn run start
```

and make sure, that the user `Reto.Holz@gbsl.ch` exists on your local api.

#### Format Codebase

Prettier is used to format the codebase. To format the codebase run:

```bash
yarn run format
```

This will format all files in the `src` folder and the files in the root folder, which are not excluded in the `.prettierignore` file.

To check if all files are formatted correctly, run:

```bash
yarn run format:check
```

## Translations

The translations can be found in the `i18n` folder. The `de` folder contains the german (default) translations. The `fr` folder contains the french translations.
Update the translations with:

```bash
# for german
yarn write-translations --locale de
# for german override existing translations
yarn write-translations --locale de --override
# for french
yarn write-translations --locale fr
```

existing translations will not be overwritten, except you pass the `--override` flag.

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

### Update Docusaurus

```bash
yarn upgrade @docusaurus/core@latest @docusaurus/faster@latest @docusaurus/plugin-pwa@latest @docusaurus/preset-classic@latest @docusaurus/module-type-aliases@latest @docusaurus/tsconfig@latest @docusaurus/types@latest @docusaurus/theme-mermaid@latest
```