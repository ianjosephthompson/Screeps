//  Copyright © 2020 Ian Joseph Thompson

//  Modules
const errors = require('errors');

function suicide() {
  this.say('😔🔫');
  const trySuicide = this._suicide(arguments);
  switch (trySuicide) {
    //  actionable results
    case OK: {
      this.say('💀');
      console.log('RIP: Creep ' + this.name + ' has commited suicide().');
      return trySuicide;
    }

    //  uncommon errors
    case ERR_NOT_OWNER:
    case ERR_BUSY:
    default: {
      console.log('ERROR: Creep ' + this.name + ' tried to suicide(), but ' + errors.getErrorString(trySuicide));
    }
  }
}

module.exports = {
  suicide: suicide
};
