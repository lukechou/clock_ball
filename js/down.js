/**
 * Created by Administrator on 2015/3/29 0029.
 */
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 600;
var MARGIN_LEFT = 50;
var MARGIN_TOP = 10;
var RADIUS = 8;

//若是倒计时效果
var endTime = new Date();
endTime.setTime(endTime.getTime() + 3600*1000);
var curTimeSeconds = 0;

//若是时钟效果
var currentTime;

var balls =[];      //存数彩色的球体，即数字变化时产生的球体
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];   //掉下来的球的颜色，从该集合中随机选取

/*
窗口加载后即运行的方法
1，取得画布，设置画布的宽高  2，获取当前要显示的时间 3，设置一个定时运行器，模拟动画
 */
window.onload = function(){

    var canvas = document.getElementById("canvas");
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    //curTimeSeconds = getTimeSeconds();  //倒计时效果
    currentTime = getCurrentTime();       //时钟效果
    var context = canvas.getContext("2d");

    setInterval(function(){
       render(context);
       update();
   },50);

}
/**
 * 对于倒计时效果，获取当前要显示的时间的方法
 * @returns {number}
 */
function getTimeSeconds(){
    var nowTime = new Date();
    var ret = endTime.getTime() - nowTime.getTime();
    ret = Math.round(ret/1000);

    return ret >= 0 ? ret:0;

}
/**
 * 对于时钟效果，获取当前要显示的时间的方法
 * @returns {Date}
 */
function getCurrentTime(){
    var now = new Date();
    return now;
}
/**
 * 更新画布里的所有图形。
 * 1，若数字发生变化，往保存球的数组里添加求
 * 2，球体下落、超出边框的处理
 */
function update() {

    //倒计时效果
   /* var nextShowTimeSeconds = getTimeSeconds();
    var nextHours = parseInt( nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours * 3600)/60 )
    var nextSeconds = nextShowTimeSeconds % 60

    var curHours = parseInt( curTimeSeconds / 3600);
    var curMinutes = parseInt( (curTimeSeconds - curHours * 3600)/60 )
    var curSeconds = curTimeSeconds % 60*/

    //时钟效果
    var nextTime = getCurrentTime();
    var nextHours = nextTime.getHours();
    var nextMinutes = nextTime.getMinutes();
    var nextSeconds = nextTime.getSeconds();

    var curHours = currentTime.getHours();
    var curMinutes = currentTime.getMinutes();
    var curSeconds = currentTime.getSeconds();

    if(curSeconds != nextSeconds){
        if( parseInt(curHours/10) != parseInt(nextHours/10) ){
            addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
        }
        if( parseInt(curHours%10) != parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
        }

        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }

        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }

        //curTimeSeconds = nextShowTimeSeconds;
        currentTime = nextTime;
    }

    updateBalls();
    //console.log(balls.length);
}
/**
 * 球体下落、超出边框的处理
 * 1，对于下落，y不断减小
 * 2，对于超出边框的球，则从数组中删除（用到了一个技巧）
 */
function updateBalls(){
    for(var i = 0; i < balls.length; i ++){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = - balls[i].vy*0.75;
        }
    }
    /*
    该方法比较巧妙。循坏一次数组，将还在窗口中的球体移到前面，那么没有移动的就是要被删除的。
     */
    var count = 0;
    for(var i = 0;i < balls.length; i ++ ){
        if(balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH){
            balls[count++] = balls[i];
        }
    }
    while(balls.length > Math.min(300,count)){      //将超出我们移动个数的那些球删除。（也不要超出300）
        balls.pop();
    }
}

/**
 * 往数组里面添加球
 * @param x 球的左上角x坐标
 * @param y 球的左上角y坐标
 * @param num   该球表示的数字（0-9）
 */
function addBalls( x , y , num ){

    for( var i = 0  ; i < digit[num].length ; i ++ )
        for( var j = 0  ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                var aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),            //下降的加速度，随机生成
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
                    vy:-5,                          //下降的速度，由下降的加速度决定
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                };

                balls.push( aBall )
            };
}

/**
 * 绘制整个画布中的图形
 * 1，表示时间的几位数字所对应的球体
 * 2，下落的球体
 * @param cxt  画布的context
 */
function render(cxt){
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

    //倒计时效果

    /*var hour = parseInt(curTimeSeconds/3600);
    var minute = parseInt((curTimeSeconds-hour*3600)/60);
    var second = curTimeSeconds%60;*/

    //时钟效果
    var hour = currentTime.getHours();
    var minute = currentTime.getMinutes();
    var second = currentTime.getSeconds();

    var hour_1 = parseInt(hour/10);
    var hour_2 = parseInt(hour%10);
    var minute_1 = parseInt(minute/10);
    var minute_2 = parseInt(minute%10);
    var second_1 = parseInt(second/10);
    var second_2 = parseInt(second%10);

    renderDigit(MARGIN_LEFT,MARGIN_TOP,hour_1,cxt);
    renderDigit(MARGIN_LEFT + 15*(RADIUS +1),MARGIN_TOP,hour_2,cxt);
    renderDigit(MARGIN_LEFT + 30*(RADIUS +1),MARGIN_TOP,10,cxt);
    renderDigit(MARGIN_LEFT + 39*(RADIUS +1),MARGIN_TOP,minute_1,cxt);
    renderDigit(MARGIN_LEFT + 54*(RADIUS +1),MARGIN_TOP,minute_2,cxt);
    renderDigit(MARGIN_LEFT + 69*(RADIUS +1),MARGIN_TOP,10,cxt);
    renderDigit(MARGIN_LEFT + 78*(RADIUS +1),MARGIN_TOP,second_1,cxt);
    renderDigit(MARGIN_LEFT + 93*(RADIUS +1),MARGIN_TOP,second_2,cxt);

    for( var i = 0 ; i < balls.length ; i ++ ){
        cxt.fillStyle=balls[i].color;

        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
        cxt.closePath();
        cxt.fill();
    }
}

/**
 * 绘制一个球的具体方法
 * @param x     球的左上角x坐标
 * @param y     球的左上角y坐标
 * @param num   球表示的数字（0-9）
 * @param cxt   画布的context
 */
function renderDigit(x,y,num,cxt){

    cxt.fillStyle = "rgb(0,102,153)";
    for(var i = 0; i < digit[num].length; i ++){
        for(var j = 0; j < digit[num][i].length; j ++){
            if(digit[num][i][j] == 1){
                cxt.beginPath();
                cxt.arc( x + j*2*(RADIUS+1)+(RADIUS+1) , y + i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI );
                cxt.closePath();

                cxt.fill();
            }
        }
    }
}