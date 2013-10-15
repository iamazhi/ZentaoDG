var config = 
{
    animateSpeed     : 'fast',  // 动画速度
    movingWindow     : null,    // 当前正在移动的窗口
    activeWindow     : null,    // 当前激活的窗口
    appIconRoot      : 'img/',  // 应用图标库目录地址
    windowHeadHeight : 38,      // 应用窗口标题栏高度
    defaultWindowPos : {x : 110, y : 20},
    windowIdStrTemp  : 'win-{0}',
    getNextDefaultWinPos : function() 
        {
           this.defaultWindowPos = {x : this.defaultWindowPos.x + 20, y : this.defaultWindowPos.y + 20};
           return this.defaultWindowPos;
        },
    windowIdSeed     : 0,
    // 获取下一个新建窗口编号
    getNewWindowId   : function() { return this.windowIdSeed++; },
    windowZIndexSeed : 0,
    // 获取下一个新建窗口z-index
    getNewZIndex   : function() { return this.windowZIndexSeed++; },
    // window模版
    windowHtmlTemp : ''
};

$(function()
{
    $('#allAppsBtn').click(toggleAllApps);
    $('#closeAllApps').click(hideAllApps);

    initWindowMovable();
    initWindowActivable();
});

function toggleAllApps()
{
    if($('#allApps').hasClass('show')) hideAllApps(); else showAllApps();
}

function hideAllApps()
{
    $('#allAppsBtn').removeClass('active');
    $('#allApps').fadeOut(config.animateSpeed).removeClass('show');
    $('#deskContainer').fadeIn(config.animateSpeed);
}

function showAllApps()
{
    $('#allAppsBtn').addClass('active');
    $('#deskContainer').fadeOut(config.animateSpeed);
    $('#allApps').fadeIn(config.animateSpeed).addClass('show');
}

// == 窗口对象 ==
// 构造函数
function Windowx(appid, url, title, type, display, size, position)
{
    this.id       = config.getNewWindowId();
    this.idStr    = config.windowIdStrTemp.format(this.id);
    this.zindex   = config.getNewZIndex();
    this.appid    = appid;
    this.url      = url;
    this.title    = title ? title : '';
    this.type     = type ? type : 'iframe';
    this.display  = display ? display : 'normal';
    this.size     = size ? size : {width:500,height:438};
    this.position = position ? position : config.getNextDefaultWinPos();
    this.iconimg  = config.appIconRoot + 'app-' + this.appid + '.png';

    this.toHtml   = function()
    {
        // todo: 根据模版生成窗口html
    };
}

// 第一次显示窗口
function openWindow(windowx)
{
    $("#deskContainer").append(windowx.toHtml());
    activeWindow(windowx.idStr);
}

// == 窗口事件 ==
// 处理拖放窗口事件
// 窗口内任何包含类 '.movable' 都可以相应鼠标拖动事件来移动窗口
function initWindowMovable()
{
    $(document).on('mousedown', '.movable,.window-movable .window-head', function(event)
    {
        config.movingWindow = $(this).closest('.window');
        var mwPos = config.movingWindow.position();
        config.movingWindow.data('mouseOffset', {x:event.pageX-mwPos.left,y:event.pageY-mwPos.top}).addClass('window-moving');
    }).mousemove(function(event)
    {
        if(config.movingWindow && config.movingWindow.hasClass('window-moving'))
        {
            var offset = config.movingWindow.data('mouseOffset');
            config.movingWindow.css(
            {
              left: event.pageX-offset.x,
              top: event.pageY-offset.y
            });
        }
    }).mouseup(function()
    {
        $('.window.window-moving').removeClass('window-moving');
        config.movingWindow = null;
    });
}

// 处理窗口自动激活
function initWindowActivable()
{
    config.activeWindow = $('.window-active');
    $(document).on('mousedown', '.window', function()
    {
        activeWindow($(this));
    });
}

// 激活指定的窗口
// 参数query：应用窗口id编号，应用窗口id属性，jQuery包装的窗口对象
function activeWindow(query)
{
    if(config.activeWindow)
        config.activeWindow.removeClass('window-active').css('z-index', config.activeWindow.css('z-index')%10000);
    
    var win = (query.constructor == Number)?$('#' + config.windowIdStrTemp.format(query)):((query.constructor == String)?$('#' + query):query);

    config.activeWindow = win.addClass('window-active').css('z-index',win.css('z-index')+10000);
}

// == 辅助 ==
// 字符串格式化
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        var reg;
        if (arguments.length == 1 && typeof(args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};