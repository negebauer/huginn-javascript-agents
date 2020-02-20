const { defaultAgentMocks, mockAgentCall } = require('./tests/helpers')
const { generateEvent } = require('./tests/update_agents')
const { check, receive, agentReceive } = require('./update_agents')

describe('aftership format', () => {
  describe('check', () => {
    it('does nothing', () => {
      expect(check).not.toThrow()
      expect(check()).not.toBeDefined()
    })
  })

  describe('receive', () => {
    describe('early exits', () => {
      describe('when there is no event', () => {
        it('logs it and returns', () => {
          const { log } = mockAgentCall(receive, undefined)
          expect(log).toHaveBeenCalledWith('No event')
        })
      })

      describe('when there is no event', () => {
        it('logs it and returns', () => {
          const { log } = mockAgentCall(receive, { payload: undefined })
          expect(log).toHaveBeenCalledWith('No payload')
        })
      })

      describe('when agentsInfo is null', () => {
        it('logs it and returns', () => {
          const { log } = mockAgentCall(
            receive,
            generateEvent({ agentsInfo: null }),
          )
          expect(log).toHaveBeenCalledWith('No agentsInfo')
        })
      })

      describe('when agentsInfo is empty', () => {
        it('logs it and returns', () => {
          const { log } = mockAgentCall(
            receive,
            generateEvent({ agentsInfo: [] }),
          )
          expect(log).toHaveBeenCalledWith('agentsInfo is empty')
        })
      })
    })

    describe('when there is an update', () => {
      it('sets credentials', () => {
        const event = generateEvent()
        const { credential } = mockAgentCall(receive, event)
        const agentsInfoAmount = event.payload.agentsInfo.length
        expect(credential).toHaveBeenCalledTimes(agentsInfoAmount)
      })
    })
  })

  describe('agentReceive', () => {
    describe('with undefined event', () => {
      const Agent = {
        ...defaultAgentMocks(),
        incomingEvents: jest.fn(() => [undefined]),
        agentReceive,
      }

      it('calls receive, logs and returns', () => {
        Agent.agentReceive()
        expect(Agent.log).toHaveBeenCalledTimes(1)
      })
    })
  })
})
