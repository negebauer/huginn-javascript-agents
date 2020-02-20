/* eslint-disable camelcase */

function generateSnapshot(
  lastCheckpoint,
  { subtag, subtag_message, last_updated_at },
) {
  return lastCheckpoint
    ? `checkpoint#${lastCheckpoint.checkpoint_time}`
    : `tag#${subtag}-${subtag_message}-${last_updated_at}`
}

function trackingSubject({ title, tracking_number }) {
  return `[Package] ${title} #${tracking_number}`
}

function trackingNoUpdate({ title, tracking_number }) {
  return `No update for ${title} - ${tracking_number}`
}

function trackingBody({
  tracking_number,
  slug,
  expected_delivery,
  subtag_message,
  title,
  checkpoints,
  delivery_time,
}) {
  return `<h1>${title} - ${tracking_number}</h1>
  <h2>${subtag_message} - ${slug}</h2>
  <br/>
  <div>${delivery_time} days</div>
  ${expected_delivery ? `<div>Expected: ${expected_delivery}</div>` : ''}
  ${checkpoints.length > 0 ? '<br/><h2>Checkpoints</h2><br/>' : ''}`
}

function checkpointBody({
  location,
  message,
  checkpoint_time,
  tag: checkpointTag,
  subtag_message: checkpointSubtagMessage,
}) {
  return `<br/>
  <h3>${checkpointTag} - ${checkpoint_time}</h3>
  <h4>${checkpointSubtagMessage}</h4>
  <h5>${message}</h5>
  ${location ? `<div>${location}</div>` : '<br/>'}`
}

function extractTrackingsFromEvent(event, Agent) {
  if (!event) return Agent.log('No event')

  const { payload } = event
  if (!payload) return Agent.log('No payload')

  const { data } = payload
  if (!data) return Agent.log('No data')

  const { trackings } = data
  if (!trackings) return Agent.log('No trackings')

  if (trackings.length === 0) return Agent.log('trackings is empty')

  return trackings
}

function check() {
  // Do nothing
}

function receive({ event, Agent }) {
  const trackings = extractTrackingsFromEvent(event, Agent)
  if (!trackings) return

  trackings.forEach(tracking => {
    const {
      id,
      last_updated_at,
      // active,
      // tag,
      subtag,
      subtag_message,
      // tracked_count,
      // shipment_type,
      checkpoints,
    } = tracking

    let body = trackingBody(tracking)

    const sortedCheckpoints = checkpoints.sort((a, b) => {
      if (a.checkpoint_time < b.checkpoint_time) return 1
      if (a.checkpoint_time > b.checkpoint_time) return -1
      return 0
    })
    sortedCheckpoints.forEach(checkpoint => {
      // const {
      // slug: checkpointSlug,
      // subtag: checkpointSubtag,
      // } = checkpoint

      body += checkpointBody(checkpoint)
    })

    const oldSnapshot = Agent.memory(id)
    const newSnapshot = generateSnapshot(sortedCheckpoints[0], {
      subtag,
      subtag_message,
      last_updated_at,
    })

    if (oldSnapshot !== newSnapshot) {
      Agent.memory(id, newSnapshot)
      Agent.createEvent({
        subject: trackingSubject(tracking),
        body: body.replace(/\n/g, ''),
      })
    } else {
      Agent.log(trackingNoUpdate(tracking))
    }
  })
}

function agentReceive() {
  const event = this.incomingEvents()[0]
  return receive({ Agent: this, event })
}

Agent.check = check
Agent.receive = agentReceive

module.exports = {
  generateSnapshot,
  trackingSubject,
  trackingNoUpdate,
  trackingBody,
  checkpointBody,
  check,
  receive,
  agentReceive,
}
