import isWindows from 'is-windows'

export default commandConvert

/**
 * Converts an environment variable usage to be appropriate for the current OS
 * @param {String} command Command to convert
 * @returns {String} Converted command
 */
function commandConvert(command, replacer) {
  const envUseUnixRegex = /\$(\w+)|\${(\w+)}|%(.*?)%/g // $my_var or ${my_var} or %my_var%
  const envUseWinRegex = /%(.*?)%/g // %my_var%
  const isWin = isWindows()
  const envExtract = isWin ? envUseUnixRegex : envUseWinRegex
  // const envExtract = envUseUnixRegex
  const strReplace = isWin ? '%$1$2%' : '$$$1'
  return command.replace(
    envExtract,
    replacer ?
      (match, $1, $2) => {
        return replacer(isWin, $1 || $2)
      } :
      strReplace,
  )
}
