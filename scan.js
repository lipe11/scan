const hosts = ['192.168.0.1', 'google.com', 'yahoo.com']
const interval = 10000

const keypress = require('keypress')
const ping = require('ping');
const { blue, red, green, yellow } = require('kleur')
const fixed = require('fixed-width-string')
const log = require('simple-node-logger').createSimpleFileLogger('report.log')

// report

function hostReport(host) {
  if (!host.alive) {
    log.error(`${host.host} sin conexion`)
    if (host.host === hosts[hosts.length - 1]) {
      log.info('----')
    }
  }
  const name = blue(host.host)
  const status = host.alive ? green(' ONLINE') : red('OFFLINE')
  const timeStr = host.time.toFixed(2)
  const time = yellow(fixed(timeStr, 7, { align: 'right' }))
  return `[ ${name}: ${status} ${time}ms ]`
}

function report(val) {
  console.log(val.map(hostReport).join(' '))
}

// ping

async function hostScan(host) {
  return ping.promise.probe(host)
}

async function scan() {
  Promise.all(hosts.map(hostScan)).then(report)
}

scan()
setInterval(scan, interval)

// keypress

keypress(process.stdin)

process.stdin.on('keypress', function (_, key) {
  if (key.name === 'q') {
    console.log('exit')
    process.exit()
  }
})

process.stdin.setRawMode(true)
