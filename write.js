//设置边框大小
var canvasWidth = Math.min(800,$(window).width()-20);
var canvasHeight = canvasWidth;


var isMouseDown = false;
var lastLoc = {x:0,y:0};
var lastTimestamp = 0;
var lastlineWidth = -1;
var maxLineWidth = document.getElementById("range").value;
var minLineWidth = 5;
var maxV = 10;
var minV = 2;
var strokeColor = "black";

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;
$("#controller").css("width",canvasWidth+"px");

drawGrid();
//清除
$("#clear_btn").click(
    function(e){
        context.clearRect( 0 , 0 , canvasWidth, canvasHeight )
        drawGrid()
    }
)
//改变颜色
$(".color_btn").click(
	function(e){
		$(".color_btn").removeClass("color_btn_selected")
		$(this).addClass("color_btn_selected")
		strokeColor = $(this).css("background-color")
	})

//改变粗细
/*function changeWidth(){
	var x = document.getElementById("range").value;
	maxLineWidth = x;
}*/


function beginStroke(point){
	isMouseDown = true;
	lastLoc = windowToCanvas(point.x,point.y);
	lastTimestamp = new Date().getTime();
}
function endStroke(){
	isMouseDown = false;
}
function moveStroke(point){
	var curLoc = windowToCanvas(point.x,point.y);
	var curTimestamp = new Date().getTime();
	var s = calcDistance(curLoc,lastLoc);
	var t =curTimestamp-lastTimestamp;

	var lineWidth = calclineWidth(t,s);
	//draw
	context.beginPath();
	context.moveTo( lastLoc.x , lastLoc.y);
	context.lineTo( curLoc.x , curLoc.y);

	context.strokeStyle = strokeColor;
	context.lineWidth = lineWidth;
	context.lineCap = "round";
	context.lineJoin = "round";
	context.stroke();

	lastLoc = curLoc;
	lastTimestamp = curTimestamp;
	lastlineWidth = lineWidth;
}
//鼠标事件
canvas.onmousedown = function(e){
	e.preventDefault();
	beginStroke({x:e.clientX,y:e.clientY})	
}
canvas.onmouseup = function(e){
	e.preventDefault();
	endStroke();
}
canvas.onmouseout = function(e){
	e.preventDefault();
	endStroke();
}
canvas.onmousemove = function(e){
	e.preventDefault();
	if(isMouseDown){
		moveStroke({x:e.clientX,y:e.clientY})
	}
}

//触控事件
canvas.addEventListener('touchstart',function(e){
	e.preventDefault();
	touch = e.touches[0];
	beginStroke({x:touch.pageX,y:touch.pageY})
});
canvas.addEventListener('touchmove',function(e){
	e.preventDefault();
	if(isMouseDown){
		touch = e.touches[0];
		moveStroke({x:touch.pageX,y:touch.pageY})
	}
});
canvas.addEventListener('touchend',function(e){
	e.preventDefault();
	endStroke();
});


function windowToCanvas(x,y){
    var bbox = canvas.getBoundingClientRect()
    return {x:Math.round(x-bbox.left) , y:Math.round(y-bbox.top)}
}
//计算lineWidth
function calclineWidth(t,s){
	var v = s/t;
	var resultLineWidth;
	if(v<=minV){
		resultLineWidth = document.getElementById("range").value;
	}else if(v>=maxV){
		resultLineWidth = minLineWidth;
	}else{
		resultLineWidth = document.getElementById("range").value-(v-minV)/(maxV-minV)*(document.getElementById("range").value-minLineWidth);
	}
	if(lastlineWidth = -1){
		return resultLineWidth;
	}else{
		return lastlineWidth*2/3+resultLineWidth*1/3;
	}
}

//计算两点之间的距离
function calcDistance(loc1,loc2){
	return Math.sqrt((loc1.x-loc2.x)*(loc1.x-loc2.x)+(loc1.y-loc2.y)*(loc1.y-loc2.y));
}

//画出米字格
function drawGrid(){

	context.save()

	context.strokeStyle = "rgb(230,11,9)";

	context.beginPath();
	context.moveTo(3,3);
	context.lineTo(canvasWidth-3,3);
	context.lineTo(canvasWidth-3,canvasHeight-3);
	context.lineTo(3,canvasHeight-3);
	context.closePath();

	context.lineWidth = 6
	context.stroke();

	context.beginPath();
	context.moveTo(0,0);
	context.lineTo(canvasWidth,canvasHeight);

	context.moveTo(canvasWidth,0);
	context.lineTo(0,canvasHeight);

	context.moveTo(canvasWidth/2,0);
	context.lineTo(canvasWidth/2,canvasHeight);

	context.moveTo(0,canvasHeight/2);
	context.lineTo(canvasWidth,canvasHeight/2);

	context.lineWidth = 1;
	context.stroke();
	context.restore();
}

