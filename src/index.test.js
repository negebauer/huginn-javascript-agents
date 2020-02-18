const { foo } = require('.')

describe('foo', () => {
  it('returns bar', () => {
    expect(foo()).toEqual('bar')
  })
})
