import EosTcpHandler, { VERSIONS } from './LightAsssistantEosModule'
import WatchoutSocket from './WatchoutSocket'

let _lastPing = null
let _intervalPingEos = null
let _intervalReconnect = null
/**
 * This is the interval for the heartbeat, we check every 5 seconds, but wait up to 10.
 * I'm not sure this is aggressive enough. And, honestly, I think any "/eos/out/" should
 * probably reset the interval
 */
let _max = 10000 
let _interval = 5000
let _eos = null
let _config = null

const killKeepAlive = ()=> {
  clearInterval(_intervalPingEos)
  clearInterval(_intervalReconnect)
}

const startKeepAlive = () => {
  const forceReconnect = () =>{ 
    const _now = Date.now()
    if(_now - _lastPing > _max) {
      console.error('[CONNECTION TO EOS LOST]------------RETRY EVERY 5 SECONDS')
      try {
        _eos.disconnect()
      } catch(e) {
        console.error('EXCEPTION')
        console.error(e)
      }
      setTimeout(()=>{tryConnect()}, 500)
    } else {
      console.log(`HEARTBEAT: last ping at ${_lastPing}`)
    }
  }

  const pingEos = () => {
    try {
      console.log('HEARTBEAT:/eos/ping')
      _eos.send('/eos/ping')
    } catch (e) {
      console.error('[CRITICAL] FAILED TO PING')
      console.error(e)
    }
    
  }
  _intervalReconnect = setInterval(forceReconnect, _interval)
  _intervalPingEos = setInterval(pingEos, _interval)
}

const tryConnect = () => {
  killKeepAlive()
  startKeepAlive()
  _eos.connect().then(ok => {
    if(_config.debug) {
      console.log('Connected to EOS')
      console.log(ok)
    }
  }).catch(error => {
    console.log('Error connecting to EOS')
    console.log(error)
  })
}

let connect = (config) => {
  _config = {...config}
  //Configuration
  const eosIP = config.eosIpAddress || 'localhost'
  const eosPort = config.eosOscPort || 3032
  const debug = config.debug || false
  const watchoutIp = config.watchoutIpAddress || 'localhost'
  const watchoutPort = config.watchoutPort || 3040 //production, 3039 for Display

  let cleanLog = (data) => {
    if(data.indexOf('watchout') > -1) {
      console.log(data)
    }
  }
  let eos = new EosTcpHandler(eosIP, eosPort, null, null, cleanLog)
  _eos = eos
  if(!debug) {
    const empty = ()=>{}
    eos.onVerbose = empty
    eos.onVerbose = empty
    eos.onReceive = empty
  }

  eos.version = VERSIONS.VERSION_1_0

  //Eos Keep Alive
  eos.addListener( (msg) => {
    let { address, args} = msg
    if(address.includes('/eos/out/ping')) {
      _lastPing = Date.now()
    }
  })
  // eos.onVerbose = (log) => {
  //   console.log(log)
  // }
  eos.addListener((msg) => {
    if(!msg) {
      return
    }

    try {
      let { address, args } = msg
      if(!address) {
        return
      }

      if(!args) {
        args = []
      }

      //listen for custom event
      if(address.includes('/watchout/')){
        const split = address.split('/')
        const command = split[2]
        const cue = split[3]
        
        if(debug) {
          console.log(`CUE FIRED ${cue}/${command}`)
          console.log(address)
        }
      
        switch(command) {
          case 'go': {
            if(debug) {
              console.log(`[WATCHOUT] gotoControlCue ${cue}`)
              console.log(`[WATCHOUT] run`)
            }
            let wo = new WatchoutSocket(watchoutIp, watchoutPort, debug)
            wo.gotoControlCue(cue)
          }
          
          break
          case 'run': {
            if(debug) {
              console.log(`[WATCHOUT] run`)
            }

            let wo = new WatchoutSocket(watchoutIp, watchoutPort, debug)
            wo.run()
          }

          case 'goto': { //goto the cue and standby to run
            if(debug) {
              console.log(`[WATCHOUT] gotoControlCue ${cue}`)
              console.log(`[WATCHOUT] halt`)
            }
            let wo = new WatchoutSocket(watchoutIp, watchoutPort, debug)
            wo.moveToControlCue(cue)
          }
          break

          case 'halt': {
            if(debug) {
              console.log(`[WATCHOUT] halt`)
            }
            let wo = new WatchoutSocket(watchoutIp, watchoutPort, debug)
            wo.halt()
          }
          break

          default:
            console.log(`[OSC-WATCHOUT] Unknown command ${fire}`)
        }
        if(debug) {
          console.log('========================================')
        }
        
      }
    } catch (err) {
      console.log('error processing message')
      console.log(msg)
      console.log(err)
    }
  })

  tryConnect(eos)
}


const eos = {
  connect: connect
}

export default eos