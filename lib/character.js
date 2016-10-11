'use strict';

export default class Character {
  constructor(path) {
    this.path = path;
    this.strength = {
      value: 12,
      mod: 2
    };
  }

  // note: this can't be called import as that's a reserved keyword
  importFromJSON(path) {
    // do stuff
    //JSON.parse(path);
    console.log(path);
  }

  doStuff(name) {
    return 'didstuff to name: ' + name;
  }
}
