/* eslint-disable no-console */
export class Logger {
  private static getLevel = (): number => {
    switch (process.env.STAGE) {
      case "prod":
        return 0;
      case "test":
        return 1;
      case "sand":
      case "dev":
      default:
        return 2;
    }
  };

  static info = (message: Parameters<typeof console.info>[0]): void => {
    if (this.getLevel() < 2) {
      return;
    }

    console.info(message);
  };

  static warn = (message: Parameters<typeof console.warn>[0]): void => {
    if (this.getLevel() < 1) {
      return;
    }

    console.warn(message);
  };

  static error = (message: Parameters<typeof console.error>[0]): void => {
    if (this.getLevel() < 0) {
      return;
    }

    console.error(message);
  };
}
