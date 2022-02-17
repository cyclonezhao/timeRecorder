String.format = function() {
    if( arguments.length == 0 )
        return null;

    var str = arguments[0];
    for(var i=1;i<arguments.length;i++) {
        var re = new RegExp('\\{' + (i-1) + '\\}','gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
};

function prefixZero(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}


var width = 1280;
var height = 1000;

var label_date_x = 10;
var timeline_x = label_date_x + 110;
var timeline_y = 0;
var timeline_width = 1080; // 6:00~24:00, 18*60min
var timeline_height = 30;
var timeline_gap = timeline_height + 5;

var label_date_height = 15;
var label_date_y = timeline_y + (timeline_height - label_date_height) / 2 + label_date_height;


// 时间刻度
var canvas=document.getElementById('timeScale');
var ctx=canvas.getContext('2d');
var ruler_y = 20;
ctx.moveTo(timeline_x, ruler_y);
ctx.lineTo(timeline_x + timeline_width, ruler_y);
ctx.stroke();
for(var i = 6; i <24; i++){
	var _x = timeline_x + (i-6)*60;
	ctx.fillText(i + ":00", _x - 10, ruler_y-10);
	ctx.moveTo(_x, ruler_y-5);
	ctx.lineTo(_x, ruler_y);
	ctx.stroke();
}

// 图例(legend)
canvas=document.getElementById('legendCanvas');
ctx=canvas.getContext('2d');
var legend_x = 0;
var legend_rect_width = 13;
var legend_gap = 10;
var legend_y = 0;
ctx.font= legend_rect_width + "px Arial";
for(var key in eventTypeMap){
	ctx.fillStyle=eventTypeMap[key];
	ctx.fillRect(legend_x,legend_y,legend_rect_width,legend_rect_width);
	ctx.fillText(key, legend_x + legend_rect_width + 10, legend_y+legend_rect_width-2);
	legend_y += legend_rect_width + legend_gap;
}

// 时间轴（最主要的图）
canvas=document.getElementById('myCanvas');
ctx=canvas.getContext('2d');

for(var index in dataLst){
	var data = dataLst[index];
	drawData(data);
	timeline_y += timeline_gap;
	label_date_y = timeline_y + (timeline_height - label_date_height) / 2 + label_date_height;
}

canvas.onmousemove = function(e){
	// console.log(e.offsetX + " " + e.offsetY)
	// 一个时间轴块的高度:  timeline_gap

	var x = e.offsetX;
	var y = e.offsetY;
	
	// 这个确定 dataLst 的索引
	var dataIndex = Math.floor(y / timeline_gap);

	// 如果点击到时间轴之间的间隔，不处理
	if(y - timeline_gap * dataIndex > timeline_height){
		document.getElementById("infoPanel").innerHTML = "";
		return;
	}

	if(!dataLst[dataIndex]){
		document.getElementById("infoPanel").innerHTML = "";
		return;
	}

	// 如果一条数据里没有事件，不处理
	var eventLst = dataLst[dataIndex].eventLst;
	if(!eventLst || eventLst.length == 0){
		document.getElementById("infoPanel").innerHTML = "";
		return;
	}

	// 计算点击点x轴对应的时间
	var min = x - timeline_x;
	var hour = Math.floor(min/60);
	min = min - hour*60;
	hour += 6;
	for(var index in eventLst){
		var event = eventLst[index];
		if(compareTime(hour, min, event.beginTime) >= 0 && compareTime(hour, min, event.endTime) <= 0){
			var innerHTML = String.format("<p>{0}</p><p>{1} ~ {2}</p><p>描述：{3}</p>", event.eventType, event.beginTime, event.endTime, event.desc);
			document.getElementById("infoPanel").innerHTML = innerHTML;
			return;
		}
	}
	document.getElementById("infoPanel").innerHTML = "";
}

function compareTime(hour, min, timeStr){
	var arr = timeStr.split(":");
	var toHour = parseInt(arr[0]);
	var toMin = parseInt(arr[1]);
	if(hour > toHour){
		return 1;
	}else if(hour < toHour){
		return -1;
	}else{
		if(min > toMin){
			return 1;
		}else if(min < toMin){
			return -1;
		}else{
			return 0;
		}
	}
}

function drawData(data){
	var date = data.date;
	var eventLst = data.eventLst;
	ctx.fillStyle= '#ddd';
	ctx.fillRect(timeline_x, timeline_y, timeline_width, timeline_height);

	ctx.fillStyle= 'black';
	ctx.font= label_date_height + "px Arial";
	ctx.fillText(date, label_date_x, label_date_y);

	for(var index in eventLst){
		var event = eventLst[index];
		drawEvent(event);
	}
}


function drawEvent(event){
	var beginTime = event.beginTime.split(":");
	var endTime = event.endTime.split(":");
	var event_x_begin = timeline_x + (parseInt(beginTime[0]) - 6) * 60 + parseInt(beginTime[1])
	var event_x_end = timeline_x + (parseInt(endTime[0]) - 6) * 60 + parseInt(endTime[1])
	var event_width = event_x_end - event_x_begin;

	ctx.fillStyle= eventTypeMap[event.eventType];
	ctx.fillRect(event_x_begin , timeline_y, event_width, timeline_height);

	// ctx.fillStyle = "black";
	// ctx.font = "10px Arial";
	// ctx.fillText(event.beginTime + " ~ " + event.endTime, event_x_begin, timeline_y + timeline_height - 5);
}