import net from 'net'

class WatchoutSocket {
  constructor(address, port, debug) {
    this.address = address || 'localhost'
    this.port = port || 3040
    this.debug = debug || false
  }

  safeControlCue(cue) {
    console.log(`CUE-${cue}`)
    const socket = new net.Socket()
    socket.setTimeout(1000) //short life socket
    let wait = 'waiting'
    
    socket.on('data', (data) => {
      if(data.indexOf('Error') > -1) {
        console.log('--------------------------------------')
        console.log(`[WO::data] => ${data}`)
        console.log('--------------------------------------')        
        socket.destroy()
      } else {
        socket.write('run\r\n')
        socket.destroy()
      }
      
    })

    const opts = {
      host: 'localhost',
      port: 3040,
      readable: true,
      writeable: true,
    }

    socket.connect(opts, ()=>{
      if(this.debug) {
        console.log('[Socket] Watchout socket connected')
      }
      console.log('----------------------------------')
      socket.write(`gotoControlCue ${cue}\r\n`)
      socket.write('ping\r\n')
      console.log('----------------------------------')
    })
  }
  /**
   * Sends a command/set of commands to watchout, then disconnects. Because
   * of the nature of the online/offline workflow with Watchout
   * I'm opting to a socket per show control command rather than 
   * keeping a socket open. If this becomes an issue we can revisit it.
   * @param {Array<string>} command 
   */
  send(commands) {
    console.log('COMMANDS -> ')
    console.log(commands)
    const debug = this.debug
    const address = this.address
    const port = this.port

    const socket = new net.Socket()
    socket.setTimeout(1000) //short life socket
    socket.on('connect', () => {
      console.log('connect')
    })
    
    socket.on('data', (data) => {
      console.log(data)
    })
    
    socket.on('close', ()=>{
      console.log('closed')
    })
    
    socket.on('error', (err)=>{
      console.log(err)
    })
    
    socket.connect({
      host: 'localhost',
      port: 3040,
      readable: true,
      writeable: true,
    }, ()=>{
      if(debug) {
        console.log('[Socket] Watchout socket connected')
      }
      
      for(let x of commands) {
        socket.write(x + '\r\n')
      }
      socket.destroy()
    })

  }
}

export default WatchoutSocket