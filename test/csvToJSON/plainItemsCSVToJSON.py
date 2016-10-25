# -*- coding: utf-8 -*-
"""
Created on Mon Oct 24 12:46:38 2016

@author: Sam Davis
"""

csvName = raw_input('Enter csv file name (include .csv): ')
jsonName = raw_input('Enter json file name (include .json): ')

with open(csvName, 'rb') as itemsFile:
  with open(jsonName, 'wb') as jsonFile:
    for row in itemsFile:
      splitRow = row.rstrip().split(',')
      if splitRow[0] != '-':
        jsonFile.write('{\n')
        nameRow = '  \"item\":\"' + splitRow[0] + '\",\n'
        costRow = '  \"cost\":\"' + splitRow[1] + '\",\n'
        weightRow = '  \"weight\":\"' + splitRow[2] + '\"\n'
        jsonFile.write(nameRow)
        jsonFile.write(costRow)
        jsonFile.write(weightRow)
        jsonFile.write('}\n')