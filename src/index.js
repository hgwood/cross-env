import {spawn} from 'cross-spawn'
import commandConvert from './command'

module.exports = crossEnv

const envSetterRegex = /(\w+)=('(.+)'|"(.+)"|(.+))/

function crossEnv(args) {
  const [command, commandArgs, env] = getCommandArgsAndEnvVars(args)
  console.log('args', args)
  console.log('out', command, commandArgs, env.MY_VAR)
  // if (command) {
  //   const proc = spawn(command, commandArgs, {stdio: 'inherit', env})
  //   process.on('SIGTERM', () => proc.kill('SIGTERM'))
  //   process.on('SIGINT', () => proc.kill('SIGINT'))
  //   process.on('SIGBREAK', () => proc.kill('SIGBREAK'))
  //   process.on('SIGHUP', () => proc.kill('SIGHUP'))
  //   proc.on('exit', process.exit)
  //   return proc
  // }
  return null
}

function getCommandArgsAndEnvVars(args) {
  const envVars = getEnvVars()
  const commandArgs = args.map(arg => commandConvert(arg))
  console.log('commandArgs', commandArgs)
  const command = getCommand(commandArgs, envVars)
  return [command, commandArgs, envVars]
}

function getCommand(commandArgs, envVars) {
  while (commandArgs.length) {
    const shifted = commandArgs.shift()
    const match = envSetterRegex.exec(shifted)
    if (match) {
      envVars[match[1]] = commandConvert(
        match[3] || match[4] || match[5],
        true,
      )
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
