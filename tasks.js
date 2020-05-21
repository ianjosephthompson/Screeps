const TASKS = {
  SPAWNING: 'spawning',
  COLLECTING: 'collecting',
  PICKINGUP: 'pickingup',
  STORING: 'storing',
  UPGRADING: 'upgrading',
  BUILDING: 'building',
  REPAIRING: 'repairing'
};

const MAX_WALL_REPAIR_LEVEL = 1000;

function goTravel(creep, destination, color) {
  let tryMove = creep.moveTo(destination, { visualizePathStyle: { stroke: color } });

  if (tryMove !== OK) {
    let errorString;

    switch (tryMove) {
      //  Actionable errors
      case ERR_TIRED: {
        break;
      }
      case ERR_NO_PATH: {
        creep.memory.blockedLastTick = true;
        break;
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
      case ERR_NOT_FOUND: {
        errorString = 'ERR_NOT_FOUND';
        break;
      }
      case ERR_NOT_IN_RANGE: {
        errorString = 'ERR_NOT_IN_RANGE';
        break;
      }
      case ERR_INVALID_TARGET: {
        errorString = 'ERR_INVALID_TARGET';
        creep.memory.blockedLastTick = true;
        break;
      }
      case ERR_NO_BODYPART: {
        errorString = 'ERR_NO_BODYPART';
        break;
      }
    }

    if (errorString) {
      console.log('ERROR: Creep ' + creep.name + ' tried to goTravel() to ' + destination.pos + ', but ' + errorString);
    }
  }
}

function goCollectEnergy(creep) {
  let task = creep.memory.task;
  let source;

  //  set task
  creep.memory.task.task = TASKS.COLLECTING;

  //  if previously collecting
  if (task.collectionTarget) {
    //  use previous source
    let foundSources = creep.room.find(FIND_SOURCES);
    for (let i = 0, ilen = foundSources.length; i < ilen; i++) {
      let foundSource = foundSources[i];
      if (foundSource.id === task.collectionTarget) {
        source = foundSource;
        break;
      }
    }
  }
  else {
    //  use closest source
    source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  }

  if (source) {
    //  remember target
    creep.memory.task.collectionTarget = source.id;
  } else {
    //  no active sources to collect energy from
    creep.memory.task.collectionTarget = undefined;
    creep.memory.blockedLastTick = true;
    return;
  }

  const tryCollectEnergy = creep.harvest(source);
  if (tryCollectEnergy === OK) {
    creep.say('⛏️');
  }
  else {
    let errorString;

    switch (tryCollectEnergy) {
      //  Actionable errors
      case ERR_NOT_ENOUGH_RESOURCES: {
        let sources = creep.room.find(FIND_SOURCES_ACTIVE);

        for (let otherSource in sources) {
          if (otherSource.id !== source.id) {
            creep.memory.task.collectionTarget = otherSource.id;
            return goTravel(creep, otherSource, '#C0D461');
          }
        }

        creep.memory.blockedLastTick = true;
        break;
      }
      case ERR_NOT_IN_RANGE: {
        goTravel(creep, source, '#C0D461');
        break;
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
      case ERR_NOT_FOUND: {
        errorString = 'ERR_NOT_FOUND';
        break;
      }
      case ERR_INVALID_TARGET: {
        errorString = 'ERR_INVALID_TARGET';
        creep.memory.blockedLastTick = true;
        break;
      }
      case ERR_TIRED: {
        errorString = 'ERR_TIRED';
        break;
      }
      case ERR_NO_BODYPART: {
        errorString = 'ERR_NO_BODYPART';
        break;
      }
    }

    if (errorString) {
      console.log('ERROR: Creep ' + creep.name + ' tried to goCollectEnergy(), but ' + errorString);
    }
  }
};

function goPickupDroppedResources(creep) {
  //  set task
  creep.memory.task = {
    task: TASKS.PICKINGUP
  };

  let pickup = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
  if (pickup === undefined || pickup === null) {
    //  no dropped resources
    return goCollectEnergy(creep);
  }

  const tryPickup = creep.pickup(pickup);
  if (tryPickup === OK) {
    creep.say('🗑️');
  }
  else {
    let errorString;

    switch (tryPickup) {
      //  Actionable errors
      case ERR_FULL: {
        goCollectEnergy();
        break;
      }
      case ERR_NOT_IN_RANGE: {
        goTravel(creep, pickup, '#C0D461');
        break;
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
      case ERR_INVALID_TARGET: {
        errorString = 'ERR_INVALID_TARGET';
        creep.memory.blockedLastTick = true;
        break;
      }
    }

    if (errorString) {
      console.log('ERROR: Creep ' + creep.name + ' tried to goPickupDroppedResources(), but ' + errorString);
    }
  }
}

function goStoreEnergy(creep) {
  const spawn = Game.spawns['CreepFactory'];
  let task = creep.memory.task;
  let storageTarget = task.storageTarget;

  if (storageTarget === undefined || storageTarget === null) {
    goStoreEnergyInExtension(creep);
  }
  else {
    if (storageTarget === spawn.id) {
      goStoreEnergyInSpawner(creep);
    }
    else {
      goStoreEnergyInExtension(creep);
    }
  }
}

function goStoreEnergyInExtension(creep) {
  let task = creep.memory.task;
  let storageTarget = task.storageTarget;
  let storage;

  //  set task
  creep.memory.task.task = TASKS.STORING;

  //  if previously storing
  if (storageTarget !== undefined && storageTarget !== null) {
    //  use previous storage target
    let foundStorages = creep.room.find(FIND_MY_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
      }
    });
    for (let i = 0, ilen = foundStorages.length; i < ilen; i++) {
      let foundStorage = foundStorages[i];
      if (foundStorage.id === task.storageTarget) {
        storage = foundStorage;
        break;
      }
    }
  }
  //  otherwise find the closest extension
  else {
    storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType === STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      }
    });
  }

  //  if all extensions are full
  if (storage === undefined || storage === null) {
    return goStoreEnergyInSpawner(creep);
  }
  else {
    //  remember target
    creep.memory.task.storageTarget = storageTarget = storage.id;
  }

  const tryStoreEnergy = creep.transfer(storage, RESOURCE_ENERGY);
  if (tryStoreEnergy === OK) {
    creep.say('☀️');
  }
  else {
    let errorString;

    switch (tryStoreEnergy) {
      //  Actionable errors
      case ERR_NOT_ENOUGH_RESOURCES: {
        return goCollectEnergy(creep);
      }
      case ERR_FULL: {
        let extensions = creep.room.find(FIND_MY_STRUCTURES, {
          filter: (structure) => {
            return structure.structureType === STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          }
        });

        if (extensions) {
          for (let otherExtension in extensions) {
            if (otherExtension.id !== extension.id) {
              creep.memory.task.storageTarget = otherExtension.id;
              return goTravel(creep, otherExtension, '#66A182');
            }
          }
        }
        else {
          return goStoreEnergyInSpawner(creep);
        }
      }
      case ERR_NOT_IN_RANGE: {
        return goTravel(creep, storage, '#66A182');
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
      case ERR_INVALID_TARGET: {
        errorString = 'ERR_INVALID_TARGET';
        creep.memory.blockedLastTick = true;
        break;
      }
      case ERR_INVALID_ARGS: {
        errorString = 'ERR_INVALID_ARGS';
        break;
      }
    }

    if (errorString) {
      console.log('ERROR: Creep ' + creep.name + ' tried to goStoreEnergyInExtension(), but ' + errorString);
    }
  }
}

