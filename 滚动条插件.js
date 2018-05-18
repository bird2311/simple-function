/**
 *
 * @authors Your Name (you@example.org)
 * @date    2018-03-27 19:52:11
 * @version $Id$
 */
// 1 maxheight>target -overflow=hidden
// 2 scroll hover change color
// 3 scroll click
// 4 scroll drag
// 5 page mousewheel
//function scrollbar(显示框,内容框,显示框的position) {}
function scrollbar(obj_show,obj_content) {
    obj_content.style.position='relative';
    //获取各种高度

    var ochh=parseFloat(getstyle(obj_content,'height'));
    var ocww=parseFloat(getstyle(obj_content,'width'));

    var os={};
    os.hh=parseFloat(getstyle(obj_show,'height'));
    os.ww=parseFloat(getstyle(obj_show,'width'));
    os.pt=parseFloat(getstyle(obj_show,'padding-top'));//padding-top
    os.pr=parseFloat(getstyle(obj_show,'padding-right'));//padding-right

    os.po=getstyle(obj_show,'position');
    if(os.po=='static'){
        obj_show.style.position='relative';
    };
    var scrolltop=0;//初始滚动条top
    var octop=0;//初始内容框top
    if(ochh<=os.hh){return;}
    //框架大于内容，隐藏内容
    obj_show.style.overflow='hidden';
    //创建外scroll并赋予css
    var scrollbar=document.createElement('div');
    scrollbar.style.cssText+='position: absolute;right:'+os.pr+'px;top:'+os.pt+'px;width:'+os.ww/20+'px;height:'+os.hh+'px;max-width:10px;backgroundColor:#f2f2f2;';
    //创建内scroll并赋予css
    var scroll=document.createElement('div');
    // scroll.className='scroll';
    scroll.style.cssText='position: absolute;left: 0;top: 0;width: 100%;height:'+Math.pow(os.hh,2)/ochh+'px;background-color: white;border:1px solid #d4d4d4;box-sizing: border-box;';
    var shh=Math.pow(os.hh,2)/ochh;
    //scroll载入文档
    scrollbar.appendChild(scroll);
    obj_show.appendChild(scrollbar);
    //click
    scrollbar.onclick=function(e) {
        var ev=e||window.event;
        ev.target=ev.target||ev.srcElement;//兼容
        if(ev.target.className=='scroll'){
            return;
        }else{
            var clicky=ev.clientY-shh/2-obj_show.getBoundingClientRect().y;
            clicky=limitscroll(clicky);
            scroll.style.top=clicky+'px';
            scrolltop=clicky;
            obj_content.style.top=clicky/os.hh*-ochh+'px';
            octop=clicky/os.hh*-ochh;
            ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;//阻止冒泡
        }
    }
    //hover
    scrollbar.onmouseenter=function() {
        this.style.backgroundColor='#bfbfbf';
    }
    scrollbar.onmouseleave=function() {
        this.style.backgroundColor='#f2f2f2';
    }
    //drag
    scroll.onmousedown=function(e) {
        var ev=e||window.event;
        var downy=ev.clientY-scroll.offsetTop;
        document.onmousemove=function(e) {
            var ev=e||window.event;
            var distance=ev.clientY-downy;
            scrollbar.style.backgroundColor='#bfbfbf';
            distance=limitscroll(distance);
            scroll.style.top=distance+'px';
            scrolltop=distance;
            obj_content.style.top=scrolltop/os.hh*-ochh+'px';
            octop=scrolltop/os.hh*-ochh;
            return false;//阻止默认事件
        }
        document.onmouseup=function() {

            scrollbar.style.backgroundColor='#f2f2f2';
            document.onmousemove='';
            document.onmouseup='';
        }
    }

    //页面滚动
    var obj_content_top=0;
    addEvent(obj_show,'mousewheel',function(e) {
        var ev=e||window.event;
        obj_content_top=octop+ev.wheel/12;
        obj_content_top=limitframe(obj_content_top);
        obj_content.style.top=obj_content_top+'px';
        octop=obj_content_top;
        //联动滚动条
        scroll.style.top=obj_content_top/-ochh*os.hh+'px';
        scrolltop=obj_content_top/-ochh*os.hh;
    },false);

    //限制滚动条函数
    function limitscroll(num) {
        num=num<0?0:num;
        num=num>os.hh-shh?os.hh-shh:num;
        return num;
    }
    //限制滚动框函数
    function limitframe(num) {
        num=num>0?0:num;
        num=num<os.hh-ochh?os.hh-ochh:num;
        return num;
    }
}





//注册事件
function addEvent(obj,type,fn,boolean) {
    boolean=boolean||false;
    obj[type+fn.name+boolean]=handlefunc;//把handlefunc变为obj的属性
    if(obj.addEventListener){
        obj.addEventListener(type,obj[type+fn.name+boolean],boolean);//注册事件  chrome firefox
        if(type=='mousewheel'){
            obj.addEventListener('DOMMouseScroll',obj[type+fn.name+boolean],boolean)// 注册事件 firefox
        }
    }else{
        obj.attachEvent('on'+type,obj[type+fn.name+boolean]);//注册事件 兼容ie
    }

    function handlefunc(e) {
        var ev=e||window.event;//参数e  兼容ie
        ev.target=ev.target||ev.srcElement//兼容委托事件
        ev.wheel=ev.wheelDelta?ev.wheelDelta:ev.detail*-40;//兼容滚轮参数
        fn.call(obj,ev);//兼容ie this指向和传参e
        ev.preventDefault?ev.preventDefault():ev.returnValue=false;//阻止默认事件 兼容
    }
}

function removeEvent(obj,type,fn,boolean) {
    boolean=boolean||false;
    if(obj.removeEventListener){
        obj.removeEventListener(type,obj[type+fn.name+boolean],boolean);
        if(type=='mousewheel'){
            obj.removeEventListener('DOMMouseScroll',obj[type+fn.name+boolean],boolean);
        }
    }else{
        obj.detachEvent('on'+type,obj[type+fn.name+boolean]);
    }
}

function getstyle(obj,attr) {
    return !window.getComputedStyle?obj.currentStyle[attr]:window.getComputedStyle(obj)[attr];
}
