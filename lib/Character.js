'use strict';

import fs from 'fs';

export default class Character {
  constructor(path) {
    importFromJSON(path);
  }

  importFromJSON(path){
    var data = JSON.parse(fs.readFileSync(path));
    console.log(data);
    this.name = data.name;
    
  }
}

export function readMap(path) {
  console.log(path);
}

export function updateMap() {
  return;
}
