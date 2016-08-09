const midi = require('midi')

const input = new midi.input()
const output = new midi.output()

input.openVirtualPort('Virtual Port IN')
output.openVirtualPort('Virtual Port OUT')

input.on('message', (deltaTime, message) => {
  // console.log('MIDI in', message)
  output.sendMessage(message)
})

console.log('Press Ctrl-C to exit')
process.on('exit', () => {
  input.closePort()
  output.closePort()
})
