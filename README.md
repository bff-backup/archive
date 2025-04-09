# WunderGraph BFF SDK Archives

An archive of the WunderGraph Backend-For-Frontend (BFF) SDK

## GitHub Activity

GitHub activity was archived using [perceval](https://perceval.readthedocs.io/en/latest/perceval/github.html) and [uv](https://docs.astral.sh/uv/):

    uv run --with perceval \
      -- perceval github wundergraph wundergraph \
      -t "$(gh auth token)" \
      -o github-activity/archive.jsonl \
      --json-line


## License

This repository contains code dual-licensed under ISC and Apache 2.0. All content in the `npm-registry` directory maintains it's Apache-2.0 license as defined in the archived `package.json` files and the original `wundergraph/wundergraph` monorepo. All of the code used to generate these archives has been included in this repository and is licensed as ISC.

`SPDX-License-Identifier: ISC AND Apache-2.0`

In addition, all content archived in the `github-activity` directory is copyright it's original authors.
