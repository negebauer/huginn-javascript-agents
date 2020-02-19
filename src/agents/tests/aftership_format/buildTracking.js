const trackingWithCheckpoints1 = require('./trackingWithCheckpoints1.json')

function buildTracking(data) {
  return {
    ...trackingWithCheckpoints1,
    ...data,
  }
}

module.exports = buildTracking
