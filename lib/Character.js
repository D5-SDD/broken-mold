'use strict';

import fs from 'fs';

const CHARACTER_MAP_PATH = './test/character_map.json';
const CHARACTER_DIR = './test/Characters/';
const SPELLS_DB = JSON.parse(fs.readFileSync('./lib/db/spellsDB.json'));

export const SKILLS = {
  strength: [
    'athletics'
  ],
  dexterity: [
    'acrobatics',
    'sleightOfHand',
    'stealth'
  ],
  constitution: [],
  intelligence: [
    'arcana',
    'history',
    'investigation',
    'nature',
    'religion'
  ],
  wisdom: [
    'animalHandling',
    'insight',
    'medicine',
    'perception',
    'survival'
  ],
  charisma: [
    'deception',
    'intimidation',
    'performance',
    'persuasion'
  ]
};

export default class Character {
  constructor(path) {
    if (path === 'NEW_CHARACTER') {
      this.createDefaultCharacter();
    } else {
      this.importFromJSON(CHARACTER_DIR + path);
    }
    
    this.updateAutoValues = this.updateAutoValues.bind(this);
  }

  getListOfSpells(spellClasses, spellLevel) {
    var validSpells = [];
    for (let i = 0; i < SPELLS_DB.length; i++) {
      var levelMatch = false;
      var classMatch = false;
      for (let j = 0; j < SPELLS_DB[i].tags.length; j++) {
        for (let k = 0; k < spellClasses.length; k++) {
          if (spellClasses[k].toLowerCase() === SPELLS_DB[i].tags[j]) {
            classMatch = true;
          }
        }
        if (spellLevel === SPELLS_DB[i].tags[j]) {
          levelMatch = true;
        }
      }
      if (levelMatch && classMatch) {
        validSpells.push(SPELLS_DB[i]);
      }
    }
    return validSpells;
  }

  importFromJSON(path){
    var data = JSON.parse(fs.readFileSync(path));
    this.name = data.name;
    this.playerName = data.playerName;
    this.classes = data.classes;
    
    this.calculateProficiencyBonus();
    this.race = data.race;

    this.calculateLabel();

    this.alignment = data.alignment;
    this.experience = data.experience;
    this.background = data.background;
    this.personalityTraits = data.personalityTraits;
    this.ideals = data.ideals;
    this.bonds = data.bonds;
    this.flaws = data.flaws;
    this.abilityScores = data.abilityScores;

    this.abilityScoreMods = {};

    this.calculateAbilityMods();

    this.inspiration = data.inspiration;
    this.savingThrows = data.savingThrows;

    this.calculateSavingThrows();

    this.skills = data.skills;

    this.calculateSkills();
    this.passiveWisdom = 10 + this.skills.perception.value;
    this.hitpoints = data.hitpoints;

    this.initiative = this.abilityScoreMods.dexterity;

    this.speed = data.speed;
    this.hitDice = data.hitDice;
    this.deathSaves = data.deathSaves;
    this.weapons = data.weapons;
    this.inventory = data.inventory;
    this.armor = data.armor;

    this.calculateArmorClass();

    this.currency = data.currency;
    this.featuresAndTraits = data.featuresAndTraits;
    this.proficiencies = data.proficiencies;
    this.languages = data.languages;
    this.spellCastingClass = data.spellCastingClass;
    this.calculateSpellValues();
    this.spells = data.spells;
  }

  calculateLabel() {
    this.label = this.name + ' - ' + this.race;
    for (let i = 0; i < this.classes.length; i++) {
      this.label += ' - ' + this.classes[i].name + ' ' + this.classes[i].level;
    }
  }

  calculateAbilityMods(){
    if (this.abilityScores.strength !== undefined) {
      this.abilityScoreMods.strength = Math.floor((this.abilityScores.strength - 10)/2);
    }
    if (this.abilityScores.dexterity !== undefined) {
      this.abilityScoreMods.dexterity = Math.floor((this.abilityScores.dexterity - 10)/2);
    }
    if (this.abilityScores.constitution !== undefined) {
      this.abilityScoreMods.constitution = Math.floor((this.abilityScores.constitution - 10)/2);
    }
    if (this.abilityScores.intelligence !== undefined) {
      this.abilityScoreMods.intelligence = Math.floor((this.abilityScores.intelligence - 10)/2);
    }
    if (this.abilityScores.wisdom !== undefined) {
      this.abilityScoreMods.wisdom = Math.floor((this.abilityScores.wisdom - 10)/2);
    }
    if (this.abilityScores.charisma !== undefined) {
      this.abilityScoreMods.charisma = Math.floor((this.abilityScores.charisma - 10)/2);
    }
  }

