const agentInfo1 = require('./agentInfo1.json')
const agentInfo2 = require('./agentInfo2.json')
const defaulltDeployInfo = require('./deployInfo.json')

function generateEvent({
  agentsInfo = [agentInfo1, agentInfo2],
  deployInfo = defaulltDeployInfo,
  date = 'Thu Feb 20 2020 03:58:54 GMT-0300 (Chile Summer Time)',
} = {}) {
  return {
    payload: {
      date,
      deployInfo,
      agentsInfo,
    },
  }
}

module.exports = generateEvent
