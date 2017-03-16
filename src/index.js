import isWindows from 'is-windows'
import {spawn} from 'cross-spawn'
import commandConvert from './command'

module.exports = crossEnv

const envSetterRegex = /(\w+)=('(.+)'|"(.+)"|(.+))/

function crossEnv(args) {
  const [envSetters, command, commandArgs] = pivot(
    args,
    arg => !envSetterRegex.test(arg),
  )

  if (isWindows()) {
  } else {
    return [
      `${envSetters.join(' ')} ${quote(command)}`,
      ...commandArgs.map(quote),
    ]
  }
  const [command, commandArgs, env] = isWindows() ?
    getCommandArgsAndEnvVars(args) :
    [args.map(arg => `"${arg}"`).join(' '), [], process.env]
  if (command) {
    const proc = spawn(command, commandArgs, {
      stdio: 'inherit',
      shell: true,
      env,
    })
    process.on('SIGTERM', () => proc.kill('SIGTERM'))
    process.on('SIGINT', () => proc.kill('SIGINT'))
    process.on('SIGBREAK', () => proc.kill('SIGBREAK'))
    process.on('SIGHUP', () => proc.kill('SIGHUP'))
    proc.on('exit', process.exit)
    return proc
  }
  return null
}

function getCommandArgsAndEnvVars(args) {
  const envVars = getEnvVars()
  const commandArgs = args.map(commandConvert)
  const command = getCommand(commandArgs, envVars)
  return [command, commandArgs, envVars]
}

function getCommand(commandArgs, envVars) {
  while (commandArgs.length) {
    const shifted = commandArgs.shift()
    const match = envSetterRegex.exec(shifted)
    if (match) {
      envVars[match[1]] = match[3] || match[4] || match[5]
    } else {
      return shifted
    }
  }
  return null
}

function getEnvVars() {
  const envVars = Object.assign({}, process.env)
  if (process.env.APPDATA) {
    envVars.APPDATA = process.env.APPDATA
  }
  return envVars
}

function quote(arg) {
  return `'${arg.replace(/'/g, "\\'")}'`
}

function pivot(array, predicate) {
  const pivotIndex = array.findIndex(predicate)
  if (pivotIndex < 0) {
    return [[], undefined, []]
  }
  return [
    array.slice(0, pivotIndex),
    array[pivotIndex],
    array.slice(pivotIndex + 1),
  ]
}
