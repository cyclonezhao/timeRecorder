# -*- coding: utf-8 -*-
from itertools import groupby
from builtins import map
from collections import Counter
import json

# 读取 timeRecordData.txt 文件
fileinput = open("timeRecordData.txt", "rt")
rawDataLst = fileinput.read().split("\n")
fileinput.close()

# 读取 eventType.txt 文件，限定事件类别
fileinput = open("eventType.txt", "rt")
rawEventTypeLst = fileinput.read().split("\n")
fileinput.close()

# 加工数据
'''
生成两个json: json_data, json_eventType
第一个是数据，形式为:[
	{"date":"xxxx-xx-xx", "eventLst":[
		{"beginTime":"xx:xx","endTime":"xx:xx","eventType":"xx","desc":"xx"}, ...
	]},
	...
]
第二个是事件类型，形式为：{事件类型1:标记颜色1, ...}
'''
# 生成第一个json
_lst = []
for rawData in rawDataLst:
	if rawData.startswith("#"):
		continue;
	rowData = rawData.split("\t")
	_lst.append(rowData)
# 按日期分组，转换eventLst
_grp = groupby(_lst, lambda v: v[0])
_lst = []
for key,value in _grp:
	# endTime 必须以数字开头
	value = list(filter(lambda v: v[2][0].isdigit(), value))
	eventLst = list(map(lambda v: {"beginTime":v[1],"endTime":v[2],"eventType":v[3],"desc":v[4]}, value))
	_lst.append({"date": key, "eventLst": eventLst})
# 按日期排序
_lst = sorted(_lst, key=lambda v: v['date'])
# 转json字符串
json_data = json.dumps(_lst, ensure_ascii=False)
# 生成第二个json
_map = {}
for rawEventType in rawEventTypeLst:
	if rawEventType.startswith("#"):
		continue;
	rowEventType = rawEventType.split("\t")
	_map[rowEventType[0]] = rowEventType[1]
json_eventType = json.dumps(_map, ensure_ascii=False)

# 输出 result.html 文件
resultFile = open("result.html", "w", encoding='utf-8')

# 读取 template.html 文件，作为输出模板
with open("template.html", "r", encoding="utf-8") as f:
	for line in f.readlines():
		if "${json_data}" in line:
			line = line.replace("${json_data}", json_data)
		elif "${json_eventType}" in line:
			line = line.replace("${json_eventType}", json_eventType)
		resultFile.write(line)
resultFile.close()







