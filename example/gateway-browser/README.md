# Gateway Browser - simple-react-app

## What is this
This is a base project sourced from [simple-reach-app](https://github.com/Kornil/simple-react-app) and intended to show case the integration
of [lightstreams-js-sdk](https://github.com/lightstreams-network/lightstreams-js-sdk) in a browser application.

**This is till in a very early stage of development and only includes the usage of gateway.storage.add()**


## How to install
You can use both npm or yarn, the version I used to create this project are:

```
$ node -v ; npm -v ; yarn -v
v8.8.1
5.4.2
1.2.1
```
If you just freshly installed yarn/npm you are good to go, else you might need to upgrade, for npm I use `n`

```
npm install -g n
```

## How to use

To start dev server with hot reload, it's live on localhost:3000
```
npm run start:dev
```

To build prod bundle, it includes both treeshaking and uglify to optimize the code as much as possible.
```
npm run build
```

## Project structure

The boilerplate structure and files are the same as this repo minus the *bin* folder, everything else is exactly the same.

```
*gateway-browser*
|
├── */src/*
│   ├── */assets/* where images and stuff are stored
│   ├── */containers/* react-router jsx pages
│   ├── *App.jsx* main layout
│   ├── *Routes.jsx* front-end routes
│   ├── *index.html* entry point
│   ├── *index.jsx* javascript entry point
│   ├── *style.scss* styling
│   └── */tests/* contains test environment (Jest + Enzyme)
│       ├── */__mock__/* contains setup to provide a valid path for imports
│       ├── */_tests__/* the actual tests
│       └── *setup.js* setup for enzyme for react 16
├── *package.json* the whole package.json with every dependency and script, nothing is kept hidden
├── *.eslintrc* eslint config
├── *.babelrc* babel config (polyfills)
├── *webpack.config.js* webpack config, it has a dev and prod environment
└── *README.md* this file
```

## Eslint

This project uses AirBnB Javascript specs so you can write error-free react and javasctipt code, if you use Visual Studio Code, you can install eslint from the extension tab to activate this function, other editors just google _name of the editor + eslint_ you will find how to enable it for your editor.

