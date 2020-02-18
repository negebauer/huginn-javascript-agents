const { aftershipFormatPayload } = require('../mocks')
const { mockAgentCall } = require('../tests/helpers')
const { check, receive } = require('./aftership_format')

describe('aftership format', () => {
  describe('check', () => {
    it('does nothing', () => {
      expect(check).not.toThrow()
      expect(check()).not.toBeDefined()
    })
  })

  describe('receive', () => {
    it('generates events with info', () => {
      const mocks = mockAgentCall(receive, aftershipFormatPayload)
      expect(mocks).toBeDefined()
    })
  })
})
