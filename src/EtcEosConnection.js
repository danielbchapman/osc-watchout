import EosTcpHandler, { VERSIONS } from './LightAsssistantEosModule'
import WatchoutSocket from './WatchoutSocket'

let connect = (config) => {
  
  //Configuration
  const eosIP = config.eosIpAddress || 'localhost'
  const eosPort = config.eosOscPort || 3032
  const debug = config.debug || false
  const watchoutIp = config.watchoutIpAddress || 'localhost'
  const watchoutPort = config.watchoutPort || 3040 //production

  let eos = new EosTcpHandler(eosIP, eosPort)

  if(!debug) {
    const empty = ()=>{}
    eos.onVerbose = empty
    eos.onVerbose = empty
    eos.onReceive = empty
  }

  eos.version = VERSIONS.VERSION_1_0
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
            wo.send([
              `gotoControlCue ${cue}`, 
              'run'
            ])
          }
          
          break
          case 'run': {
            if(debug) {
              console.log(`[WATCHOUT] run`)
            }

            let wo = new WatchoutSocket(watchoutIp, watchoutPort, debug)
            wo.send([
              'run'
            ])
          }

          case 'goto': { //goto the cue and standby to run
            if(debug) {
              console.log(`[WATCHOUT] gotoControlCue ${cue}`)
              console.log(`[WATCHOUT] halt`)
            }
            let wo = new WatchoutSocket(watchoutIp, watchoutPort, debug)
            wo.send([
              `gotoControlCue ${cue}`, 
              'halt'
            ])
          }
          break

          case 'halt': {
            if(debug) {
              console.log(`[WATCHOUT] halt`)
            }
            let wo = new WatchoutSocket(watchoutIp, watchoutPort, debug)
            wo.send([
              'halt'
            ])
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

  eos.connect().then(ok => {
    if(debug) {
      console.log('Connected to EOS')
      console.log(ok)
    }
  }).catch(error => {
    console.log('Error connecting to EOS')
    console.log(error)
  })  
}


const eos = {
  connect: connect
}

export default eos