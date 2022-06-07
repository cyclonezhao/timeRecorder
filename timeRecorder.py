# -*- coding: utf-8 -*-
from itertools import groupby
from builtins import map
from collections import Counter
import json
import datetime

# 读取 timeRecordData.txt 文件
fileinput = open("timeRecordData.txt", "rt", encoding='utf-8')
rawDataLst = fileinput.read().split("\n")
fileinput.close()


# 加工数据
'''
生成json: json_data
第一个是数据，形式为:[
	{"date":"xxxx-xx-xx", "eventLst":[
		{"beginTime":"xx:xx","endTime":"xx:xx","eventType":"xx","desc":"xx"}, ...
	]},
	...
]
生成事件类型，形式为：事件类型1,事件类型2,事件类型3,......
'''

# 在  生成json: json_data 的过程中，收集事件类型
eventTypeSet = set()

# 生成json: json_data
_lst = []
for rawData in rawDataLst:
	if not rawData.strip():
		continue
	if rawData.startswith("#"):
		continue;
	rowData = rawData.split("\t")
	_lst.append(rowData)
	
# 生成日期序列，用于识别出没录入事件的空日期
dateLst = []
dt1 = datetime.datetime.strptime(_lst[0][0], '%Y年%m月%d日')
dateLst.append(dt1.strftime("%Y-%m-%d"))
now = datetime.datetime.now()
# 两个日期对象差多少天
diffDay = now - dt1
diffDay = diffDay.days
for i in range(diffDay):
	dt2 = (dt1 + datetime.timedelta(days=i+1))
	dateLst.append(dt2.strftime("%Y-%m-%d"))
	
# 按日期分组，转换eventLst
_grp = {}
for v in _lst:
	_grp.setdefault(datetime.datetime.strptime(v[0], '%Y年%m月%d日').strftime("%Y-%m-%d"), []).append(v)

_lst = []
for date in dateLst:
	eventLst = []
	if date in _grp.keys():
		value = _grp[date]
		# endTime 必须以数字开头
		value = list(filter(lambda v: v[2][0].isdigit(), value))
		# beginTime 大于6点
		value = list(filter(lambda v: int(v[1].split(":")[0]) >= 6, value))
		eventLst = list(map(lambda v: {"beginTime":v[1],"endTime":v[2],"eventType":v[3],"desc":v[4]}, value))
		
		for event in value:
			eventTypeSet.add(event[3])
		
	_lst.append({"date": date, "eventLst": eventLst})
# 按日期排序
_lst = sorted(_lst, key=lambda v: v['date'])
# 转json字符串
json_data = json.dumps(_lst, ensure_ascii=False)


# 生成事件类型
eventTypeStr = ",".join(eventTypeSet)

# 输出 result.html 文件
resultFile = open("result.html", "w", encoding='utf-8')

# 读取 template.html 文件，作为输出模板
with open("template.html", "r", encoding="utf-8") as f:
	for line in f.readlines():
		if "${json_data}" in line:
			line = line.replace("${json_data}", json_data)
		elif "${eventTypeStr}" in line:
			line = line.replace("${eventTypeStr}", eventTypeStr)
		resultFile.write(line)
resultFile.close()







