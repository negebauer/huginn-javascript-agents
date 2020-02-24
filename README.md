# Huginn javascript agents

[![circleci_badge]][circleci_url]
[![coveralls_badge]][coveralls_url]

Javascript agents for use in [huginn](https://github.com/huginn/huginn)

## Agents

- [aftership_format](./src/agents/aftership_format.js): Format events from the [aftership agent](https://github.com/huginn/huginn/wiki/Agent-Types-&-Descriptions#aftership-agent) to send them by email
- [update_agents](./src/agents/update_agents.js): Update agents by updating credentials that store js code when a post is done to a [webhook agent](https://github.com/huginn/huginn/wiki/Agent-Types-&-Descriptions#webhook-agent) connected to this agent

<!-- Badges -->
 [circleci_badge]:https://img.shields.io/circleci/build/github/negebauer/huginn-javascript-agents
 [circleci_url]:https://circleci.com/gh/negebauer/huginn-javascript-agents

  [coveralls_badge]:https://coveralls.io/repos/github/negebauer/huginn-javascript-agents/badge.svg?branch=master
 [coveralls_url]:https://coveralls.io/github/negebauer/huginn-javascript-agents?branch=master
