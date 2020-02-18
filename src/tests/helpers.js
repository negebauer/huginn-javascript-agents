const defaultAgentMocks = {
  log: jest.fn(),
  createEvent: jest.fn(),
  memory: jest.fn(),
}

function mockAgentCall(fn, event, extraMocks) {
  const finalMocks = {
    ...defaultAgentMocks,
    ...extraMocks,
  }
  fn({ agentThis: finalMocks, event })
  return finalMocks
}

module.exports = { mockAgentCall }
