# `possible-duplicate` bot

A simple bot searching for possible duplicates using [Damerau–Levenshtein](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance). The Damerau–Levenshtein distance between two words is the minimum number of operations (consisting of insertions, deletions or substitutions of a single character, or transposition of two adjacent characters) required to change one word into the other. It also detects predefined synonyms to better results.

>**Disclaimer**: This project is created as a simple, demonstrating application for GSoC recruitment. This is probably not the best implementation available.

**Some ideas for improvement:**
- a better `compare` function which would _include phrase-length difference in the observational error_ (right now, for the sake of simplicity, it is completely ignored and we are comparing based on the shorter phrase);

## Setup

```bash
$ npm install
$ npm start
```

## Deploying

If you would like to run your own instance of this app, see the [docs for deployment](https://probot.github.io/docs/deployment/). This app requires these **permissions & events** for the GitHub App:

- Issues - Read & Write
