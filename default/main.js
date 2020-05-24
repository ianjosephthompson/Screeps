//  Copyright © 2020 Ian Joseph Thompson

//  Modules
const overrides = require('overrides');
const prototypes = require('prototypes');
const roles = require('roles');
const work = require('work');
const spawner = require('spawner');

//  Constants
const ROLES = roles.ROLES;

//  Loop variables
let spawn;
let numCreeps;
let numDefenderCreeps;
let numWorkerCreeps;
let numUpgraderCreeps;
let numBuilderCreeps;
let numCreepsBlockedLastTick;

//  Apply prototype overrides
overrides.apply();
prototypes.apply();

//  MAIN LOOP
module.exports.loop = function () {
  spawn = Game.spawns['CreepFactory'];
  numCreeps = _.sum(Game.creeps, () => true);
  numDefenderCreeps = _.sum(Game.creeps, (creep) => creep.memory.role === ROLES.DEFENDER);
  numWorkerCreeps = _.sum(Game.creeps, (creep) => creep.memory.role === ROLES.WORKER);
  numUpgraderCreeps = _.sum(Game.creeps, (creep) => creep.memory.role === ROLES.UPGRADER);
  numBuilderCreeps = _.sum(Game.creeps, (creep) => creep.memory.role === ROLES.BUILDER);
  numCreepsBlockedLastTick = _.sum(Game.creeps, (creep) => creep.memory.blockedLastTick === true);

  //  TODO
  //  find all rooms
  //  for each room
  //    find all assigned constructs
  //    for each assigned constructs
  //      if construct is not built
  //        assign construction site
  //    find all assigned creeps
  //    for each assigned creep
  //      do work
  //  find all non-assigned creeps
  //    do work

  let tick = Game.time;

  //  Every 10 ticks, report on creeps
  if (tick % 10 === 0) {
    console.log(numDefenderCreeps + ' defenders, ' + numWorkerCreeps + ' workers, ' + numUpgraderCreeps + ' upgraders, and ' + numBuilderCreeps + ' builders.');
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
    numDefenderCreeps: numDefenderCreeps,
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
