import chalk from "chalk";

export default class Logger {
  static success(msg) {
    console.log(chalk.green.bold("✓ " + msg + "\n"));
  }

  static info(msg) {
    console.log(chalk.blue("ℹ " + msg + "\n"));
  }

  static warn(msg) {
    console.log(chalk.yellow("⚠ " + msg + "\n"));
  }

  static error(msg) {
    console.log(chalk.red.bold("✖ " + msg + "\n"));
  }
}
