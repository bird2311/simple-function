/**
 *
 * @authors Your Name (you@example.org)
 * @date    2018-02-11 11:45:41
 * @version $Id$
 * 速度运动函数-animation_speed line-11
 * 时间运动函数-animation_time line-34
 * 加速运动函数-animation_acceleration line-62
 * josn加速运动函数-animation_jsonAcceleration line-90
 * 获取样式-getstyle line-121
 */
function animation_speed(obj,attr,target,speed,callback){
    var a=parseFloat(getstyle(obj,attr));
    var target=parseFloat(target);
    speed=a<target?speed:-speed;
    function fn(){
        a+=speed;
        if(attr=='opacity'){
            obj.style[attr]=a;
            obj.style.filter='alpha(opacity:'+a*100+')';
        }else{
            obj.style[attr]=a+'px';
        }
        if(Math.abs(target-a)<=Math.abs(speed)){
            a=target;
            obj.style[attr]=a+'px';
            obj.style.opacity=a;
            target==a?callback&&callback():'';
        }else{
            requestAnimationFrame(fn);
        }
    }
    fn();
}
function animation_time(obj,attr,target,time,callback){
    var a=parseFloat(getstyle(obj,attr));
    var b=parseFloat(getstyle(obj,attr));
    var target=parseFloat(target);
    var speed=Math.abs(target-b)/time;
    speed=b<target?speed:-speed;
    var time_last=new Date();
    function fn(){
        var time_now=new Date();
        var time_difference=(time_now-time_last)/1000;
        a=b+speed*time_difference;
        if(attr=='opacity'){
            obj.style[attr]=a;
            obj.style.filter='alpha(opacity:'+a*100+')';
        }else{
            obj.style[attr]=a+'px';
        }
        if(Math.abs(a-b)<Math.abs(target-b)){
            requestAnimationFrame(fn);
        }else{
            obj.style[attr]=target+'px';
            obj.style[attr]=target;
            obj.style.filter='alpha(opacity:'+target*100+')';
            target==a?callback&&callback():'';
        }
    }
    fn();
}
function animation_acceleration(obj,attr,target,time,callback){
    var a=parseFloat(getstyle(obj,attr));
    var b=parseFloat(getstyle(obj,attr));
    var target=parseFloat(target);
    var acceleration=Math.abs(target-b)*2/Math.pow(time,2);
    acceleration=b<target?acceleration:-acceleration;
    var time_last=new Date();
    function fn(){
        var time_now=new Date();
        var time_difference=(time_now-time_last)/1000;
        a=b+0.5*acceleration*Math.pow(time_difference,2);
        if(attr=='opacity'){
            obj.style[attr]=a;
            obj.style.filter='alpha(opacity:'+a*100+')';
        }else{
            obj.style[attr]=a+'px';
        }
        if(Math.abs(a-b)<Math.abs(target-b)){
            requestAnimationFrame(fn);
        }else{
            obj.style[attr]=target+'px';
            obj.style[attr]=target;
            obj.style.filter='alpha(opacity:'+target*100+')';
            target==a?callback&&callback():'';
        }
    }
    fn();
}
function animation_jsonAcceleration(obj,json,time,callback){
    var a={},b={},target={},acceleration={};
    for(var attr in json){
    b[attr]=a[attr]=parseFloat(getstyle(obj,attr));
        target[attr]=parseFloat(json[attr]);
        acceleration[attr]=2*Math.abs(target[attr]-a[attr])/Math.pow(time,2);
        acceleration[attr]=target[attr]>a[attr]?acceleration[attr]:-acceleration[attr];
    }
    var time_last=new Date();
    function fn(){
        var time_now=new Date();
        var time_difference=(time_now-time_last)/1000;
        time_difference=time_difference>=time?time:time_difference;
        for(var attr in json){
            a[attr]=b[attr]+0.5*acceleration[attr]*Math.pow(time_difference,2);
            if(attr=='opacity'){
                obj.style[attr]=a[attr];
                obj.style.filter='alpha(opacity:'+a[attr]*100+')';
            }else{
                obj.style[attr]=a[attr]+'px';
            }
        }
        if(a[attr]==target[attr]){
            callback&&callback();
        }else{
            requestAnimationFrame(fn);
        }
    }
    fn();
}
function getstyle(obj,attr){
    return !window.getComputedStyle?obj.currentStyle[attr]:window.getComputedStyle(obj)[attr];
}