function goStoreEnergyInSpawner(creep) {
  const spawn = Game.spawns['CreepFactory'];
  let storage = spawn;

  //  set task
  creep.memory.task.task = TASKS.STORING;

  //  remember target
  creep.memory.task.storageTarget = storageTarget = storage.id;

  const tryStoreEnergy = creep.transfer(storage, RESOURCE_ENERGY);
  if (tryStoreEnergy === OK) {
    creep.say('☀️');
  }
  else {
    let errorString;

    switch (tryStoreEnergy) {
      //  Actionable errors
      case ERR_NOT_ENOUGH_RESOURCES: {
        return goCollectEnergy(creep);
      }
      case ERR_FULL: {
        return goUpgradeController(creep);
      }
      case ERR_NOT_IN_RANGE: {
        return goTravel(creep, storage, '#66A182');
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
      case ERR_INVALID_TARGET: {
        errorString = 'ERR_INVALID_TARGET';
        creep.memory.blockedLastTick = true;
        break;
      }
      case ERR_INVALID_ARGS: {
        errorString = 'ERR_INVALID_ARGS';
        break;
      }
    }

    if (errorString) {
      console.log('ERROR: Creep ' + creep.name + ' tried to goStoreEnergyInSpawner(), but ' + errorString);
    }
  }
};

function goUpgradeController(creep) {
  //  set task
  creep.memory.task = {
    task: TASKS.UPGRADING
  };

  const controller = creep.room.controller;
  const tryUpgradeController = creep.upgradeController(controller);
  if (tryUpgradeController === OK) {
    creep.say('⚡');
  }
  else {
    let errorString;

    switch (tryUpgradeController) {
      //  Actionable errors
      case ERR_NOT_ENOUGH_RESOURCES: {
        return goCollectEnergy(creep);
      }
      case ERR_NOT_IN_RANGE: {
        return goTravel(creep, controller, '#C0D461');
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
      case ERR_INVALID_TARGET: {
        errorString = 'ERR_INVALID_TARGET';
        creep.memory.blockedLastTick = true;
        break;
      }
      case ERR_NO_BODYPART: {
        errorString = 'ERR_NO_BODYPART';
        break;
      }
    }

    if (errorString) {
      console.log('ERROR: Creep ' + creep.name + ' tried to goUpgradeController(), but ' + errorString);
    }
  }
}

function goBuild(creep) {
  //  set task
  creep.memory.task = {
    task: TASKS.BUILDING
  };

  const constructionSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
  if (constructionSite === null) {
    return goRepair(creep);
  }

  const tryBuild = creep.build(constructionSite);
  if (tryBuild === OK) {
    creep.say('👷');
  }
  else {
    let errorString;

    switch (tryBuild) {
      //  Actionable errors
      case ERR_NOT_ENOUGH_RESOURCES: {
        return goCollectEnergy(creep);
      }
      case ERR_NOT_IN_RANGE: {
        return goTravel(creep, constructionSite, '#C0D461');
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
      case ERR_INVALID_TARGET: {
        errorString = 'ERR_INVALID_TARGET';
        creep.memory.blockedLastTick = true;
        break;
      }
      case ERR_NO_BODYPART: {
        errorString = 'ERR_NO_BODYPART';
        break;
      }
    }

    if (errorString) {
      console.log('ERROR: Creep ' + creep.name + ' tried to goBuild(), but ' + errorString);
    }
  }
}

function goRepair(creep) {
  goRepairStructures(creep);
}

function goRepairRoadsThenWalls(creep, repairWalls) {
  let type;

  //  set task
  creep.memory.task = {
    task: TASKS.REPAIRING
  };

  let repairSite;
  if (repairWalls) {
    type = '🧱';
    repairSite = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.hits < MAX_WALL_REPAIR_LEVEL
      }
    });

    if (repairSite === undefined || repairSite === null) {
      return goUpgradeController(creep);
    }
  }
  else {
    type = '🛣️';
    repairSite = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        const structureType = structure.structureType;
        const hitsMax = structure.hitsMax;
        const hits = structure.hits;
        let hitsRatio;
        let readyToRepair = false;

        if (
          structureType !== STRUCTURE_WALL &&
          structureType !== STRUCTURE_RAMPART &&
          hitsMax > 0
        ) {
          hitsRatio = hits / hitsMax;

          readyToRepair = (
            (hitsMax <= 1000 && hitsRatio < .9) ||  //  Wait for structures with less than 1k hits to reach 90% before repairing
            (hitsMax > 1000 && hits < 1000)         //  Only repair up to 1k hits
          );
        }

        return readyToRepair
      }
    });

    if (repairSite === undefined || repairSite === null) {
      return goRepairRoadsThenWalls(creep, true);
    }
  }

  const tryRepair = creep.repair(repairSite);
  if (tryRepair === OK) {
    creep.say('🔧' + type);
  }
  else {
    let errorString;

    switch (tryRepair) {
      //  Actionable errors
      case ERR_NOT_ENOUGH_RESOURCES: {
        return goCollectEnergy(creep);
      }
      case ERR_NOT_IN_RANGE: {
        return goTravel(creep, repairSite, '#C0D461');
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
      case ERR_INVALID_TARGET: {
        errorString = 'ERR_INVALID_TARGET';
        creep.memory.blockedLastTick = true;
        break;
      }
      case ERR_NO_BODYPART: {
        errorString = 'ERR_NO_BODYPART';
        break;
      }
    }

    if (errorString) {
      console.log('ERROR: Creep ' + creep.name + ' tried to goRepairRoadsThenWalls(), but ' + errorString);
    }
  }
}

