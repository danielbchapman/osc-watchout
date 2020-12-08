import net from 'net'

const socket = new net.Socket()
socket.setTimeout(10000)
socket.on('connect', () => {

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
  console.log('connected')
  socket.write('gotoControlCue 4\r\n')
  socket.write('run\r\n')
  socket.flush
})