const { exec } = require("child_process");
const prompts = require('prompts');

/**
 * Responsible for executing cli commands inside javascript process
 * @module cliExecutionHandler
 */

/**
 * ->. This execute a sigle command
 * @async
 * @param { string } command - the cli command to execute
 * @returns { Promise<Null> } returns a promise
 * @throws { string } error message
 */
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    console.log(`- Execute: ${ command }`)
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(error.message)
        return reject()
      }
      if (stderr) {
        console.log(stderr)
        return reject()
      }
      console.log(stdout)
      return resolve()
    })
  })
}

/**
 * ->. Execute multiple commands
 * @async
 * @param { Array<string> } commands - list of commands in order
 * @returns { Promise<Null> } returns a promise
 * @throws { string } error message
 */
const executeCommands = async (commands) => {

  if (!(commands && commands.length)) return

  console.group('Execute commands')

  for (let command of commands) {
    try {
      await executeCommand(command)
    } catch {
      break
    }
  }

  console.groupEnd()
}

module.exports = {
  executeCommand,
  executeCommands
}