'use strict';

var fs = require('fs');

const CHARACTER_DIR = './';
const MAP_DIR = '../character_map.json';
const DB_DIR = '../../lib/db/';
const BACKGROUNDS_DB = JSON.parse(fs.readFileSync(DB_DIR + 'backgroundsDB.json'));
const CLASSES_DB = JSON.parse(fs.readFileSync(DB_DIR + 'classesDB.json'));
const ITEMS_DB = JSON.parse(fs.readFileSync(DB_DIR + 'itemsDB.json'));
const RACES_DB = JSON.parse(fs.readFileSync(DB_DIR + 'racesDB.json'));
const SPELLS_DB = JSON.parse(fs.readFileSync(DB_DIR + 'spellsDB.json'));

function createName(nameLength) {
  var name = '';
  for(let i = 0; i < nameLength; i++) {
    var letter = '';
    var randNum = 0;
    if(i === 0) {
      randNum = Math.floor((Math.random() * 26) + 65);
    }
    else {
      randNum = Math.floor((Math.random() * 26) + 97);
    }
    letter = String.fromCharCode(randNum);
    name += letter;
  }
  return name;
}

function createClass(numClasses) {
  var classes = [];
  for(let i = 0; i < numClasses; i++) {
    var currentClass = {
      name: CLASSES_DB[Math.floor(Math.random()*CLASSES_DB.length)],
      level: Math.floor((Math.random()*20)+1)
    };
    classes.push(currentClass);
  }
  return classes;
}

function calculateEffectiveCharacterLevel(classes) {
  var effectiveCharacterLevel = 0;
  for(let i = 0; i < classes.length; i++) {
    effectiveCharacterLevel += classes[i].level;
  }
  return effectiveCharacterLevel;
}

function calculateProficiencyBonus(effectiveClassLevel) {
  var proficiencyBonus = Math.floor((effectiveClassLevel-1)/4) + 2;
  return proficiencyBonus;
}

function calculateLabel(name, race, classes) {
  var label = name + ' - ' + race;
  for (let i = 0; i < classes.length; i++) {
    label += ' - ' + classes[i].name + ' ' + classes[i].level;
  }
  return label;
}

function createAlignment() {
  var axis1 = ['Lawful', 'Neutral', 'Chaotic'];
  var axis2 = ['Good', 'Neutral', 'Evil'];
  
  var alignment = [
    axis1[Math.floor(Math.random()*axis1.length)],
    axis2[Math.floor(Math.random()*axis2.length)]
  ];
  return alignment;
}

function createAbilityScores() {
  var strength = Math.floor((Math.random()*15)+3);
  var dexterity = Math.floor((Math.random()*15)+3);
  var constitution = Math.floor((Math.random()*15)+3);
  var intelligence = Math.floor((Math.random()*15)+3);
  var wisdom = Math.floor((Math.random()*15)+3);
  var charisma = Math.floor((Math.random()*15)+3);
  return {strength, dexterity, constitution, intelligence, wisdom, charisma};
}

function calculateAbilityMods(abilityScores){
  var strength = Math.floor((abilityScores.strength - 10)/2);
  var dexterity = Math.floor((abilityScores.dexterity - 10)/2);
  var constitution = Math.floor((abilityScores.constitution - 10)/2);
  var intelligence = Math.floor((abilityScores.intelligence - 10)/2);
  var wisdom = Math.floor((abilityScores.wisdom - 10)/2);
  var charisma = Math.floor((abilityScores.charisma - 10)/2);
  return {strength, dexterity, constitution, intelligence, wisdom, charisma};
}

