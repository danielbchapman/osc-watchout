# osc-watchout
A show control platform/router that converts OSC messages to telnet console commands for Dataton Watchout

# Configuration
This router connects directly to an Eos instance (over TCP/IP) on port `3032`. By default it will connect to local host. This can be configured in `config.json`:

  {
    "eosIpAddress": "127.0.0.1",
    "eosOscPort": 3032,
    "eosOscVersion": "1.0",
    "watchoutIpAddress": "127.0.0.1",
    "watchoutPort": 3040,
    "debug": true
  }

The startup script is "start" `npm run start` or `yarn start`.

# Eos Commands 
Because Watchout does not support native run/halt commands when navigating to control cues I have included a set of commands so that you can specify the desired behavior. Eos can send OSC commands in the execute column with `[CUE] [NUM] [EXECUTE] [STRING] /watchout/${command}/${target}

This program assumes watchout control cues are on the main timeline.

* `/watchout/go/${cue}`
Executes: 
  "gotoControlCue ${cue}" followed by "run"

* `/watchout/goto/${cue}`
Executes: 
  "gotoControlCue ${cue}" followed by "run"

* `/watchout/run`
Executes: 
  "run"

* `/watchout/halt`
Executes: 
  "halt"

# Credits
This project was inspired by Node-OBSosc https://github.com/jshea2/Node-OBSosc 