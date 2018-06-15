# `potential-duplicates` bot

A simple, configurable bot searching for potential issue duplicates using [Damerau–Levenshtein](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) algorithm. The Damerau–Levenshtein distance between two words is the minimum number of operations (consisting of insertions, deletions or substitutions of a single character, or transposition of two adjacent characters) required to change one word into the other. It also detects predefined synonyms for even better results.

![Demo](https://i.imgur.com/mZrLqPe.png)

## Setup

For more information, see the [documentation for Probot](https://github.com/probot/probot).

```bash
$ npm install
$ npm start
```

## Usage

You need to install [our Github App](https://github.com/apps/potential-duplicates). Otherwise, you can deploy our Github App manually. Then, you can create a custom configuration file at `.github/potential-duplicates.yml`. If this file doesn't exists, default settings will be used:

```yml
# Label name and color to set, when potential duplicates are detected
issueLabel: potential-duplicate
labelColor: cfd3d7

# If similarity is higher than this threshold, issue will be marked as duplicate
threshold: 0.60

# Comment to post when potential duplicates are detected
referenceComment: >
  Potential duplicates:
  {{#issues}}
    - [#{{ number }}] {{ title }} ({{ accuracy }}%)
  {{/issues}}
```

## Deploying

If you would like to run your own instance of this app, see the [docs for deployment](https://probot.github.io/docs/deployment/). This app requires both `Issues – Read & Write` and `Single File – Read` (`.github/potential-duplicates.yml`) permissions & events.
