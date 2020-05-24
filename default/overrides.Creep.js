//  Copyright © 2020 Ian Joseph Thompson

function attack(target) {
  const tryAttack = this._attack(target);

  switch (tryAttack) {
    //  success
    case OK: {
      this.say('⚔️');
      break;
    }

    //  actionable codes
    case ERR_NOT_IN_RANGE:
    case ERR_NO_BODYPART: {
      break;
    }

    //  true errors
    case ERR_NOT_OWNER:
    case ERR_BUSY:
    case ERR_INVALID_TARGET:
    default: {
      this.logError('attack()', tryAttack);
      break;
    }
  }

  return tryAttack;
}

function build(target) {
  const tryBuild = this._build(target);

  switch (tryBuild) {
    //  success
    case OK: {
      this.say('🚧');
      break;
    }

    //  actionable codes
    case ERR_NOT_ENOUGH_RESOURCES:
    case ERR_NOT_IN_RANGE:
    case ERR_NO_BODYPART: {
      break;
    }

    //  true errors
    case ERR_NOT_OWNER:
    case ERR_BUSY:
    case ERR_INVALID_TARGET:
    default: {
      this.logError('build()', tryBuild);
      break;
    }
  }

  return tryBuild;
}

function harvest(target) {
  const tryHarvest = this._harvest(target);

  switch (tryHarvest) {
    //  success
    case OK: {
      this.say('⛏️');
      break;
    }

    //  actionable codes
    case ERR_NOT_FOUND:
    case ERR_NOT_ENOUGH_RESOURCES:
    case ERR_NOT_IN_RANGE:
    case ERR_TIRED:
    case ERR_NO_BODYPART: {
      break;
    }

    //  true errors
    case ERR_NOT_OWNER:
    case ERR_BUSY:
    case ERR_INVALID_TARGET:
    default: {
      this.logError('harvest()', tryHarvest);
      break;
    }
  }

  return tryHarvest;
}

//  alternatively:  x = target, y = options, options = undefined
function moveTo(x, y, options) {
  const tryMoveTo = this._moveTo(x, y, options);

  switch (tryMoveTo) {
    //  success
    case OK: {
      break;
    }

    //  actionable codes
    case ERR_NOT_FOUND:
    case ERR_TIRED:
    case ERR_NO_BODYPART: {
      break;
    }

    //  true errors
    case ERR_NOT_OWNER:
    case ERR_BUSY:
    case ERR_INVALID_TARGET:
    default: {
      this.logError('moveTo()', tryMoveTo);
      break;
    }
  }

  return tryMoveTo;
}

function pickup(target) {
  const tryPickup = this._pickup(target);

  switch (tryPickup) {
    //  success
    case OK: {
      this.say('🗑️');
      break;
    }

    //  actionable codes
    case ERR_FULL:
    case ERR_NOT_IN_RANGE: {
      break;
    }

    //  true errors
    case ERR_NOT_OWNER:
    case ERR_BUSY:
    case ERR_INVALID_TARGET:
    default: {
      this.logError('pickup()', tryPickup);
      break;
    }
  }

  return tryPickup;
}

function repair(target) {
  const tryRepair = this._repair(target);

  switch (tryRepair) {
    //  success
    case OK: {
      this.say('🔧');
      break;
    }

    //  actionable codes
    case ERR_NOT_ENOUGH_RESOURCES:
    case ERR_NOT_IN_RANGE:
    case ERR_NO_BODYPART: {
      break;
    }

    //  true errors
    case ERR_NOT_OWNER:
    case ERR_BUSY:
    case ERR_INVALID_TARGET:
    default: {
      this.logError('repair()', tryRepair);
      break;
    }
  }

  return tryRepair;
}

function suicide() {
  const trySuicide = this._suicide();

  switch (trySuicide) {
    //  success
    case OK: {
      this.say('😔🔫');
      console.log('RIP: Creep ' + this.name + ' has commited suicide().');
      break;
    }

    //  true errors
    case ERR_NOT_OWNER:
    case ERR_BUSY:
    default: {
      this.logError('suicide()', trySuicide);
      break;
    }
  }

  return trySuicide;
}

function transfer(target, resourceType, amount) {
  const tryTransfer = this._transfer(target, resourceType, amount);

  switch (tryTransfer) {
    //  success
    case OK: {
      this.say('🔋');
      break;
    }

    //  actionable codes
    case ERR_NOT_ENOUGH_RESOURCES:
    case ERR_FULL:
    case ERR_NOT_IN_RANGE: {
      break;
    }

    //  true errors
    case ERR_NOT_OWNER:
    case ERR_BUSY:
    case ERR_INVALID_TARGET:
    case ERR_INVALID_ARGS:
    default: {
      this.logError('transfer()', tryTransfer);
      break;
    }
  }

  return tryTransfer;
}

function upgradeController(target) {
  const tryUpgradeController = this._upgradeController(target);

  switch (tryUpgradeController) {
    //  success
    case OK: {
      this.say('⚡');
      break;
    }

    //  actionable codes
    case ERR_NOT_ENOUGH_RESOURCES:
    case ERR_NOT_IN_RANGE:
    case ERR_NO_BODYPART: {
      break;
    }

    //  true errors
    case ERR_NOT_OWNER:
    case ERR_BUSY:
    case ERR_INVALID_TARGET:
    default: {
      this.logError('upgradeController()', tryUpgradeController);
      break;
    }
  }

  return tryUpgradeController;
}

function withdraw(target, resourceType, amount) {
  const tryWithdraw = this._withdraw(target, resourceType, amount);

  switch (tryWithdraw) {
    //  success
    case OK: {
      this.say('🧲');
      break;
    }

    //  actionable codes
    case ERR_NOT_ENOUGH_RESOURCES:
    case ERR_FULL:
    case ERR_NOT_IN_RANGE: {
      break;
    }

    //  true errors
    case ERR_NOT_OWNER:
    case ERR_BUSY:
    case ERR_INVALID_TARGET:
    case ERR_INVALID_ARGS:
    default: {
      this.logError('withdraw()', tryWithdraw);
      break;
    }
  }

  return tryWithdraw;
}

module.exports = {
  attack: attack,
  build: build,
  harvest: harvest,
  moveTo: moveTo,
  pickup: pickup,
  repair: repair,
  suicide: suicide,
  transfer: transfer,
  upgradeController: upgradeController,
  withdraw: withdraw
};
