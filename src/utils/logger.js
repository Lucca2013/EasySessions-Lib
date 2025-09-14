import chalk from "chalk";

export default class Logger {
  static success(msg) {
    console.log(chalk.green.bold("✓ " + msg));
  }

  static info(msg) {
    console.log(chalk.blue("ℹ " + msg));
  }

  static warn(msg) {
    console.log(chalk.yellow("⚠ " + msg));
  }

  static error(msg) {
    console.log(chalk.red.bold("✖ " + msg));
  }
}
