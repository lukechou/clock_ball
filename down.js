/**
 * Created by Administrator on 2015/3/29 0029.
 */
var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 600;
var MARGIN_LEFT = 50;
var MARGIN_TOP = 10;
var RADIUS = 8;

var endTime = new Date();
endTime.setTime(endTime.getTime() + 3600*1000);
var curTimeSeconds = 0;

var balls =[];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function(){

    var canvas = document.getElementById("canvas");
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curTimeSeconds = getTimeSeconds();
    var context = canvas.getContext("2d");

    setInterval(function(){
       render(context);
       update();
   },50);

}

function getTimeSeconds(){
    var nowTime = new Date();
    var ret = endTime.getTime() - nowTime.getTime();
    ret = Math.round(ret/1000);

    return ret >= 0 ? ret:0;

}

function update() {
    var nextShowTimeSeconds = getTimeSeconds();

    var nextHours = parseInt( nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours * 3600)/60 )
    var nextSeconds = nextShowTimeSeconds % 60

    var curHours = parseInt( curTimeSeconds / 3600);
    var curMinutes = parseInt( (curTimeSeconds - curHours * 3600)/60 )
    var curSeconds = curTimeSeconds % 60

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

        curTimeSeconds = nextShowTimeSeconds;
    }

    updateBalls();
    console.log(balls.length);
}

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
    var count = 0;
    for(var i = 0;i < balls.length; i ++ ){
        if(balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH){
            balls[count++] = balls[i];
        }
    }
    while(balls.length > Math.min(300,count)){
        balls.pop();
    }
}
function addBalls( x , y , num ){

    for( var i = 0  ; i < digit[num].length ; i ++ )
        for( var j = 0  ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                var aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
                    vy:-5,
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                }

                balls.push( aBall )
            }
}
function render(cxt){
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

    var hour = parseInt(curTimeSeconds/3600);
    var minute = parseInt((curTimeSeconds-hour*3600)/60);
    var second = curTimeSeconds%60;

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