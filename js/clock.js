/**
 * Created by csu412 on 2015/6/6.
 */
$(function(){

    function init(){
        drawLines($('.line-min'), 60, 87);
        drawLines($('.line-hour'), 12, 80);
        drawNumbers($('.number'));
        move();
    }
    init();


    /*
     * 绘制钟表刻度线
     * @param wrap 刻度线的父容器
     * @param total 刻度线的总个数
     * @param translateX 刻度线在x轴方向的偏移量
     */
    function drawLines(wrap, total, translateX){
        var gap = 360/total;
        var strHtml = '';
        for(var i=0; i<total; i++){
            //strHtml += '<li style="transform:rotate('+ (i*gap) + 'deg) translate(' + translateX + 'px,-50%)"></li>';
            var $li = $('<li></li>');
            $li.css('transform','rotate('+ (i*gap) + 'deg) translate(' + translateX + 'px,-50%)');
            wrap.append($li);
        }
       console.log("drawlines...");
    }


    /*
     * 绘制时钟数字
     * @param wrap 数字的父容器
     */
    function drawNumbers(wrap){
        var radius = wrap.width() / 2;

        var strHtml = '';
        for(var i=1; i<=12; i++){
            var myAngle = (i-3)/6 * Math.PI;

            var myX = radius + radius*Math.cos(myAngle), // x=r+rcos(θ)
                myY = radius + radius*Math.sin(myAngle); // y=r+rsin(θ)

            strHtml += '<li style="left:' + myX + 'px; top:'+ myY +'px">' + i + '</li>';
        }
        wrap.html(strHtml);
    }


    /*
     * 钟表走动，转动秒针、分针、时针
     */
    function move(){
        var domHour = $(".hour"),
            domMin = $(".min"),
            domSec = $(".sec");

        setInterval(function(){
            var now = new Date(),
                hour = now.getHours(),
                min = now.getMinutes(),
                sec = now.getSeconds();

            var secAngle = sec*6 - 90,  // s*6-90
                minAngle = min*6 + sec*0.1 - 90,  // m*6+s*0.1-90
                hourAngle = hour*30 + min*0.5 - 90;  // h*30+m*0.5 - 90

            domSec.css('transform', 'rotate(' + secAngle + 'deg)');
            domMin.css('transform', 'rotate(' + minAngle + 'deg)');
            domHour.css('transform', 'rotate(' + hourAngle + 'deg)');

            document.title = hour + ':' + min + ':' + sec;
        },300);
    }

});