const Telnet = require('another-telnet-client')
let connection = new Telnet()

var opts = {
  host: 'localhost',
  port: 3040, //watchout production
  timeout: 30000,//10 seconds for development
}

connection.on('connect', (prompt)=>{
  console.log('connect')
  connection.exec('[1]ping', null, (result)=>{
    console.log('ping sent')
    console.log(result)
  })

  connection.exec('[1]foobar', null, (result)=>{
    console.log('foobar send')
    console.log(result)
  })
})

connection.on('ready', (prompt)=>{
  console.log('ready')
})

connection.on('timeout', ()=>{
  console.log('Telnet Timeout')
  connection.end()
})

connection.on('close', ()=>{
  console.log('connection closed')
})

connection.connect(opts)