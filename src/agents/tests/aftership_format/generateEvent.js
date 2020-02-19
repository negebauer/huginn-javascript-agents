const trackingWithoutCheckpoints = require('./trackingWithoutCheckpoints.json')
const trackingWithCheckpoints1 = require('./trackingWithCheckpoints1.json')
const trackingWithCheckpoints2 = require('./trackingWithCheckpoints2.json')

function generateEvent(
  trackings = [
    trackingWithoutCheckpoints,
    trackingWithCheckpoints1,
    trackingWithCheckpoints2,
  ],
) {
  return {
    payload: {
      meta: {
        code: 200,
      },
      data: {
        page: 1,
        limit: 100,
        count: 3,
        keyword: '',
        slug: '',
        origin: [],
        destination: [],
        tag: '',
        fields: '',
        created_at_min: '2019-11-19T21:00:11+00:00',
        created_at_max: '2020-02-17T21:00:11+00:00',
        last_updated_at: null,
        return_to_sender: [],
        courier_destination_country_iso3: [],
        trackings,
      },
    },
  }
}

module.exports = generateEvent
