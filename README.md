[![NPM version](https://badge.fury.io/js/%40dizmo%2Ffunctions-lock.svg)](https://npmjs.org/package/@dizmo/functions-lock)
[![Build Status](https://travis-ci.com/dizmo/functions-lock.svg?branch=master)](https://travis-ci.com/dizmo/functions-lock)
[![Coverage Status](https://coveralls.io/repos/github/dizmo/functions-lock/badge.svg?branch=master)](https://coveralls.io/github/dizmo/functions-lock?branch=master)

# @dizmo/functions-lock

Provides a `Lock` class, which can be used to acquire and release (enumerated) locks &ndash; where each lock can also be anonymous or named.

Per lock an internal *identity context* is associated, where the corresponding data is stored as an (`ephemeral-id`, `session-id`) tuple. The `ephemeral-id` is stored in the `global` (aka the `window`) object, and the `session-id` in the `localStorage` &ndash; if available, otherwise again the `global` object is used.

> Locks with the same name share the same identity, but each lock number is treated separately.

A lock will *always* permit to be acquired, if the identity context is the same! However, this behaviour can be overridden by providing a flag to *clear* the internal identity (of a named lock), which will cause the lock to *not* be acquired &ndash; if another lock with the same name as already been acquired.

Upon a successful acquisition a positive number (larger than `0`) will be returned, which indicates the amount of time (in milliseconds) it took to acquire the lock; a failure to acquire it will result in a `null` object. Upon a successful release a `true` value will be returned (else the result will be `false`).

## Usage

### Installation

```sh
npm install @dizmo/functions-lock --save
```

### Require

```typescript
import { Lock } from '@dizmo/functions-lock';
```

### Example(s)

#### Acquire and release lock
```typescript
const lock = new Lock();
if (await lock.acquire()) {
    if (await lock.release()) {
        console.debug('lock acquired and released');
    } else {
        console.debug('lock acquired but *not* released');
    }
} else {
    console.debug('lock *not* acquired');
}
```

#### Acquire and release lock at index=0 (default) with no expiration (default)
```typescript
const lock = new Lock();
if (await lock.acquire(0)) {
    if (await lock.release(0)) {
        console.debug('lock acquired @index=0 and released');
    } else {
        console.debug('lock acquired @index=0 but *not* released');
    }
} else {
    console.debug('lock @index=0 *not* acquired');
}
```

#### Acquire and release lock at index=0 (default) with an expiration of one minute
```typescript
const lock = new Lock(), expiry_ms = 60 * 1000; // one minute
if (await lock.acquire(0, expiry_ms)) {
    if (await lock.release(0)) {
        console.debug('lock acquired and released');
    } else {
        console.debug('lock acquired but *not* released');
    }
} else {
    console.debug('lock *not* acquired');
}
```

#### Acquire and release named lock at index=1
```typescript
const lock = new Lock('my-lock');
if (await lock.acquire(1)) {
    if (await lock.release(1)) {
        console.debug('named lock @index=1 acquired and released');
    } else {
        console.debug('named lock @index=1 acquired but *not* released');
    }
} else {
    console.debug('named lock @index=1 *not* acquired');
}
```

#### Acquire (twice) and release named lock at index=2
```typescript
const lock = new Lock('my-lock');
if (await lock.acquire(2)) {
    if (await lock.acquire(2)) {
        if (await lock.release(2)) {
            console.debug('named lock @index=2 acquired and released');
        } else {
            console.debug('named lock @index=2 acquired but *not* released');
        }
    } else {
        console.debug('named lock @index=2 *not* acquired (2nd time)');
    }
} else {
    console.debug('named lock @index=2 *not* acquired (1st time)');
}
```

#### Acquire (twice) and release named lock at index=2 with ID clearing
```typescript
const lock = new Lock('my-lock', true); // clear ID i.e. "fake" another context!
if (await lock.acquire(2)) {
    if (await lock.acquire(2)) {
        if (await lock.release(2)) {
            console.debug('named lock @index=2 acquired and released');
        } else {
            console.debug('named lock @index=2 acquired but *not* released');
        }
    } else {
        console.debug('named lock @index=2 *not* acquired (2nd time)');
    }
} else {
    console.debug('named lock @index=2 *not* acquired (1st time)');
}
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
