function defaultAgentMocks() {
  return {
    log: jest.fn(),
    createEvent: jest.fn(),
    memory: jest.fn(),
    credential: jest.fn(),
  }
}

function mockAgentCall(fn, event, extraMocks = {}) {
  const finalMocks = {
    ...defaultAgentMocks(),
    ...extraMocks,
  }
  fn({ Agent: finalMocks, event })
  return finalMocks
}

module.exports = {
  defaultAgentMocks,
  mockAgentCall,
}