function createSavingThrows() {
  var strength = {
    proficient: false,
    value: 0
  };
  var dexterity = {
    proficient: false,
    value: 0
  };
  var constitution = {
    proficient: false,
    value: 0
  };
  var intelligence = {
    proficient: false,
    value: 0
  };
  var wisdom = {
    proficient: false,
    value: 0
  };
  var charisma = {
    proficient: false,
    value: 0
  };
  var abilityScores = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  var savingThrows = {strength, dexterity, constitution, intelligence, wisdom, charisma};
  for(let i = 0; i < 2; i++) {
    var scoreIndex = Math.floor(Math.random()*abilityScores.length);
    savingThrows[abilityScores[scoreIndex]].proficient = true;
    abilityScores.splice(scoreIndex, 1);
  }
  return savingThrows;
}

function calculateSavingThrows(savingThrows, abilityScoreMods, proficiencyBonus){
  savingThrows.strength.value = savingThrows.strength.proficient
    ? abilityScoreMods.strength + proficiencyBonus
    : abilityScoreMods.strength;
  savingThrows.dexterity.value = savingThrows.dexterity.proficient
    ? abilityScoreMods.dexterity + proficiencyBonus
    : abilityScoreMods.dexterity;
  savingThrows.constitution.value = savingThrows.constitution.proficient
    ? abilityScoreMods.constitution + proficiencyBonus
    : abilityScoreMods.constitution;
  savingThrows.intelligence.value = savingThrows.intelligence.proficient
    ? abilityScoreMods.intelligence + proficiencyBonus
    : abilityScoreMods.intelligence;
  savingThrows.wisdom.value = savingThrows.wisdom.proficient
    ? abilityScoreMods.wisdom + proficiencyBonus
    : abilityScoreMods.wisdom;
  savingThrows.charisma.value = savingThrows.charisma.proficient
    ? abilityScoreMods.charisma + proficiencyBonus
    : abilityScoreMods.charisma;
}

function createSkills() {
  var acrobatics = {
    proficient: false,
    value: 0
  };
  var animalHandling = {
    proficient: false,
    value: 0
  };
  var arcana = {
    proficient: false,
    value: 0
  };
  var athletics = {
    proficient: false,
    value: 0
  };
  var deception = {
    proficient: false,
    value: 0
  };
  var history = {
    proficient: false,
    value: 0
  };
  var insight = {
    proficient: false,
    value: 0
  };
  var intimidation = {
    proficient: false,
    value: 0
  };
  var investigation = {
    proficient: false,
    value: 0
  };
  var medicine = {
    proficient: false,
    value: 0
  };
  var nature = {
    proficient: false,
    value: 0
  };
  var perception = {
    proficient: false,
    value: 0
  };
  var performance = {
    proficient: false,
    value: 0
  };
  var persuasion = {
    proficient: false,
    value: 0
  };
  var religion = {
    proficient: false,
    value: 0
  };
  var sleightOfHand = {
    proficient: false,
    value: 0
  };
  var stealth = {
    proficient: false,
    value: 0
  };
  var survival = {
    proficient: false,
    value: 0
  };
  var skillNames = ['acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception', 'history', 
    'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception', 'performance', 
    'persuasion', 'religion', 'sleightOfHand', 'stealth', 'survival'];
  var skills = {acrobatics, animalHandling, arcana, athletics, deception, history, insight, 
    intimidation, investigation, medicine, nature, perception, performance, persuasion, religion, 
    sleightOfHand, stealth, survival};
  for(let i = 0; i < Math.floor((Math.random()*3)+2); i++) {
    var skillIndex = Math.floor(Math.random()*skillNames.length);
    skills[skillNames[skillIndex]].proficient = true;
    skillNames.splice(skillIndex, 1);
  }
  return skills;
}

