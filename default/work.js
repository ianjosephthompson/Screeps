//  Copyright © 2020 Ian Joseph Thompson

//  Modules
const roles = require('roles');
const tasks = require('tasks');

//  Constants
const ROLES = roles.ROLES;
const TASKS = tasks.TASKS;

function work(creep) {
  //  let the dying rest
  if (creep.ticksToLive <= 1) {
    creep.say('💀');
    return;
  }

  //  reset
  creep.memory.blockedLastTick = false;

  //  safety
  if (creep.memory.task === undefined || creep.memory.task.task === undefined) {
    creep.memory.task = {
      task: TASKS.COLLECTING
    };
  }

  //  only spawned creeps can work
  if (!creep.spawning) {
    const creepMemory = creep.memory;
    const role = creepMemory.role;
    const task = creepMemory.task.task;

    // console.log(creep.name + ' is ' + task + ' with capactiy ' + creep.store.getFreeCapacity(RESOURCE_ENERGY));

    if (role === ROLES.DEFENDER) {
      tasks.goAttack(creep);
    }
    //  if empty
    else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      creep.memory.task.storageTarget = undefined;

      if (role === ROLES.WORKER) {
        tasks.goPickupDroppedResources(creep);
        // tasks.goCollectEnergyFromTombstones(creep);
      }
      else {
        tasks.goCollectEnergy(creep);
      }
    }
    //  if full
    else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      creep.memory.task.collectionTarget = undefined;

      //  if creep was collecting or pickingup last tick
      if (task === TASKS.COLLECTING || task === TASKS.PICKINGUP) {
        //  assign emptying task according to role
        if (role === ROLES.WORKER) {
          tasks.goStoreEnergy(creep);
        }
        else if (role === ROLES.UPGRADER) {
          tasks.goUpgradeController(creep);
        }
        else if (role === ROLES.BUILDER) {
          tasks.goBuild(creep);
        }
      }
      //  otherwise continue with previous task
      else if (task === TASKS.STORING) {
        tasks.goStoreEnergy(creep);
      }
      else if (task === TASKS.UPGRADING) {
        tasks.goUpgradeController(creep);
      }
      else if (task === TASKS.BUILDING || task === TASKS.REPAIRING) {
        tasks.goBuild(creep);
      }
    }
    //  if partially-full
    else {
      //  continue with previous task
      if (task === TASKS.STORING) {
        tasks.goStoreEnergy(creep);
      }
      else if (task === TASKS.UPGRADING) {
        tasks.goUpgradeController(creep);
      }
      else if (task === TASKS.BUILDING || task === TASKS.REPAIRING) {
        tasks.goBuild(creep);
      }
      else {
        if (task === TASKS.COLLECTING) {
          tasks.goCollectEnergy(creep);
        }
        else if (task === TASKS.PICKINGUP) {
          tasks.goPickupDroppedResources(creep);
          // tasks.goCollectEnergyFromTombstones(creep);
        }
        else {
          //  collect according to role
          if (role === ROLES.WORKER) {
            tasks.goPickupDroppedResources(creep);
            // tasks.goCollectEnergyFromTombstones(creep);
          }
          else {
            tasks.goCollectEnergy(creep);
          }
        }
      }
    }
  }
}

module.exports = {
  work: work
};
