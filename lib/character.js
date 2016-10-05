'use strict';

export default class Character {
  constructor() {
  }

  import(path) {
    // do stuff
    //JSON.parse(path);
  }

  doStuff(name) {
    console.log(this.name, name);
    return "didstuff to name";
  }
}
