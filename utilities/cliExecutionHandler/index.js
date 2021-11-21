const { exec } = require("child_process");
const prompts = require('prompts');

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