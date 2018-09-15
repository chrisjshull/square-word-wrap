# wrap-words

<!--
... http://shields.io
[![David](https://img.shields.io/david/__PROJECT_GH_USER__/__PROJECT_NAME__.svg)](__PROJECT_GH_URL__)
[![Node.js](https://img.shields.io/node/v/__PROJECT_NAME__.svg)](https://www.npmjs.org/package/__PROJECT_NAME__)
-->

[![Travis](https://img.shields.io/travis/chrisjshull/wrap-words.svg)](https://travis-ci.org/chrisjshull/wrap-words)
[![Codecov](https://img.shields.io/codecov/c/github/chrisjshull/wrap-words.svg)](https://codecov.io/gh/chrisjshull/wrap-words)
[![GitHub issues](https://img.shields.io/github/issues/chrisjshull/wrap-words.svg)](https://github.com/chrisjshull/wrap-words/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/chrisjshull/wrap-words.svg)](https://github.com/chrisjshull/wrap-words/pulls)
[![MIT License](https://img.shields.io/npm/l/wrap-words.svg)](https://github.com/chrisjshull/wrap-words)
[![Version](https://img.shields.io/npm/v/wrap-words.svg?label=version)](https://www.npmjs.org/package/wrap-words)
[![Try on RunKit](https://badge.runkitcdn.com/wrap-words.svg)](https://npm.runkit.com/wrap-words)

`npm install wrap-words`

A word wrapping utility which correctly handles [graphemes](https://github.com/orling/grapheme-splitter) and [ANSI escape codes](https://github.com/chalk/chalk).

`wrap-words` is a little different from other word wrapping utilities in that it treats all passed in whitespace as collapsible (like HTML). This means is can also be used to re-wrap a string that had previously been wrapped.

[Live Example](https://chrisjshull.github.io/wrap-words/docs/)

[API Docs](docs/api/)