function calculateSkills(skills, abilityScoreMods, proficiencyBonus){
  skills.acrobatics.value = skills.acrobatics.proficient
    ? abilityScoreMods.dexterity + proficiencyBonus
    : abilityScoreMods.dexterity;

  skills.animalHandling.value = skills.animalHandling.proficient
    ? abilityScoreMods.wisdom + proficiencyBonus
    : abilityScoreMods.wisdom;

  skills.arcana.value = skills.arcana.proficient
    ? abilityScoreMods.intelligence + proficiencyBonus
    : abilityScoreMods.intelligence;

  skills.athletics.value = skills.athletics.proficient
    ? abilityScoreMods.strength + proficiencyBonus
    : abilityScoreMods.strength;

  skills.deception.value = skills.deception.proficient
    ? abilityScoreMods.charisma + proficiencyBonus
    : abilityScoreMods.charisma;

  skills.history.value = skills.history.proficient
    ? abilityScoreMods.intelligence + proficiencyBonus
    : abilityScoreMods.intelligence;

  skills.insight.value = skills.insight.proficient
    ? abilityScoreMods.wisdom + proficiencyBonus
    : abilityScoreMods.wisdom;

  skills.intimidation.value = skills.intimidation.proficient
    ? abilityScoreMods.charisma + proficiencyBonus
    : abilityScoreMods.charisma;

  skills.investigation.value = skills.investigation.proficient
    ? abilityScoreMods.intelligence + proficiencyBonus
    : abilityScoreMods.intelligence;

  skills.medicine.value = skills.medicine.proficient
    ? abilityScoreMods.wisdom + proficiencyBonus
    : abilityScoreMods.wisdom;

  skills.nature.value = skills.nature.proficient
    ? abilityScoreMods.intelligence + proficiencyBonus
    : abilityScoreMods.intelligence;

  skills.perception.value = skills.perception.proficient
    ? abilityScoreMods.wisdom + proficiencyBonus
    : abilityScoreMods.wisdom;

  skills.performance.value = skills.performance.proficient
    ? abilityScoreMods.charisma + proficiencyBonus
    : abilityScoreMods.charisma;

  skills.persuasion.value = skills.persuasion.proficient
    ? abilityScoreMods.charisma + proficiencyBonus
    : abilityScoreMods.charisma;

  skills.religion.value = skills.religion.proficient
    ? abilityScoreMods.intelligence + proficiencyBonus
    : abilityScoreMods.intelligence;

  skills.sleightOfHand.value = skills.sleightOfHand.proficient
    ? abilityScoreMods.dexterity + proficiencyBonus
    : abilityScoreMods.dexterity;

  skills.stealth.value = skills.stealth.proficient
    ? abilityScoreMods.dexterity + proficiencyBonus
    : abilityScoreMods.dexterity;

  skills.survival.value = skills.survival.proficient
    ? abilityScoreMods.wisdom + proficiencyBonus
    : abilityScoreMods.wisdom;
}

function createHitPoints() {
  var maximum = Math.floor((Math.random()*30)+10);
  var current = Math.floor((Math.random()*maximum));
  var temporary = 0;
  return {maximum, current, temporary};
}

function createInventory(numItems) {
  var inventory = [];
  for(let i = 0; i < numItems; i++){
    inventory.push(ITEMS_DB[Math.floor(Math.random()*ITEMS_DB.length)]);
  }
  return inventory;
}

