import Eos from './EtcEosConnection'
import fs from 'fs-extra'

try {
  let config = JSON.parse(fs.readFileSync('config.json'))
  console.log('Config->')
  console.log(JSON.stringify(config, null, 2))
  Eos.connect(config)
} catch (err) {
  console.log(err)
}

