import isWindows from 'is-windows'

export default commandConvert

/**
 * Converts an environment variable usage to be appropriate for the current OS
 * @param {String} command Command to convert
 * @returns {String} Converted command
 */
function commandConvert(command, name = false) {
  const envUseUnixRegex = /\$(\w+)|\${(\w+)}/g // $my_var or ${my_var}
  const envUseWinRegex = /%(.*?)%/g // %my_var%
  const isWin = isWindows()
  const envExtract = isWin ? envUseUnixRegex : envUseWinRegex
  if (name) {
    console.log(command)
    return command.replace(
      isWin ? envUseWinRegex : envUseUnixRegex,
      (match, $1, $2) =>
        console.log('lol', match, $1, $2) || process.env[$1 || $2],
    )
  } else {
    return command.replace(envExtract, isWin ? '%$1$2%' : '$$$1')
  }
}
