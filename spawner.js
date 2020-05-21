const roles = require('roles');
const tasks = require('tasks');

const PARTS = {
  DEFAULT: [WORK, WORK, CARRY, MOVE],
  EDGE: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]
  // EDGE: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
};

const PARTS_COST = {
  DEFAULT: 300,
  EDGE: 500
  // EDGE: 800
};

const SPAWN_LIMITS = {
  DEFAULT_WORKER: 4,
  DEFAULT_UPGRADER: 4,
  DEFAULT_BUILDER: 2,
  WORKER: 10,
  UPGRADER: 10,
  BUILDER: 10
};

function spawnCreep(options) {
  let spawn = options.spawn;
  let energyAvailable = options.energyAvailable;
  let numWorkerCreeps = options.numWorkerCreeps;
  let numUpgraderCreeps = options.numUpgraderCreeps;
  let numBuilderCreeps = options.numBuilderCreeps;

  //  Maintain a few cheap creeps if population drops
  if (numWorkerCreeps < SPAWN_LIMITS.DEFAULT_WORKER && energyAvailable >= PARTS_COST.DEFAULT) {
    trySpawnWorkerCreep(spawn, PARTS.DEFAULT);
  }
  else if (numUpgraderCreeps < SPAWN_LIMITS.DEFAULT_UPGRADER && energyAvailable >= PARTS_COST.DEFAULT) {
    trySpawnUpgraderCreep(spawn, PARTS.DEFAULT);
  }
  else if (numBuilderCreeps < SPAWN_LIMITS.DEFAULT_BUILDER && energyAvailable >= PARTS_COST.DEFAULT) {
    trySpawnBuilderCreep(spawn, PARTS.DEFAULT);
  }

  //  Otherwise build good creeps up to SPAWN_LIMITS
  else if (numWorkerCreeps < SPAWN_LIMITS.WORKER && energyAvailable >= PARTS_COST.EDGE) {
    trySpawnWorkerCreep(spawn, PARTS.EDGE);
  }
  else if (numBuilderCreeps < SPAWN_LIMITS.BUILDER && energyAvailable >= PARTS_COST.EDGE) {
    trySpawnBuilderCreep(spawn, PARTS.EDGE);
  }
  else if (energyAvailable >= PARTS_COST.EDGE) {
    //  except upgraders - let's spam those
    trySpawnUpgraderCreep(spawn, PARTS.EDGE);
  }
}

function trySpawnWorkerCreep(spawn, parts) {
  return trySpawnCreep(spawn, 'Worker-', 0, parts, {
    role: roles.WORKER,
    task: {
      task: tasks.SPAWNING
    }
  });
}

function trySpawnUpgraderCreep(spawn, parts) {
  return trySpawnCreep(spawn, 'Upgrader-', 0, parts, {
    role: roles.UPGRADER,
    task: {
      task: tasks.SPAWNING
    }
  });
}

function trySpawnBuilderCreep(spawn, parts) {
  return trySpawnCreep(spawn, 'Builder-', 0, parts, {
    role: roles.BUILDER,
    task: {
      task: tasks.SPAWNING
    }
  });
}

function trySpawnCreep(spawn, name, index, parts, memory) {
  const trySpawn = spawn.spawnCreep(parts, name + index, {
    memory: memory
  });

  if (trySpawn === OK) {
    console.log(name + index + ' is born');
  }
  else {
    let errorString;

    switch (trySpawn) {
      //  Actionable errors
      case ERR_NAME_EXISTS: {
        return trySpawnCreep(spawn, name, index + 1, parts, memory);
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
