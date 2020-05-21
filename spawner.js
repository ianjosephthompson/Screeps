const roles = require('roles');
const tasks = require('tasks');

const PARTS = {
  DEFAULT: [WORK, WORK, CARRY, MOVE],
  EDGE: [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]
};

const PARTS_COST = {
  DEFAULT: 300,
  EDGE: 500
};

const SPAWN_LIMITS = {
  DEFAULT_WORKER: 4,
  DEFAULT_UPGRADER: 4,
  DEFAULT_BUILDER: 2,
  WORKER: 10,
  UPGRADER: 10,
  BUILDER: 10
}

function spawnCreep(options) {
  let spawn = options.spawn;
  let energyAvailable = options.energyAvailable;
  let numWorkerCreeps = options.numWorkerCreeps;
  let numUpgraderCreeps = options.numUpgraderCreeps;
  let numBuilderCreeps = options.numBuilderCreeps;

  //  Maintain a few cheap creeps if population drops
  if (numWorkerCreeps < SPAWN_LIMITS.DEFAULT_WORKER && energyAvailable >= PARTS_COST.DEFAULT) {
    spawnWorkerCreep(spawn, PARTS.DEFAULT);
  }
  else if (numUpgraderCreeps < SPAWN_LIMITS.DEFAULT_UPGRADER && energyAvailable >= PARTS_COST.DEFAULT) {
    spawnUpgraderCreep(spawn, PARTS.DEFAULT);
  }
  else if (numBuilderCreeps < SPAWN_LIMITS.DEFAULT_BUILDER && energyAvailable >= PARTS_COST.DEFAULT) {
    spawnBuilderCreep(spawn, PARTS.DEFAULT);
  }

  //  Otherwise build good creeps up to SPAWN_LIMITS
  else if (numWorkerCreeps < SPAWN_LIMITS.WORKER && energyAvailable >= PARTS_COST.EDGE) {
    spawnWorkerCreep(spawn, PARTS.EDGE);
  }
  else if (numBuilderCreeps < SPAWN_LIMITS.BUILDER && energyAvailable >= PARTS_COST.EDGE) {
    spawnBuilderCreep(spawn, PARTS.EDGE);
  }
  else if (energyAvailable >= PARTS_COST.EDGE) {
    //  except upgraders - let's spam those
    spawnUpgraderCreep(spawn, PARTS.EDGE);
  }
}

function spawnWorkerCreep(spawn, parts) {
  let index = 0;
  let trySpawn = trySpawnWorkerCreep(spawn, index, parts);

  while (trySpawn === ERR_NAME_EXISTS) {
    index++;
    trySpawn = trySpawnWorkerCreep(spawn, index, parts);
  }

  if (trySpawn < 0) {
    console.log('ERROR: Tried to spawnCreep(), but ' + trySpawn);
  }
}

function spawnUpgraderCreep(spawn, parts) {
  let index = 0;
  let trySpawn = trySpawnUpgraderCreep(spawn, index, parts);

  while (trySpawn === ERR_NAME_EXISTS) {
    index++;
    trySpawn = trySpawnUpgraderCreep(spawn, index, parts);
  }

  if (trySpawn < 0) {
    console.log('ERROR: Tried to spawnCreep(), but ' + trySpawn);
  }
}

function spawnBuilderCreep(spawn, parts) {
  let index = 0;
  let trySpawn = trySpawnBuilderCreep(spawn, index, parts);

  while (trySpawn === ERR_NAME_EXISTS) {
    index++;
    trySpawn = trySpawnBuilderCreep(spawn, index, parts);
  }

  if (trySpawn < 0) {
    console.log('ERROR: Tried to spawnCreep(), but ' + trySpawn);
  }
}

function trySpawnWorkerCreep(spawn, index, parts) {
  const name = 'Worker-';
  return spawn.spawnCreep(parts, name + index, {
    memory: {
      role: roles.WORKER,
      task: {
        task: tasks.SPAWNING
      }
    }
  });
}

function trySpawnUpgraderCreep(spawn, index, parts) {
  const name = 'Upgrader-';
  return spawn.spawnCreep(parts, name + index, {
    memory: {
      role: roles.UPGRADER,
      task: {
        task: tasks.SPAWNING
      }
    }
  });
}

function trySpawnBuilderCreep(spawn, index, parts) {
  const name = 'Builder-';
  return spawn.spawnCreep(parts, name + index, {
    memory: {
      role: roles.BUILDER,
      task: {
        task: tasks.SPAWNING
      }
    }
  });
}

module.exports = {
  SPAWN_LIMITS: SPAWN_LIMITS,
  PARTS: PARTS,
  PARTS_COST: PARTS_COST,
  spawnCreep: spawnCreep
};
