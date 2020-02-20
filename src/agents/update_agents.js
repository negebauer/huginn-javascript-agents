/* eslint-disable camelcase */

function extractAgentInfoFromEvent(event, Agent) {
  if (!event) return Agent.log('No event')

  const { payload } = event
  if (!payload) return Agent.log('No payload')

  const { agentsInfo } = payload
  if (!agentsInfo) return Agent.log('No agentsInfo')

  return agentsInfo
}

function check() {
  // Do nothing
  //
}

function receive({ event, Agent }) {
  const agentsInfo = extractAgentInfoFromEvent(event, Agent) || {}
  if (!agentsInfo) return

  agentsInfo.forEach(({ agentName, agentCode }) => {
    Agent.credential(agentName, agentCode)
  })
}

function agentReceive() {
  const event = this.incomingEvents()[0]
  return receive({ Agent: this, event })
}

Agent.check = check
Agent.receive = agentReceive

module.exports = {
  check,
  receive,
  agentReceive,
}
