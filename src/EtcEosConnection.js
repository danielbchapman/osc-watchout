import EosTcpHandler, { VERSIONS } from './LightAsssistantEosModule'

let connect = () => {
  // let eos = new EosTcpHandler('192.168.86.149', 3032)
	// //let eos = new EosTcpHandler(first, 3032)
	// // '192.168.86.149'
	// eos.version = VERSIONS.VERSION_1_0

	// eos.connect().then(result=>{
	// 	console.log(result)
	// }).catch(err => {
	// 	console.log('OSC CRITICAL ERROR, canceling connection------------')

	// 	console.log(err)
	// 	assert.fail(0, 1, err)	
	// })

	// setTimeout(()=>{
	// 	console.log("Waited 5 seconds before exiting")
	// 	console.log('OSC Connection opened? ' + eos.isConnected)
	// 	eos.disconnect()
	// 	process.exit()
  // }, 5000)
  
  // //Handler (Client...)
  //Configuration
  const eosIP = '192.168.86.149'
  const eosPort = 3032
  const cueLists = ['1']
  const debug = false
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
      if(address.includes('/watchout/go/')){
        const split = address.split('/')
        const command = split[2]
        const cue = split[3]
        
        console.log(`CUE FIRED ${cue}/${fire}`)
        console.log(address)
      
        switch(command) {
          case 'go': {
            console.log(`[WATCHOUT] gotoControlCue ${cue}`)
            console.log(`[WATCHOUT] run`)

          }
          break
          case 'run': {

          }
          break
          case 'halt':
        }
        if(command == 'go') {
          //FIXME Watchout isn't smart about going to a control cue (we can't check it exists first, we might need to do an explicit list in this router...)

        } else if (command == '')
        } else if (command == 'halt') {
          console.log(`[WATCHOUT] halt`)
        } else {
          console.log(`We don't understand ${fire}`)
        }

        console.log('========================================')
      }
    } catch (err) {
      console.log('error processing message')
      console.log(msg)
      console.log(err)
    }
  })

  eos.connect().then(ok => {
    console.log('OK, connected....')
    console.log(ok)
  }).catch(error => {
    console.log('error?')
    console.log(error)
  })  
}


const eos = {
  connect: connect
}

export default eos