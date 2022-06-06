# timeRecorder

这是一个日常事件的即时记录，以及输出网页以显示各个时间的耗时占比的工具。该工具旨在解决“时间都去哪了”的问题，通过对日常事件耗时的可视化展示，帮助您发现自己的时间规划所存在的不足，为您优化自己的时间规划提供参考。

## 用法

### 记录事件

编辑`timeRecordData.txt`文件。当您需要做一件新事情时，可先往里面新增一行，录入日期，开始时间，事件类型和事件描述；当事情做完后，再修改您新增那一行的结束时间即可。具体需要填入的内容可参考`timeRecordData.txt`文件内部的注释和例子。

### 生成报告

使用`python 3.x`运行`timeRecorder.py`，该程序会生成`result.html`文件（注意是覆盖式生成），该文件即为报告文件，您可从中查看您所记录的日常事件耗时的可视化展示。具体展示样式可参考样例文件。