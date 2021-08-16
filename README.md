[![NPM version](https://badge.fury.io/js/%40dizmo%2Ffunctions-lock.svg)](https://npmjs.org/package/@dizmo/functions-lock)
[![Build Status](https://travis-ci.com/dizmo/functions-lock.svg?branch=master)](https://travis-ci.com/dizmo/functions-lock)
[![Coverage Status](https://coveralls.io/repos/github/dizmo/functions-lock/badge.svg?branch=master)](https://coveralls.io/github/dizmo/functions-lock?branch=master)

# @dizmo/functions-lock

Module.

## Usage

### Installation

```sh
npm install @dizmo/functions-lock --save
```

### Require

```javascript
import '@dizmo/functions-lock';
```

### Example(s)

```javascript
...
```

## Development

### Clean

```sh
npm run clean
```

### Build

```sh
npm run build
```

#### without linting and cleaning:

```sh
npm run -- build --no-lint --no-clean
```

#### with UMD bundling (incl. minimization):

```sh
npm run -- build --prepack
```

#### with UMD bundling (excl. minimization):

```sh
npm run -- build --prepack --no-minify
```

### Lint

```sh
npm run lint
```

#### with auto-fixing:

```sh
npm run -- lint --fix
```

### Test

```sh
npm run test
```

#### without linting, cleaning and (re-)building:

```sh
npm run -- test --no-lint --no-clean --no-build
```

### Cover

```sh
npm run cover
```

#### without linting, cleaning and (re-)building:

```sh
npm run -- cover --no-lint --no-clean --no-build
```

## Debugging

Connect `@dizmo/functions-lock` to another project:

```sh
[@dizmo/functions-lock] $ npm link # symlink global:@dizmo/functions-lock
```

```sh
[a-project] $ npm link @dizmo/functions-lock # symlink node-modules:@dizmo/functions-lock
```

```sh
[a-project] $ head webpack.config.js # ensure @dizmo/functions-lock in entry.main
```

```
entry: {
    main: [..., '@dizmo/functions-lock', './source/index.js']
}
```

Disconnect `@dizmo/functions-lock` from the project:

```sh
[a-project] $ npm unlink @dizmo/functions-lock # delete local symlink
```

```sh
[@dizmo/functions-lock] $ npm uninstall -g # delete global symlink
```

## Documentation

```sh
npm run docs
```

## Publication

```sh
npm publish
```

#### initially (if public):

```sh
npm publish --access=public
```

## Copyright

 © 2021 [dizmo AG](https://dizmo.com/), Switzerland
