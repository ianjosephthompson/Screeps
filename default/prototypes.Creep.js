//  Copyright © 2020 Ian Joseph Thompson

const errors = require('errors');

function logError(methodName, errorCode, message) {
  console.log('ERROR: Creep ' + this.name + ' tried to ' + methodName + ', but ' + errors.getErrorString(errorCode));

  if (message) {
    console.log('  ' + message);
  }
}

module.exports = {
  logError: logError
};
