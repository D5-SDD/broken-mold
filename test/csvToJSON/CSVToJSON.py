# -*- coding: utf-8 -*-
"""
Created on Thu Oct 20 18:15:45 2016

@author: Sam Davis
"""

import json

csvName = raw_input('Enter csv file name (include .csv): ')
jsonName = raw_input('Enter json file name (include .json): ')

items = []

with open(csvName, 'rb') as itemsFile:
  for row in itemsFile:
    splitRow = row.rstrip().split(',')
    if splitRow[0] != '-':
      currentItem = {
      'item':splitRow[0],
      'cost':splitRow[1],
      'weight':splitRow[2]
      }
      items.append(currentItem)

sortedItems = sorted(items, key=lambda item: item['item'])

with open(jsonName, 'wb') as jsonFile:
  for i in sortedItems:
    json.dump(i, jsonFile)