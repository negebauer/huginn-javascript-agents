/* eslint-disable camelcase */

const BASE_KEY = 'aftership_format_update'

function check() {
  // Do nothing
}

function receive({ event, agentThis }) {
  if (!event) return

  const { payload: { data: { trackings } = {} } = {} } = event
  if (!trackings || trackings.length === 0) return

  trackings.forEach(tracking => {
    const {
      id,
      // last_updated_at,
      tracking_number,
      slug,
      // active,
      expected_delivery,
      // tag,
      // subtag,
      subtag_message,
      title,
      // tracked_count,
      // shipment_type,
      checkpoints,
      delivery_time,
    } = tracking

    let body = `<h1>${title} - ${tracking_number}</h1>
      <h2>${subtag_message} - ${slug}</h2>
      <br/>
      <div>${delivery_time} days</div>
      ${expected_delivery ? `<div>Expected: ${expected_delivery}</div>` : ''}
      ${checkpoints.length > 0 ? '<br/><h2>Checkpoints</h2><br/>' : ''}`

    checkpoints
      .sort((a, b) => {
        if (a.checkpoint_time < b.checkpoint_time) return 1
        if (a.checkpoint_time > b.checkpoint_time) return -1
        return 0
      })
      .forEach(checkpoint => {
        const {
          // slug: checkpointSlug,
          location,
          message,
          checkpoint_time,
          // tag: checkpointTag,
          // subtag: checkpointSubtag,
          subtag_message: checkpointSubtagMessage,
        } = checkpoint

        body += `<br/>
          <h3>${checkpointSubtagMessage} ${checkpoint_time}</h3>
          <h4>${message}</h4>
          ${location && `<div>${location}</div>`}`
      })

    const trackingKey = `${BASE_KEY}#${id}`
    const oldUpdate = agentThis.memory(trackingKey)
    const newUpdate = {
      subject: `Status update for ${title} - ${tracking_number}`,
      body: body.replace('\n', ''),
    }

    if (JSON.stringify(newUpdate) !== JSON.stringify(oldUpdate)) {
      agentThis.memory(trackingKey, newUpdate)
      agentThis.createEvent(newUpdate)
    } else {
      agentThis.log(`No update for ${title} - ${tracking_number}`)
    }
  })
}

function agentReceive() {
  const event = this.incomingEvents()[0]
  return receive({ agentThis: this, event })
}

Agent.check = check
Agent.receive = agentReceive

module.exports = { check, receive }
