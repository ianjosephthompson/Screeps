//  Copyright © 2020 Ian Joseph Thompson

//  Modules
const errors = require('errors');

function creepSuicide() {
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

const overrides = {
  Creep: {
    // build: creepBuild,
    // harvest: creepHarvest,
    // moveTo: creepMoveTo,
    // pickup: creepPickup,
    // repair: creepRepair,
    suicide: creepSuicide,
    // transfer: creepTranser,
    // upgradeController: creepUpgradeController,
    // withdraw: creepWithdraw
  }
};

function apply() {
  let globalObject;

  for (let objectName in overrides) {
    globalObject = global[objectName];

    if (globalObject) {
      for (let propertyName in overrides[objectName]) {
        if (!globalObject.prototype['_' + propertyName]) {
          globalObject.prototype['_' + propertyName] = overrides[objectName][propertyName];
        }
      }
    }
  }
};

module.exports = {
  apply: apply
};