  calculateSavingThrows(){
    this.savingThrows.strength.value = this.savingThrows.strength.proficient
      ? this.abilityScoreMods.strength + this.proficiencyBonus
      : this.abilityScoreMods.strength;
    this.savingThrows.dexterity.value = this.savingThrows.dexterity.proficient
      ? this.abilityScoreMods.dexterity + this.proficiencyBonus
      : this.abilityScoreMods.dexterity;
    this.savingThrows.constitution.value = this.savingThrows.constitution.proficient
      ? this.abilityScoreMods.constitution + this.proficiencyBonus
      : this.abilityScoreMods.constitution;
    this.savingThrows.intelligence.value = this.savingThrows.intelligence.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;
    this.savingThrows.wisdom.value = this.savingThrows.wisdom.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;
    this.savingThrows.charisma.value = this.savingThrows.charisma.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;
  }

  calculateSkills(){
    this.skills.acrobatics.value = this.skills.acrobatics.proficient
      ? this.abilityScoreMods.dexterity + this.proficiencyBonus
      : this.abilityScoreMods.dexterity;

    this.skills.animalHandling.value = this.skills.animalHandling.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;

    this.skills.arcana.value = this.skills.arcana.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.athletics.value = this.skills.athletics.proficient
      ? this.abilityScoreMods.strength + this.proficiencyBonus
      : this.abilityScoreMods.strength;

    this.skills.deception.value = this.skills.deception.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;

    this.skills.history.value = this.skills.history.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.insight.value = this.skills.insight.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;

    this.skills.intimidation.value = this.skills.intimidation.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;

    this.skills.investigation.value = this.skills.investigation.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.medicine.value = this.skills.medicine.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;

    this.skills.nature.value = this.skills.nature.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.perception.value = this.skills.perception.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;

    this.skills.performance.value = this.skills.performance.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;

    this.skills.persuasion.value = this.skills.persuasion.proficient
      ? this.abilityScoreMods.charisma + this.proficiencyBonus
      : this.abilityScoreMods.charisma;

    this.skills.religion.value = this.skills.religion.proficient
      ? this.abilityScoreMods.intelligence + this.proficiencyBonus
      : this.abilityScoreMods.intelligence;

    this.skills.sleightOfHand.value = this.skills.sleightOfHand.proficient
      ? this.abilityScoreMods.dexterity + this.proficiencyBonus
      : this.abilityScoreMods.dexterity;

    this.skills.stealth.value = this.skills.stealth.proficient
      ? this.abilityScoreMods.dexterity + this.proficiencyBonus
      : this.abilityScoreMods.dexterity;

    this.skills.survival.value = this.skills.survival.proficient
      ? this.abilityScoreMods.wisdom + this.proficiencyBonus
      : this.abilityScoreMods.wisdom;
  }

  calculateArmorClass(){
    this.armorClass = 0;
    for (let i = 0; i < this.armor.length; i++) {
      this.armorClass += this.armor[i].armorClass;
      switch (this.armor[i].armorType) {
        case 'light':
          this.armorClass += this.abilityScoreMods.dexterity;
          break;
        case 'medium':
          this.armorClass += this.abilityScoreMods.dexterity <= 2
            ? this.abilityScoreMods.dexterity
            : 2;
          break;
        case 'heavy':
          //potential to auto reduce speed in here
          break;
        case 'shield':
          break;
        default:
          console.log('Error in armor type');
          break;
      }
    }
  }

