# `possible-duplicate` bot

A simple bot checking possible duplicates using [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance). The Levenshtein distance between two words is the minimum number of single-character edits required to change one word into the other. A single-character edit can be an _insertion_, _deletion_ or _substitution_.

>**Disclaimer**: This project is created as a simple, demonstrating application for recruitment. This is probably not the best implementation available, although the code is tested and production-ready.

## Setup

```bash
$ npm install
$ npm start
```

## Deploying

If you would like to run your own instance of this app, see the [docs for deployment](https://probot.github.io/docs/deployment/). This app requires these **permissions & events** for the GitHub App:

- Issues - Read & Write
