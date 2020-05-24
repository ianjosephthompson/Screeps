//  Copyright © 2020 Ian Joseph Thompson

const overrides = {
  Creep: require('overrides.Creep')
};

function apply() {
  let topLevelObject;

  for (let objectName in overrides) {
    topLevelObject = global[objectName];

    if (topLevelObject) {
      for (let propertyName in overrides[objectName]) {
        if (!topLevelObject.prototype['_' + propertyName]) {
          topLevelObject.prototype['_' + propertyName] = topLevelObject.prototype[propertyName];
          topLevelObject.prototype[propertyName] = overrides[objectName][propertyName];
        }
      }
    }
  }
};

module.exports = {
  apply: apply
};