function calculateArmorClass(armor){
  var armorClass = 0;
  for (let i = 0; i < armor.length; i++) {
    armorClass += armor[i].armorClass;
    switch (armor[i].armorType) {
      case 'light':
        armorClass += abilityScoreMods.dexterity;
        break;
      case 'medium':
        armorClass += abilityScoreMods.dexterity <= 2
          ? abilityScoreMods.dexterity
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
  return armorClass;
}

function createCurrency() {
  var platinum = Math.floor(Math.random()*100);
  var gold = Math.floor(Math.random()*10);
  var electrum = Math.floor(Math.random()*5);
  var silver = Math.floor(Math.random()*10);
  var copper = Math.floor(Math.random()*10);
  
  return {platinum, gold, electrum, silver, copper}
}

function createSpellCastingClass() {
  var spellCastingClasses = ['Bard', 'Cleric (trickery)', 'Cleric', 'Druid', 'Paladin', 'Ranger', 
    'Sorcerer', 'Warlock', 'Wizard'];
  return spellCastingClasses[Math.floor(Math.random()*spellCastingClasses.length)];
}

function calculateSpellValues(spellCastingClass, spellSaveDC, spellAttackMod, abilityScoreMods, 
  proficiencyBonus) {
  switch (spellCastingClass) {
    case 'Bard':
    case 'Paladin':
    case 'Sorcerer':
    case 'Warlock':
      spellSaveDC = 8 + proficiencyBonus + abilityScoreMods.charisma;
      spellAttackMod = proficiencyBonus + abilityScoreMods.charisma;
      break;
    case 'Cleric (trickery)':
    case 'Cleric':
    case 'Druid':
    case 'Ranger':
      spellSaveDC = 8 + proficiencyBonus + abilityScoreMods.wisdom;
      spellAttackMod = proficiencyBonus + abilityScoreMods.wisdom;
      break;
    case 'Wizard':
      spellSaveDC = 8 + proficiencyBonus + abilityScoreMods.intelligence;
      spellAttackMod = proficiencyBonus + abilityScoreMods.intelligence;
      break;
    case 'None':
      //Do nothing, since there are no values to edit
      break;
    default:
      console.log('Error in spell casting class');
      break;
  }
}

function createSpellList(numSpells) {
  var spellList = [];
  for(let i = 0; i < numSpells; i++) {
    spellList.push(SPELLS_DB[Math.floor(Math.random()*SPELLS_DB.length)]);
  }
  return spellList;
}

function javascriptObjectToJSONFile(path, object) {
  try {
    fs.writeFileSync(path, JSON.stringify(object, null, 2));
  } catch (e) {
    console.log('Error in writing file');
  }
}

function generateCharacter() {
  var name = createName(Math.floor((Math.random()*10)+1));
  var playerName = 'Broken Mold';
  var classes = createClass(Math.floor((Math.random()*3)+1));
  
  var effectiveCharacterLevel = calculateEffectiveCharacterLevel(classes);
  var proficiencyBonus = calculateProficiencyBonus(effectiveCharacterLevel);
  var race = RACES_DB[Math.floor(Math.random()*RACES_DB.length)];

  var label = calculateLabel(name, race, classes);

  var alignment = createAlignment();
  var experience = Math.floor(Math.random()*5000);
  var background = BACKGROUNDS_DB[Math.floor(Math.random()*BACKGROUNDS_DB.length)];
  var personalityTraits = 'Personality Traits';
  var ideals = 'Ideals';
  var bonds = 'Bonds';
  var flaws = 'Flaws';
  var abilityScores = createAbilityScores();

  var abilityScoreMods = calculateAbilityMods(abilityScores);

  var inspiration = 0;
  var savingThrows = createSavingThrows();

  calculateSavingThrows(savingThrows, abilityScoreMods, proficiencyBonus);

  var skills = createSkills();

  calculateSkills(skills, abilityScoreMods, proficiencyBonus);
  var passiveWisdom = 10 + skills.perception.value;
  var hitpoints = createHitPoints();

  var initiative = abilityScoreMods.dexterity;

  var speed = (Math.floor(Math.random()*5)*5)+20;
  var hitDice = '1d8';
  var deathSaves = {
    successes: 0,
    failures: 0
  };
  var weapons = {
    name: 'longsword',
    attackBonus: 4,
    damage: '1d8+2',
    type: 'slashing',
    properties: [
      'versatile(1d10)'
    ]
  };
  var inventory = createInventory(Math.floor((Math.random()*10) + 10));
  var armor = {
    name: 'studded leather armor',
    armorClass: 12,
    armorType: 'light',
    strength: 0,
    stealthDisadvantage: false
  };

  var armorClass = calculateArmorClass(armor);

  var currency = createCurrency();
  var featuresAndTraits = [{
    name: 'Test Character',
    description: 'You have no purpose in life but to test this program'
  }];
  var proficiencies = [
    'Light Armor',
    'Simple Weapons'
  ];
  var languages = [
    'Common'
  ];
  var spellCastingClass = createSpellCastingClass();
  var spellSaveDC = 0;
  var spellAttackMod = 0;
  calculateSpellValues(spellCastingClass, spellSaveDC, spellAttackMod, abilityScoreMods, 
    proficiencyBonus);
  var spells = createSpellList(Math.floor(Math.random()*11));
  
  
  var character = {};
  character.name = name;
  character.playerName = playerName;
  character.classes = classes;
  character.race = race;
  character.alignment = alignment;
  character.experience = experience;
  character.background = background;
  character.personalityTraits = personalityTraits;
  character.ideals = ideals;
  character.bonds = bonds;
  character.flaws = flaws;
  character.abilityScores = abilityScores;
  character.inspiration = inspiration;
  character.proficiencyBonus = proficiencyBonus;
  character.savingThrows = {
    strength:{proficient:savingThrows.strength.proficient},
    dexterity:{proficient:savingThrows.dexterity.proficient},
    constitution:{proficient:savingThrows.constitution.proficient},
    intelligence:{proficient:savingThrows.intelligence.proficient},
    wisdom:{proficient:savingThrows.wisdom.proficient},
    charisma:{proficient:savingThrows.charisma.proficient}
  };
  character.skills = {
    acrobatics:{proficient:skills.acrobatics.proficient},
    animalHandling:{proficient:skills.animalHandling.proficient},
    arcana:{proficient:skills.arcana.proficient},
    athletics:{proficient:skills.athletics.proficient},
    deception:{proficient:skills.deception.proficient},
    history:{proficient:skills.history.proficient},
    insight:{proficient:skills.insight.proficient},
    intimidation:{proficient:skills.intimidation.proficient},
    investigation:{proficient:skills.investigation.proficient},
    medicine:{proficient:skills.medicine.proficient},
    nature:{proficient:skills.nature.proficient},
    perception:{proficient:skills.perception.proficient},
    performance:{proficient:skills.performance.proficient},
    persuasion:{proficient:skills.persuasion.proficient},
    religion:{proficient:skills.religion.proficient},
    sleightOfHand:{proficient:skills.sleightOfHand.proficient},
    stealth:{proficient:skills.stealth.proficient},
    survival:{proficient:skills.survival.proficient}
  };
  character.hitpoints = hitpoints;
  character.speed = speed;
  character.hitDice = hitDice;
  character.deathSaves = deathSaves;
  character.weapons = weapons;
  character.inventory = inventory;
  character.armor = armor;
  character.currency = currency;
  character.featuresAndTraits = featuresAndTraits;
  character.proficiencies = proficiencies;
  character.languages = languages;
  character.spellCastingClass = spellCastingClass;
  character.spells = spells;

  javascriptObjectToJSONFile(CHARACTER_DIR + character.name + '.json', character);
  return character;
}

function updateMap(characters) {
  var characterMaps = [{    
    filename : 'Itzal.json',
    label : 'Itzal - Human - Rogue 3',
    classes : [{
        name : 'Rogue',
        level : 3
      }
    ],
    "race" : "Human"
  }];
  for(let i = 0; i < characters.length; i++){
    characterMaps.push({
      filename: characters[i].name + '.json',
      label: calculateLabel(characters[i].name, characters[i].race, characters[i].classes),
      classes: characters[i].classes,
      race: characters[i].race
    });
  }
  var map = {
    map: characterMaps
  }
  try {
    fs.writeFileSync(MAP_DIR, JSON.stringify(map, null, 2));
  } catch (e) {
    console.log('Error in writing file');
  }
}

(function main() {
  var numCharacters = process.argv[2];
  var characters = [];
  for(let i = 0; i < numCharacters; i++) {
    characters.push(generateCharacter());
  }
  updateMap(characters);
})();