function goRepairStructures(creep) {
  //  set task
  creep.memory.task = {
    task: TASKS.REPAIRING
  };

  let repairSite = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      let structureType = structure.structureType;
      return (
        structure.hits < structure.hitsMax &&
        structureType !== STRUCTURE_WALL &&
        structureType !== STRUCTURE_RAMPART
      );
    }
  });

  if (repairSite === undefined || repairSite === null) {
    return goRepairRoadsThenWalls(creep);
  }

  const tryRepair = creep.repair(repairSite);
  if (tryRepair === OK) {
    creep.say('🔧🏦');
  }
  else {
    let errorString;

    switch (tryRepair) {
      //  Actionable errors
      case ERR_NOT_ENOUGH_RESOURCES: {
        return goCollectEnergy(creep);
      }
      case ERR_NOT_IN_RANGE: {
        return goTravel(creep, repairSite, '#C0D461');
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
      case ERR_INVALID_TARGET: {
        errorString = 'ERR_INVALID_TARGET';
        creep.memory.blockedLastTick = true;
        break;
      }
      case ERR_NO_BODYPART: {
        errorString = 'ERR_NO_BODYPART';
        break;
      }
    }

    if (errorString) {
      console.log('ERROR: Creep ' + creep.name + ' tried to goRepairStructures(), but ' + errorString);
    }
  }
}

module.exports = {
  TASKS: TASKS,
  goTravel: goTravel,
  goCollectEnergy: goCollectEnergy,
  goPickupDroppedResources: goPickupDroppedResources,
  goStoreEnergy: goStoreEnergy,
  goUpgradeController: goUpgradeController,
  goBuild: goBuild,
  goRepair: goRepair
};
