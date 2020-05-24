const prototypeOverrides = {
  Creep: require('prototype.Creep')
};

function apply() {
  let topLevelObject;

  for (let objectName in prototypeOverrides) {
    topLevelObject = global[objectName];

    if (topLevelObject) {
      for (let propertyName in prototypeOverrides[objectName]) {
        if (!topLevelObject.prototype['_' + propertyName]) {
          topLevelObject.prototype['_' + propertyName] = prototypeOverrides[objectName][propertyName];
        }
      }
    }
  }
};

module.exports = {
  apply: apply
};
