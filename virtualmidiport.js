// trick nexe
let midi
if (global.require) {
  midi = global.require('midi')
} else {
  midi = require('midi')
}
const Spinner = require('cli-spinner').Spinner
const MidiParser = require('./midiparser')

const mp = new MidiParser()

const msgTypes = ['note-off', 'note-on', 'key-pressure', 'program-change', 'channel-pressure', 'pitch-bend', 'bank-select', 'mod-wheel', 'breath-controller', 'foot-controller', 'portamento-time', 'volume', 'balance', 'pan', 'expression-controller', 'effect-control-1', 'effect-control-2', 'gp-controller-1', 'gp-controller-2', 'gp-controller-3', 'gp-controller-4', 'bank-select-fine', 'mod-wheel-fine', 'breath-controller-fine', 'foot-controller-fine', 'portamento-time-fine', 'volume-fine', 'balance-fine', 'pan-fine', 'expression-controller-fine', 'effect-control-1-fine', 'effect-control-2-fine', 'gp-controller-1-fine', 'gp-controller-2-fine', 'gp-controller-3-fine', 'gp-controller-4-fine', 'sound-variation', 'timbre-intensity', 'release-time', 'attack-time', 'brightness', 'decay-time', 'vibrato-rate', 'vibrato-depth', 'vibrato-delay', 'snd-controller-10', 'gp-controller-5', 'gp-controller-6', 'gp-controller-7', 'gp-controller-8', 'portamento', 'reverb-depth', 'tremolo-depth', 'chorus-depth', 'detune-depth', 'phaser-depth', 'damper-off', 'damper-on', 'portamento-off', 'portamento-on', 'sostenuto-off', 'sostenuto-on', 'soft-off', 'soft-on', 'legato-off', 'legato-on', 'hold2-off', 'hold2-on', 'all-sound-off', 'reset-all-controllers', 'all-notes-off', 'unknown-control-change', 'unknown-message']
msgTypes.forEach(msgType => {
  mp.on(msgType, (channel, note, velocity) => {
    spinner.setSpinnerString(channel % 15)
    if (typeof note !== 'undefined' && ['program-change', 'bank-select-fine'].indexOf(msgType) === -1) {
      if (typeof velocity !== 'undefined') {
        spinner.setSpinnerTitle(`%s MIDI: ${msgType} (ch:${channel + 1}) ${mp.getGM1NoteName(note)} velocity: ${velocity}`)
      } else {
        spinner.setSpinnerTitle(`%s MIDI: ${msgType} (ch:${channel + 1}) ${mp.getGM1NoteName(note)}`)
      }
    } else {
      if (typeof note !== 'undefined') {
        spinner.setSpinnerTitle(`%s MIDI: ${msgType} (ch:${channel + 1}) ${note}`)
      } else {
        spinner.setSpinnerTitle(`%s MIDI: ${msgType} (ch:${channel + 1})`)
      }
    }
  })
})

const spinner = new Spinner('%s Virtual MIDI port enabled. Hit Ctrl-C to stop.')
spinner.start()

const input = new midi.input()
const output = new midi.output()

input.openVirtualPort('Virtual IN')
output.openVirtualPort('Virtual OUT')

input.on('message', (deltaTime, message) => {
  mp.parse(new Uint8Array(message))
  output.sendMessage(message)
})

process.on('exit', () => {
  input.closePort()
  output.closePort()
})
