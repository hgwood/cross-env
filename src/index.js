import {spawn} from 'cross-spawn'
import commandConvert from './command'

module.exports = crossEnv

const envSetterRegex = /(\w+)=('(.+)'|"(.+)"|(.+))/

function crossEnv(args) {
  const [command, commandArgs, env] = getCommandArgsAndEnvVars(args)
  console.log('out', command, commandArgs, env.MY_VAR)
  if (command) {
    const proc = spawn(command, commandArgs, {
      stdio: 'inherit',
      env,
      shell: true,
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
  const [envSetters, fullCommand] = getEnvSettersAndFullCommand(args)
  const [command, ...commandArgs] = fullCommand.map(arg => {
    return commandConvert(
      arg,
      (isWin, envVar) => isWin ? `%${envVar}%` : `$${envVar}`,
    )
  })
  getCommand(envSetters, envVars)
  return [command, commandArgs, envVars]
}

function getCommand(commandArgs, envVars) {
  while (commandArgs.length) {
    const shifted = commandArgs.shift()
    const match = envSetterRegex.exec(shifted)
    if (match) {
      envVars[match[1]] = commandConvert(
        match[3] || match[4] || match[5],
        (isWin, envVar) => process.env[envVar],
      )
    } else {
      return shifted
    }
  }
  return null
}

function getEnvSettersAndFullCommand(args) {
  const indexOfCommand = args.findIndex(arg => !envSetterRegex.test(arg))
  return [args.slice(0, indexOfCommand), args.slice(indexOfCommand)]
}

function getEnvVars() {
  const envVars = Object.assign({}, process.env)
  if (process.env.APPDATA) {
    envVars.APPDATA = process.env.APPDATA
  }
  return envVars
}
