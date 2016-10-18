'use strict';

import fs from 'fs';

export default class Character {
  constructor(path) {
    this.importFromJSON(path);
  }

  // TODO: this needs to throw errors
  importFromJSON(path) {
    var data = JSON.parse(fs.readFileSync(path));
    this.name = data.name;
    this.playerName = data.playerName;
    this.classes = data.classes;
    this.race = data.race;
    this.alignment = data.alignment;
    this.background = data.background;
    this.personalityTraits = data.personalityTraits;
    this.ideals = data.ideals;
    this.bonds = data.bonds;
    this.flaws = data.flaws;
    this.abilityScores = data.abilityScores;

    this.calculateAbilityMods();

    this.inspiration = data.inspiration;
    this.proficiencyBonus = data.proficiencyBonus;
    this.savingThrows = data.savingThrows;

    this.calculateSavingThrows();

    this.skills = data.skills;

    this.calculateSkills();

    this.hitpoints = data.hitpoints;

    this.initiative = this.abilityScoreMods.dexterity;

    this.speed = data.speed;
    this.hitDice = data.hitDice;
    this.deathSaves = data.deathSaves;
    this.weapons = data.weapons;
    this.inventory = data.inventory;
    this.armor = data.armor;

    this.calculateArmorClass();

    this.money = data.money;
    this.featuresAndTraits = data.featuresAndTraits;
    this.proficiencies = data.proficiencies;
    this.languages = data.languages;
    this.spells = data.spells;
  }

  calculateAbilityMods(){
    this.abilityScoreMods = {};
    this.abilityScoreMods.strength = Math.floor(
      (this.abilityScores.strength - 10) / 2
    );
    this.abilityScoreMods.dexterity = Math.floor(
      (this.abilityScores.dexterity - 10) / 2
    );
    this.abilityScoreMods.constitution = Math.floor(
      (this.abilityScores.constitution - 10) / 2
    );
    this.abilityScoreMods.intelligence = Math.floor(
      (this.abilityScores.intelligence - 10) / 2
    );
    this.abilityScoreMods.wisdom = Math.floor(
      (this.abilityScores.wisdom - 10) / 2
    );
    this.abilityScoreMods.charisma = Math.floor(
      (this.abilityScores.charisma - 10) / 2
    );
  }

  calculateSavingThrows(){
    this.savingThrows.strength.value =
      this.savingThrows.strength.proficient
      ? this.abilityScoreMods.strength + this.proficiencyBonus
      : this.abilityScoreMods.strength;

    this.savingThrows.dexterity.value =
      this.savingThrows.dexterity.proficient
      ? this.abilityScoreMods.dexterity + this.proficiencyBonus
      : this.abilityScoreMods.dexterity;

    this.savingThrows.constitution.value =
      this.savingThrows.constitution.proficient
      ? this.abilityScoreMods.constitution + this.proficiencyBonus
      : this.abilityScoreMods.constitution;

    this.savingThrows.intelligence.value =
      this.savingThrows.intelligence.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.savingThrows.wisdom.value =
      this.savingThrows.wisdom.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;

    this.savingThrows.charisma.value =
      this.savingThrows.charisma.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;
  }

  calculateSkills() {
    this.skills.acrobatics.value =
      this.skills.acrobatics.proficient
      ? this.abilityScoreMods.dexterity + this.proficiencyBonus
      : this.abilityScoreMods.dexterity;

    this.skills.animalHandling.value =
      this.skills.animalHandling.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;

    this.skills.arcana.value =
      this.skills.arcana.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.athletics.value =
      this.skills.athletics.proficient
      ? this.abilityScoreMods.strength + this.proficiencyBonus
      : this.abilityScoreMods.strength;

    this.skills.deception.value =
      this.skills.deception.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;

    this.skills.history.value =
      this.skills.history.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.insight.value =
      this.skills.insight.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;

    this.skills.intimidation.value =
      this.skills.intimidation.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;

    this.skills.investigation.value =
      this.skills.investigation.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.medicine.value =
      this.skills.medicine.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;

    this.skills.nature.value =
      this.skills.nature.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.perception.value =
      this.skills.perception.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;

    this.skills.performance.value =
      this.skills.performance.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;

    this.skills.persuasion.value =
      this.skills.persuasion.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;

    this.skills.religion.value =
      this.skills.religion.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.sleightOfHand.value =
      this.skills.sleightOfHand.proficient
      ? this.abilityScoreMods.dexterity + this.proficiencyBonus
      : this.abilityScoreMods.dexterity;

    this.skills.stealth.value =
      this.skills.stealth.proficient
      ? this.abilityScoreMods.dexterity + this.proficiencyBonus
      : this.abilityScoreMods.dexterity;

    this.skills.survival.value =
      this.skills.survival.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;
  }

  calculateArmorClass() {
    this.armorClass =
      this.abilityScoreMods.dexterity <= 2
      ? this.abilityScoreMods.dexterity
      : 2;

    for (let i = 0; i < this.armor.length; i++) {
      this.armorClass += this.armor[i].armorClass;
    }
  }

  updateAutoValues() {
    calculateAbilityMods();
    calculateSavingThrows();
    calculateSkills();
    calculateArmorClass();
  }

  saveCharacter() {
    var char = {};
    char.name = this.name;
    char.playerName = this.playerName;
    char.classes = this.classes;
    char.race = this.race;
    char.alignment = this.alignment;
    char.background = this.background;
    char.personalityTraits = this.personalityTraits;
    char.ideals = this.ideals;
    char.bonds = this.bonds;
    char.flaws = this.flaws;
    char.abilityScores = this.abilityScores;
    char.inspiration = this.inspiration;
    char.proficiencyBonus = this.proficiencyBonus;
    char.savingThrows = this.savingThrows;
    char.skills = this.skills;
    char.hitpoints = this.hitpoints;
    char.speed = this.speed;
    char.hitDice = this.hitDice;
    char.deathSaves = this.deathSaves;
    char.weapons = this.weapons;
    char.inventory = this.inventory;
    char.armor = this.armor;
    char.money = this.money;
    char.featuresAndTraits = this.featuresAndTraits;
    char.proficiencies = this.proficiencies;
    char.languages = this.languages;
    char.spells = this.spells;

    javascriptObjectToJSONFile(CHARACTER_DIR + char.name + '.json', char);
  }
}

export function javascriptObjectToJSONFile(path, object) {
  try {
    fs.writeFileSync(path, JSON.stringify(object, null, 2));
  } catch (e) {
    console.log('Error in writing file');
  }
}

export function readMap(path) {
  return JSON.parse(fs.readFileSync(path)).map;
}

export function exportMap(characters, path) {
  var map = [];
  for (let i = 0; i < characters.length; i++) {
    var charToExport = {};
    charToExport.filename  = characters[i].name + '.json';
    var label = characters[i].name + ' - ' + characters[i].race;

    for (let i = 0; i < characters[i].classes; i++) {
      label += ' - ' + classes[i].name + ' ' + classes[i].level;
    }

    charToExport.label = label;
    charToExport.classes = characters[i].classes;
    charToExport.race = characters[i].race;
    map.push(charToExport);
  }
  javascriptObjectToJSONFile(path, {map});
}
