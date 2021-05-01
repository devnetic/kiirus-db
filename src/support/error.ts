import * as utils from '@devnetic/utils';

type LoggerLevel = 'debug' | 'error' | 'info' | 'warning';

/**
 * Generate an error message according to the given error code
 *
 * @param {string} code
 * @param {string} message
 * @returns {string}
 */
export const getErrorMessage = (code: string, message = ''): string => {
  if (message.includes(code.slice(0, 3))) {
    return message;
  }

  message = process.env[code]?.replace('{{}}', message !== undefined ? `${message}` : '') ?? '';

  return `${code}: ${message}`;
};

const bold = (message: string): string => {
  return `\x1b[1m${message}\x1b[22m`;
};

const color = (name: string, message: string): string => {
  const colors: Record<string, string> = {
    black: `\x1b[30m${message}\x1b[39m`,
    cyan: `\x1b[36m${message}\x1b[39m`,
    green: `\x1b[32m${message}\x1b[39m`,
    red: `\x1b[31m${message}\x1b[39m`,
    blue: `\x1b[34m${message}\x1b[39m`,
    magenta: `\x1b[35m${message}\x1b[39m`,
    white: `\x1b[37m${message}\x1b[39m`,
    yellow: `\x1b[33m${message}\x1b[39m`,
  };

  return colors[name];
};

export const logger = (message: string, level: LoggerLevel = 'info'): void => {
  const levelColor = {
    debug: color('yellow', level.toUpperCase()),
    error: bold(color('red', level.toUpperCase())),
    info: color('blue', level.toUpperCase()),
    warning: color('yellow', level.toUpperCase()),
  };

  console.log(
    '%s - %s: %s',
    color('green', `[${utils.dateFormat(new Date(), 'YYYY-MM-dd HH:mm:ss')}]`),
    levelColor[level],
    color('white', message),
  );
};