  calculateSpellValues() {
    switch (this.spellCastingClass) {
      case 'Bard':
        this.spellSaveDC = 8 + this.proficiencyBonus + this.abilityScoreMods.charisma;
        this.spellAttackMod = this.proficiencyBonus + this.abilityScoreMods.charisma;
        break;
      case 'Cleric (trickery)':
        this.spellSaveDC = 8 + this.proficiencyBonus + this.abilityScoreMods.wisdom;
        this.spellAttackMod = this.proficiencyBonus + this.abilityScoreMods.wisdom;
        break;
      case 'Cleric':
        this.spellSaveDC = 8 + this.proficiencyBonus + this.abilityScoreMods.wisdom;
        this.spellAttackMod = this.proficiencyBonus + this.abilityScoreMods.wisdom;
        break;
      case 'Druid':
        this.spellSaveDC = 8 + this.proficiencyBonus + this.abilityScoreMods.wisdom;
        this.spellAttackMod = this.proficiencyBonus + this.abilityScoreMods.wisdom;
        break;
      case 'Paladin':
        this.spellSaveDC = 8 + this.proficiencyBonus + this.abilityScoreMods.charisma;
        this.spellAttackMod = this.proficiencyBonus + this.abilityScoreMods.charisma;
        break;
      case 'Ranger':
        this.spellSaveDC = 8 + this.proficiencyBonus + this.abilityScoreMods.wisdom;
        this.spellAttackMod = this.proficiencyBonus + this.abilityScoreMods.wisdom;
        break;
      case 'Sorcerer':
        this.spellSaveDC = 8 + this.proficiencyBonus + this.abilityScoreMods.charisma;
        this.spellAttackMod = this.proficiencyBonus + this.abilityScoreMods.charisma;
        break;
      case 'Warlock':
        this.spellSaveDC = 8 + this.proficiencyBonus + this.abilityScoreMods.charisma;
        this.spellAttackMod = this.proficiencyBonus + this.abilityScoreMods.charisma;
        break;
      case 'Wizard':
        this.spellSaveDC = 8 + this.proficiencyBonus + this.abilityScoreMods.intelligence;
        this.spellAttackMod = this.proficiencyBonus + this.abilityScoreMods.intelligence;
        break;
      case 'None':
        //Do nothing, since there are no values to edit
        break;
      default:
        console.log('Error in spell casting class');
        break;
    }
  }
  
  calculateEffectiveCharacterLevel() {
    this.effectiveClassLevel = 0;
    for(let i = 0; i < this.classes.length; i++) {
      this.effectiveClassLevel += this.classes[i].level;
    }
  }

  calculateProficiencyBonus() {
    this.calculateEffectiveCharacterLevel();
    this.proficiencyBonus = Math.floor((this.effectiveClassLevel-1)/4) + 2;
  }
  
  updateAutoValues() {
    if (this.name !== undefined && this.race !== undefined) {
      this.calculateLabel();
    }
    this.calculateAbilityMods();
    this.initiative = this.abilityScoreMods.dexterity;
    this.calculateSavingThrows();
    this.calculateSkills();
    this.passiveWisdom = 10 + this.skills.perception.value;
    this.calculateArmorClass();
    this.calculateSpellValues();
    this.calculateProficiencyBonus();
  }

  saveCharacter() {
    var char = {};
    char.name = this.name;
    char.playerName = this.playerName;
    char.classes = this.classes;
    char.race = this.race;
    char.alignment = this.alignment;
    char.experience = this.experience;
    char.background = this.background;
    char.personalityTraits = this.personalityTraits;
    char.ideals = this.ideals;
    char.bonds = this.bonds;
    char.flaws = this.flaws;
    char.abilityScores = this.abilityScores;
    char.inspiration = this.inspiration;
    char.proficiencyBonus = this.proficiencyBonus;
    char.savingThrows = {
      strength:{proficient:this.savingThrows.strength.proficient},
      dexterity:{proficient:this.savingThrows.dexterity.proficient},
      constitution:{proficient:this.savingThrows.constitution.proficient},
      intelligence:{proficient:this.savingThrows.intelligence.proficient},
      wisdom:{proficient:this.savingThrows.wisdom.proficient},
      charisma:{proficient:this.savingThrows.charisma.proficient}
    };
    char.skills = {
      acrobatics:{proficient:this.skills.acrobatics.proficient},
      animalHandling:{proficient:this.skills.animalHandling.proficient},
      arcana:{proficient:this.skills.arcana.proficient},
      athletics:{proficient:this.skills.athletics.proficient},
      deception:{proficient:this.skills.deception.proficient},
      history:{proficient:this.skills.history.proficient},
      insight:{proficient:this.skills.insight.proficient},
      intimidation:{proficient:this.skills.intimidation.proficient},
      investigation:{proficient:this.skills.investigation.proficient},
      medicine:{proficient:this.skills.medicine.proficient},
      nature:{proficient:this.skills.nature.proficient},
      perception:{proficient:this.skills.perception.proficient},
      performance:{proficient:this.skills.performance.proficient},
      persuasion:{proficient:this.skills.persuasion.proficient},
      religion:{proficient:this.skills.religion.proficient},
      sleightOfHand:{proficient:this.skills.sleightOfHand.proficient},
      stealth:{proficient:this.skills.stealth.proficient},
      survival:{proficient:this.skills.survival.proficient}
    };
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
    char.spellCastingClass = this.spellCastingClass;
    char.spells = this.spells;

    javascriptObjectToJSONFile(CHARACTER_DIR + char.name + '.json', char);
  }

