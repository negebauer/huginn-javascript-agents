function check() {
  // Do nothing
}

function receive() {
  const event = this.incomingEvents()[0]
  if (!event) return

  this.log('ASD')
  this.log('ASD')

  // this.createEvent({
  //   message: 'I got an event!',
  //   event_was: events[i].payload,
  // })
}

Agent.check = check
Agent.receive = receive

module.exports = { check, receive }
