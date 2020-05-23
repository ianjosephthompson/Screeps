//  Copyright © 2020 Ian Joseph Thompson

//  Modules
const roles = require('roles');
const work = require('work');
const spawner = require('spawner');

//  CONSTS
const ROLES = roles.ROLES;

//  Loop variables
let spawn;
let numCreeps;
let numCreepsBlockedLastTick;
let numWorkerCreeps;
let numUpgraderCreeps;
let numBuilderCreeps;

//  MAIN LOOP
module.exports.loop = function () {
  spawn = Game.spawns['CreepFactory'];
  numCreeps = _.sum(Game.creeps, () => true);
  numWorkerCreeps = _.sum(Game.creeps, (creep) => creep.memory.role === ROLES.WORKER);
  numUpgraderCreeps = _.sum(Game.creeps, (creep) => creep.memory.role === ROLES.UPGRADER);
  numBuilderCreeps = _.sum(Game.creeps, (creep) => creep.memory.role === ROLES.BUILDER);
  numCreepsBlockedLastTick = _.sum(Game.creeps, (creep) => creep.memory.blockedLastTick === true);

  let tick = Game.time;

  //  Every 10 ticks, report on creeps
  if (tick % 10 === 0) {
    console.log(numWorkerCreeps + ' wokers, ' + numUpgraderCreeps + ' upgraders, and ' + numBuilderCreeps + ' builders.');
  } else {
    console.log('.');
  }

  garbageCollect();
  spawnCreeps();
  creepsDoWork();
  checkForBlockedCreeps();
};

function garbageCollect() {
  for (let i in Memory.creeps) {
    if (!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }
}

function spawnCreeps() {
  spawner.spawnCreep({
    spawn: spawn,
    energyAvailable: spawn.room.energyAvailable,
    numCreeps: numCreeps,
    numWorkerCreeps: numWorkerCreeps,
    numUpgraderCreeps: numUpgraderCreeps,
    numBuilderCreeps: numBuilderCreeps,
    numCreepsBlockedLastTick: numCreepsBlockedLastTick
  });
}

function creepsDoWork() {
  for (let name in Game.creeps) {
    const creep = Game.creeps[name];

    work.work(creep);
  }
}

function checkForBlockedCreeps() {
  for (let name in Game.creeps) {
    const creep = Game.creeps[name];

    if (creep.memory.blockedLastTick === true) {
      creep.say('🛑');
    }
  }
}
