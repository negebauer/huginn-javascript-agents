const trackingWithCheckpoints1 = require('./trackingWithCheckpoints1.json')

function buildCheckpoint(data) {
  const checkpoint = trackingWithCheckpoints1.checkpoints[0]
  return {
    ...checkpoint,
    ...data,
  }
}

module.exports = buildCheckpoint
