//  Copyright © 2020 Ian Joseph Thompson

//  Modules
const roles = require('roles');
const tasks = require('tasks');

//  Constants
const ROLES = roles.ROLES;
const TASKS = tasks.TASKS;
const CREEP_TYPES = {
  CHEAP: 'cheap',
  DEFAULT: 'default',
  ADVANCED: 'advanced'
};
const PARTS = {
  CHEAP: [WORK, CARRY, MOVE],
  DEFAULT: [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
  ADVANCED: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
};
const PARTS_COST = {
  CHEAP: 200,
  DEFAULT: 400,
  ADVANCED: 650
};
const SPAWN_LIMITS = {
  CHEAP_WORKER: 3,
  CHEAP_UPGRADER: 1,
  CHEAP_BUILDER: 1,

  DEFAULT_WORKER: 6,
  DEFAULT_UPGRADER: 3,
  DEFAULT_BUILDER: 3,

  ADVANCED_WORKER: 10,
  ADVANCED_UPGRADER: Infinity,
  ADVANCED_BUILDER: 10
};

function spawnCreep(options) {
  const spawn = options.spawn;
  const energyAvailable = options.energyAvailable;
  const numWorkerCreeps = options.numWorkerCreeps;
  const numUpgraderCreeps = options.numUpgraderCreeps;
  const numBuilderCreeps = options.numBuilderCreeps;

  //  Maintain a minimum of cheap creeps if the population tanks
  if (numWorkerCreeps < SPAWN_LIMITS.CHEAP_WORKER && energyAvailable >= PARTS_COST.CHEAP) {
    doSpawnCreep(spawn, ROLES.WORKER, CREEP_TYPES.CHEAP);
  }
  else if (numUpgraderCreeps < SPAWN_LIMITS.CHEAP_UPGRADER && energyAvailable >= PARTS_COST.CHEAP) {
    doSpawnCreep(spawn, ROLES.UPGRADER, CREEP_TYPES.CHEAP);
  }
  else if (numBuilderCreeps < SPAWN_LIMITS.CHEAP_BUILDER && energyAvailable >= PARTS_COST.CHEAP) {
    doSpawnCreep(spawn, ROLES.BUILDER, CREEP_TYPES.CHEAP);
  }

  //  Then, build a few decent creeps to ramp back up
  else if (numWorkerCreeps < SPAWN_LIMITS.DEFAULT_WORKER && energyAvailable >= PARTS_COST.DEFAULT) {
    doSpawnCreep(spawn, ROLES.WORKER, CREEP_TYPES.DEFAULT);
  }
  else if (numBuilderCreeps < SPAWN_LIMITS.DEFAULT_BUILDER && energyAvailable >= PARTS_COST.DEFAULT) {
    doSpawnCreep(spawn, ROLES.BUILDER, CREEP_TYPES.DEFAULT);
  }
  else if (numUpgraderCreeps < SPAWN_LIMITS.DEFAULT_UPGRADER && energyAvailable >= PARTS_COST.DEFAULT) {
    doSpawnCreep(spawn, ROLES.UPGRADER, CREEP_TYPES.DEFAULT);
  }

  //  Otherwise, build good creeps up to SPAWN_LIMITS
  else if (numWorkerCreeps < SPAWN_LIMITS.ADVANCED_WORKER && energyAvailable >= PARTS_COST.ADVANCED) {
    doSpawnCreep(spawn, ROLES.WORKER, CREEP_TYPES.ADVANCED);
  }
  else if (numBuilderCreeps < SPAWN_LIMITS.ADVANCED_BUILDER && energyAvailable >= PARTS_COST.ADVANCED) {
    doSpawnCreep(spawn, ROLES.BUILDER, CREEP_TYPES.ADVANCED);
  }

  //  Finally, spam advanced workers
  else if (energyAvailable >= PARTS_COST.ADVANCED) {
    doSpawnCreep(spawn, ROLES.WORKER, CREEP_TYPES.ADVANCED);
  }
}

function doSpawnCreep(spawn, role, type) {
  let parts;
  let typePrefix;
  let rolePrefix;
  const memory = {
    role: role,
    task: {
      task: TASKS.SPAWNING
    }
  };

  switch (type) {
    case CREEP_TYPES.ADVANCED: {
      parts = PARTS.ADVANCED;
      typePrefix = 'A-'
      break;
    }
    case CREEP_TYPES.DEFAULT: {
      parts = PARTS.DEFAULT;
      typePrefix = 'D-'
      break;
    }
    case CREEP_TYPES.CHEAP:
    default: {
      parts = PARTS.CHEAP;
      typePrefix = 'C-'
      break;
    }
  }

  switch (role) {
    case ROLES.BUILDER: {
      rolePrefix = 'B-';
      break;
    }
    case ROLES.UPGRADER: {
      rolePrefix = 'U-';
      break;
    }
    case ROLES.WORKER:
    default: {
      rolePrefix = 'W-';
      break;
    }
  }

  trySpawnCreep(spawn, typePrefix + rolePrefix, parts, memory, 0);
}

function trySpawnCreep(spawn, namePrefix, parts, memory, index) {
  const name = namePrefix + index;
  const trySpawn = spawn.spawnCreep(parts, name, {
    memory: memory
  });

  if (trySpawn === OK) {
    console.log(name + ' is born');
  }
  else {
    let errorString;

    switch (trySpawn) {
      //  Actionable errors
      case ERR_NAME_EXISTS: {
        return trySpawnCreep(spawn, namePrefix, parts, memory, index + 1);
      }

      //  Uncommon errors
      case ERR_NOT_ENOUGH_ENERGY: {
        errorString = 'ERR_NOT_ENOUGH_ENERGY';
        break;
      }
      case ERR_NOT_OWNER: {
        errorString = 'ERR_NOT_OWNER';
        break;
      }
      case ERR_BUSY: {
        errorString = 'ERR_BUSY';
        break;
      }
      case ERR_INVALID_ARGS: {
        errorString = 'ERR_INVALID_ARGS';
        break;
      }
      case ERR_RCL_NOT_ENOUGH: {
        errorString = 'ERR_RCL_NOT_ENOUGH';
        break;
      }
    }

    if (errorString) {
      console.log('ERROR: Spawn ' + spawn.id + ' tried to spawnCreep(), but ' + errorString);
    }
  }
}

module.exports = {
  SPAWN_LIMITS: SPAWN_LIMITS,
  PARTS: PARTS,
  PARTS_COST: PARTS_COST,
  spawnCreep: spawnCreep
};
