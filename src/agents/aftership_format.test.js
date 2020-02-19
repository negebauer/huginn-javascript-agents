const { mockAgentCall } = require('./tests/helpers')
const {
  // trackingWithoutCheckpoints,
  // trackingWithCheckpoints1,
  // trackingWithCheckpoints2,
  generateEvent,
  buildTracking,
  buildCheckpoint,
} = require('./tests/aftership_format')
const { generateSnapshot, check, receive } = require('./aftership_format')

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
      function expectNoMocksCalled(mocks) {
        Object.keys(mocks).forEach(key => {
          expect(mocks[key]).not.toHaveBeenCalled()
        })
      }

      describe('when there is no event', () => {
        it('returns without doing anything', () => {
          const mocks = mockAgentCall(receive, undefined)
          expectNoMocksCalled(mocks)
        })
      })

      describe('when trackings is null', () => {
        it('returns without doing anything', () => {
          const mocks = mockAgentCall(receive, generateEvent(null))
          expectNoMocksCalled(mocks)
        })
      })

      describe('when trackings is empty', () => {
        it('returns without doing anything', () => {
          const mocks = mockAgentCall(receive, generateEvent([]))
          expectNoMocksCalled(mocks)
        })
      })

      describe('when payload is empty', () => {
        const mocks = mockAgentCall(receive, { payload: undefined })
        expectNoMocksCalled(mocks)
      })

      describe('when payload.data is empty', () => {
        const mocks = mockAgentCall(receive, { payload: { data: undefined } })
        expectNoMocksCalled(mocks)
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
          expect(log).toHaveBeenCalled()
        })
      })

      describe('without checkpoint info', () => {
        it("logs that there's no update", () => {
          const event = generateEvent([testTracking])
          const mocks = buildMocks(undefined, testTracking)
          const { log } = mockAgentCall(receive, event, mocks)
          expect(log).toHaveBeenCalled()
        })
      })
    })
  })
})
