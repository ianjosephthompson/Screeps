//  Copyright © 2020 Ian Joseph Thompson

//  Constants
const ERROR_STRINGS = {
  '-1': 'not owner',
  '-2': 'no path',
  '-3': 'name exists',
  '-4': 'busy',
  '-5': 'not found',
  '-6': 'not enough resources',
  '-7': 'invalid target',
  '-8': 'full',
  '-9': 'not in range',
  '-10': 'invalid arguments',
  '-11': 'tired',
  '-12': 'no body part',
  '-13': 'room control too low',
  '-14': 'global control too low'
};

function getErrorString(errorCode) {
  let errorString = ERROR_STRINGS[errorCode];

  if (!errorString) {
    errorString = 'an unknown error occurred';
  }

  return errorString;
}

module.exports = {
  ERROR_STRINGS: ERROR_STRINGS,
  getErrorString: getErrorString
};
