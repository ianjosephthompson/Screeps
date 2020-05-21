const roles = require('roles');
const tasks = require('tasks');

function work(creep) {
  //  reset
  creep.memory.blockedLastTick = false;

  //  safety
  if (creep.memory.task === undefined || creep.memory.task.task === undefined) {
    creep.memory.task = {
      task: tasks.COLLECTING
    };
  }

  //  only spawned creeps can work
  if (!creep.spawning) {
    let creepMemory = creep.memory;
    let role = creepMemory.role;
    let task = creepMemory.task.task;

    // console.log(creep.name + ' is ' + task + ' with capactiy ' + creep.store.getFreeCapacity(RESOURCE_ENERGY));

    //  if empty
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      if (role === roles.WORKER) {
        tasks.goPickupDroppedResources(creep);
      }
      else {
        tasks.goCollectEnergy(creep);
      }
    }
    //  if full
    else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      //  if creep was collecting or pickingup last tick
      if (task === tasks.COLLECTING || task === tasks.PICKINGUP) {
        //  assign emptying task according to role
        if (role === roles.WORKER) {
          tasks.goStoreEnergy(creep);
        }
        else if (role === roles.UPGRADER) {
          tasks.goUpgradeController(creep);
        }
        else if (role === roles.BUILDER) {
          tasks.goBuild(creep);
        }
      }
      //  otherwise continue with previous task
      else if (task === tasks.STORING) {
        tasks.goStoreEnergy(creep);
      }
      else if (task === tasks.UPGRADING) {
        tasks.goUpgradeController(creep);
      }
      else if (task === tasks.BUILDING || task === tasks.REPAIRING) {
        tasks.goBuild(creep);
      }
    }
    //  if partially-full
    else {
      //  continue with previous task
      if (task === tasks.STORING) {
        tasks.goStoreEnergy(creep);
      }
      else if (task === tasks.UPGRADING) {
        tasks.goUpgradeController(creep);
      }
      else if (task === tasks.BUILDING || task === tasks.REPAIRING) {
        tasks.goBuild(creep);
      }
      else {
        if (task === tasks.COLLECTING) {
          tasks.goCollectEnergy(creep);
        }
        else if (task === tasks.PICKINGUP) {
          tasks.goPickupDroppedResources(creep);
        }
        else {
          //  collect according to role
          if (role === roles.WORKER) {
            tasks.goPickupDroppedResources(creep);
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
