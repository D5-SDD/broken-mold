'use strict';

import fs from 'fs';

export default class Character {
  constructor(path) {
    this.data = JSON.parse(fs.readFileSync(path));
    this.strength = {
      value: 12,
      mod: 2
    };
  }

  doStuff(name) {
    return 'didstuff to name: ' + name;
  }
}
