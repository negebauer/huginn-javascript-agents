// const { aftershipFormatPayload } = require('../mocks')
const {
  check,
  // receive
} = require('./aftership_format')

describe('aftership format', () => {
  beforeAll(() => {
    Agent = {}
  })

  describe('check', () => {
    it('does nothing', () => {
      expect(check).not.toThrow()
      expect(check()).not.toBeDefined()
    })
  })

  describe('receive', () => {
    it('generates events with info', () => {
      // expect()
    })
  })
})