  isCharacterValid() {
    if (this.name === undefined) {
      return false;
    } else if (this.classes === []) {
      return false;
    } else if (this.race === undefined) {
      return false;
    }
    return true;
  }

  createDefaultCharacter() {
    this.name = undefined;
    this.playerName = undefined;
    this.classes = [];
    this.effectiveCharacterLevel = 0;
    this.proficiencyBonus = 0;
    this.race = undefined;
    this.label = undefined;
    this.alignment = [];
    this.experience = 0;
    this.background = undefined;
    this.personalityTraits = undefined;
    this.ideals = undefined;
    this.bonds = undefined;
    this.flaws = undefined;
    this.abilityScores = {
      strength:undefined,
      dexterity:undefined,
      constitution:undefined,
      intelligence:undefined,
      wisdom:undefined,
      charisma:undefined
    };
    this.abilityScores = {
      strength: undefined,
      dexterity: undefined,
      constitution: undefined,
      intelligence: undefined,
      wisdom: undefined,
      charisma: undefined
    };
    this.abilityScoreMods = {
      strength:0,
      dexterity:0,
      constitution:0,
      intelligence:0,
      wisdom:0,
      charisma:0
    };
    this.inspiration = 0;
    this.savingThrows = {
      strength:{proficient:false},
      dexterity:{proficient:false},
      constitution:{proficient:false},
      intelligence:{proficient:false},
      wisdom:{proficient:false},
      charisma:{proficient:false}
    };
    this.skills = {
      acrobatics: {proficient:false},
      animalHandling: {proficient:false},
      arcana: {proficient:false},
      athletics: {proficient:false},
      deception: {proficient:false},
      history: {proficient:false},
      insight: {proficient:false},
      intimidation: {proficient:false},
      investigation: {proficient:false},
      medicine: {proficient:false},
      nature: {proficient:false},
      perception: {proficient:false},
      performance: {proficient:false},
      persuasion: {proficient:false},
      religion: {proficient:false},
      slightOfHand: {proficient:false},
      stealth: {proficient:false},
      survival: {proficient:false},
    };
    this.passiveWisdom = 10;
    this.hitpoints = {
      current:undefined,
      maximum:undefined,
      temporary:0
    };
    this.initiative = undefined;
    this.speed = undefined;
    this.hitDice = undefined;
    this.deathSaves = {
      successes:0,
      failures:0
    };
    this.weapons = [];
    this.inventory = [];
    this.armor = [];
    this.money = 0;
    this.featuresAndTraits = [];
    this.proficiencies = [];
    this.languages = [];
    this.spellCastingClass = 'None';
    this.spells = [];
  }
}

export function javascriptObjectToJSONFile(path, object) {
  try {
    fs.writeFileSync(path, JSON.stringify(object, null, 2));
  } catch (e) {
    console.log('Error in writing file');
  }
}
export function readMap() {
  return JSON.parse(fs.readFileSync(CHARACTER_MAP_PATH)).map;
}

export function readCharactersFromMap() {
  var map = readMap();
  var characters = [];
  for (let i = 0; i < map.length; i++) {
    characters.push(
      new Character(map[i].filename)
    );
  }
  return characters;
}

export function exportMap(characters) {
  var map = [];
  for (let i = 0; i < characters.length; i++) {
    var charToExport = {};
    charToExport.filename  = characters[i].name + '.json';
    charToExport.label = this.label;
    charToExport.classes = characters[i].classes;
    charToExport.race = characters[i].race;
    map.push(charToExport);
  }
  javascriptObjectToJSONFile(CHARACTER_MAP_PATH, {map});
}

// Given a bunch of paths, create new character objects, save them to the
// character directory, and export a new map
export function loadCharacters(paths) {
  console.log(paths);
}
