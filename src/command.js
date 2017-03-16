export default commandConvert

/**
 * Converts Unix environment variable syntax to Windows'
 * @param {String} command Command to convert
 * @returns {String} Converted command
 */
function commandConvert(command) {
  const envUseUnixRegex = /\$(\w+)|\${(\w+)}/g // $my_var or ${my_var}
  return command.replace(envUseUnixRegex, '%$1$2%')
}
