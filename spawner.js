//  Copyright © 2020 Ian Joseph Thompson

const roles = require('roles');
const tasks = require('tasks');

const ROLES = roles.ROLES;
const TASKS = tasks.TASKS;

const CREEP_TYPES = {
  CHEAP: 'cheap',
  DEFAULT: 'default',
  ADVANCED: 'advanced'
};

const PARTS = {
  CHEAP: [WORK, WORK, CARRY, MOVE],
  DEFAULT: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
  ADVANCED: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
};

const PARTS_COST = {
  CHEAP: 300,
  DEFAULT: 550,
  ADVANCED: 800
};

const SPAWN_LIMITS = {
  CHEAP_WORKER: 4,
  CHEAP_UPGRADER: 2,
  CHEAP_BUILDER: 2,

  DEFAULT_WORKER: 6,
  DEFAULT_UPGRADER: 6,
  DEFAULT_BUILDER: 6
};

function spawnCreep(options) {
  let spawn = options.spawn;
  let energyAvailable = options.energyAvailable;
  let numWorkerCreeps = options.numWorkerCreeps;
  let numUpgraderCreeps = options.numUpgraderCreeps;
  let numBuilderCreeps = options.numBuilderCreeps;

  //  Maintain a few cheap creeps if population drops
  if (numWorkerCreeps < SPAWN_LIMITS.CHEAP_WORKER && energyAvailable >= PARTS_COST.CHEAP) {
    doSpawnCreep(spawn, ROLES.WORKER, PARTS.CHEAP);
  }
  else if (numUpgraderCreeps < SPAWN_LIMITS.CHEAP_UPGRADER && energyAvailable >= PARTS_COST.CHEAP) {
    doSpawnCreep(spawn, ROLES.UPGRADER, PARTS.CHEAP);
  }
  else if (numBuilderCreeps < SPAWN_LIMITS.CHEAP_BUILDER && energyAvailable >= PARTS_COST.CHEAP) {
    doSpawnCreep(spawn, ROLES.BUILDER, PARTS.CHEAP);
  }

  //  Otherwise build good creeps up to SPAWN_LIMITS
  else if (numWorkerCreeps < SPAWN_LIMITS.DEFAULT_WORKER && energyAvailable >= PARTS_COST.DEFAULT) {
    doSpawnCreep(spawn, ROLES.WORKER, PARTS.DEFAULT);
  }
  else if (numBuilderCreeps < SPAWN_LIMITS.DEFAULT_BUILDER && energyAvailable >= PARTS_COST.DEFAULT) {
    doSpawnCreep(spawn, ROLES.BUILDER, PARTS.DEFAULT);
  }
  else if (numUpgraderCreeps < SPAWN_LIMITS.DEFAULT_UPGRADER && energyAvailable >= PARTS_COST.DEFAULT) {
    doSpawnCreep(spawn, ROLES.UPGRADER, PARTS.DEFAULT);
  }

  //  Then spawn advanced workers
  else if (energyAvailable >= PARTS_COST.ADVANCED) {
    doSpawnCreep(spawn, ROLES.WORKER, PARTS.ADVANCED);
  }
}

function doSpawnCreep(spawn, role, type) {
  let parts;
  let typePrefix;
  let rolePrefix;
  let memory = {
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
      rolePrefix = 'Builder-';
    }
    case ROLES.UPGRADER: {
      rolePrefix = 'Upgrader-';
    }
    case ROLES.WORKER:
    default: {
      rolePrefix = 'Worker-';
    }
  }

  trySpawnCreep(spawn, typePrefix + rolePrefix, parts, memory, 0);
}

function trySpawnCreep(spawn, namePrefix, parts, memory, index) {
  const name = namePrefix + index;
  const trySpawn = spawn.spawnCreep(parts, name + index, {
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
      case ERR_NOT_ENOUGH_ENERGY: {
        return null;
      }

      //  Uncommon errors
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
