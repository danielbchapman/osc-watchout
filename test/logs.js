import {
    critical,
    debug,
    info,
    universalLog,
    verbose,
    setLevel,
    getLevel,
    LEVELS,
    setCustomLogFn
 } from './../src/SimpleLog'

 const testFunc = (...args) => {
    console.log('[MyTestFunction]')
    console.log(...args)
}

console.log('---------------------------------START TEST')

const doRun = (lvl)=> {
    console.log(`----------------------${lvl}`)
    setLevel(lvl)
    verbose(`Hi, I'm verbose with parameters ${0} ${1} ${2}`, 1, 2, 3)
    debug(`Hi, I'm debug with parameters `, 1, 2, 3)
    info(`Hi, I'm info with parameters `, 1, 2, 3)
    critical(`Hi, I'm critical with parameters `, 1, 2, 3)
    console.log(`----------------------END ${lvl}`)
}

doRun(LEVELS.CRITICAL)
doRun(LEVELS.INFO)
doRun(LEVELS.DEBUG)
doRun(LEVELS.VERBOSE)

console.log('USER FUNCTION TEST------------------------------')
const userFn = (str) =>{
    console.log('[My First Arg]', str)
}

setCustomLogFn( userFn )

doRun(LEVELS.VERBOSE)
 