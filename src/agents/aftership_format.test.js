const { defaultAgentMocks, mockAgentCall } = require('./tests/helpers')
const {
  generateEvent,
  buildTracking,
  buildCheckpoint,
} = require('./tests/aftership_format')
const {
  generateSnapshot,
  trackingNoUpdate,
  check,
  receive,
  agentReceive,
} = require('./aftership_format')

const testTimestamp = '2020-01-01T01:01:01'
const testSubtag = 'InSomething'
const testSubtagMessage = 'In Something'

const testCheckpoint = buildCheckpoint({
  checkpoint_time: testTimestamp,
})

const testTracking = buildTracking({
  subtag: testSubtag,
  subtag_message: testSubtagMessage,
  last_updated_at: testTimestamp,
  checkpoints: [],
})

describe('aftership format', () => {
  describe('generateSnapshot', () => {
    describe('when there is a latestCheckpoint', () => {
      it('generates snapshot using checkpoint_time', () => {
        const snapshot = generateSnapshot(testCheckpoint, {})
        const expected = `checkpoint#${testCheckpoint.checkpoint_time}`
        expect(snapshot).toEqual(expected)
      })
    })

    describe('when there is not a latestCheckpoint', () => {
      it('generates snapshot using subtag, subtag_message, last_updated_at', () => {
        const snapshot = generateSnapshot(undefined, testTracking)
        const expected = `tag#${testTracking.subtag}-${testTracking.subtag_message}-${testTracking.last_updated_at}`
        expect(snapshot).toEqual(expected)
      })
    })
  })

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

      describe('when payload is empty', () => {
        it('logs it and returns', () => {
          const { log } = mockAgentCall(receive, { payload: undefined })
          expect(log).toHaveBeenCalledWith('No payload')
        })
      })

      describe('when payload.data is empty', () => {
        it('logs it and returns', () => {
          const { log } = mockAgentCall(receive, {
            payload: { data: undefined },
          })
          expect(log).toHaveBeenCalledWith('No data')
        })
      })

      describe('when trackings is null', () => {
        it('logs it and returns', () => {
          const { log } = mockAgentCall(receive, generateEvent(null))
          expect(log).toHaveBeenCalledWith('No trackings')
        })
      })

      describe('when trackings is empty', () => {
        it('logs it and returns', () => {
          const { log } = mockAgentCall(receive, generateEvent([]))
          expect(log).toHaveBeenCalledWith('Trackings is empty')
        })
      })
    })

    describe('when there is no update', () => {
      function buildMocks(checkpoint, tracking) {
        const snapshot = generateSnapshot(checkpoint, tracking)
        return {
          memory: jest.fn(() => snapshot),
        }
      }

      describe('with checkpoint info', () => {
        it("logs that there's no update", () => {
          const event = generateEvent([
            buildTracking({ checkpoints: [testCheckpoint] }),
          ])
          const mocks = buildMocks(testCheckpoint, {})
          const { log } = mockAgentCall(receive, event, mocks)
          expect(log).toHaveBeenCalledWith(trackingNoUpdate(testTracking))
        })
      })

      describe('without checkpoint info', () => {
        it("logs that there's no update", () => {
          const event = generateEvent([testTracking])
          const mocks = buildMocks(undefined, testTracking)
          const { log } = mockAgentCall(receive, event, mocks)
          expect(log).toHaveBeenCalledWith(trackingNoUpdate(testTracking))
        })
      })
    })

    describe('when there is an update', () => {
      it('calls createEvent', () => {
        const event = generateEvent()
        const { createEvent, memory } = mockAgentCall(receive, event)
        const trackinsAmount = event.payload.data.trackings.length
        expect(createEvent).toHaveBeenCalledTimes(trackinsAmount)
        expect(memory).toHaveBeenCalledTimes(trackinsAmount * 2)
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
