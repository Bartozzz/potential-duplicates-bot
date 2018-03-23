# `potential-duplicates` bot

A simple, configurable bot searching for potential issue duplicates using [Damerau–Levenshtein](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) algorithm. The Damerau–Levenshtein distance between two words is the minimum number of operations (consisting of insertions, deletions or substitutions of a single character, or transposition of two adjacent characters) required to change one word into the other. It also detects predefined synonyms for even better results.

## Setup

For more information, see the [documentation for Probot](https://github.com/probot/probot).

```bash
$ npm install
$ npm start
```

## Deploying

If you would like to run your own instance of this app, see the [docs for deployment](https://probot.github.io/docs/deployment/). This app requires `Issues - Read & Write` permissions & events.
