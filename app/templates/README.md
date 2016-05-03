# <%= appname %> [![Build Status](https://img.shields.io/travis/catops/<%= appname %>.svg?maxAge=2592000&style=flat-square)](https://travis-ci.org/catops/<%= appname %>) [![npm](https://img.shields.io/npm/v/<%= appname %>.svg?maxAge=2592000&style=flat-square)](https://www.npmjs.com/package/<%= appname %>)

:cat: <%= scriptDescription %>

See [`src/<%= scriptName %>.coffee`](src/<%= scriptName %>.coffee) for full documentation.

## Installation

In hubot project repo, run:

`npm install <%= appname %> --save`

Then add **<%= appname %>** to your `external-scripts.json`:

```json
["<%= appname %>"]
```

## Sample Interaction

```
user1>> hubot hello
hubot>> hello!
```

```
user1>> hubot orly
hubot>> yarly
```

## Contributing

Please read our general [contributing guidelines](CONTRIBUTING.md).

## Open source licensing info
1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)
3. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)
