//  Copyright © 2020 Ian Joseph Thompson

const prototypes = {
  Creep: require('prototypes.Creep')
};

function apply() {
  let topLevelObject;

  for (let objectName in prototypes) {
    topLevelObject = global[objectName];

    if (topLevelObject) {
      for (let propertyName in prototypes[objectName]) {
        if (!topLevelObject.prototype[propertyName]) {
          topLevelObject.prototype[propertyName] = prototypes[objectName][propertyName];
        }
      }
    }
  }
};

module.exports = {
  apply: apply
};
