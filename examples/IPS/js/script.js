var config = 
{
    animateSpeed     : 'fast',  // 动画速度
    movingWindow     : null,    // 当前正在移动的窗口
    activeWindow     : null,    // 当前激活的窗口
    appIconRoot      : 'img/',  // 应用图标库目录地址
    windowHeadheight: 38,      // 桌面任务栏栏高度
    bottomBarHeight  : 42,      // 应用窗口底栏高度
    desktopPos       : {x: 96, y: 0},
    defaultWindowPos : {x: 110, y: 20},
    windowIdStrTemp  : 'win-{0}',
    safeCloseTip     : '确认要关闭　【{0}】 吗？',
    getNextDefaultWinPos : function() 
        {
           this.defaultWindowPos = {x: this.defaultWindowPos.x + 20, y: this.defaultWindowPos.y + 20};
           return this.defaultWindowPos;
        },
    windowIdSeed     : 0,
    // 获取下一个新建窗口编号
    getNewWindowId   : function() { return this.windowIdSeed++; },
    windowZIndexSeed : 0,
    // 获取下一个新建窗口z-index
    getNewZIndex     : function() { return this.windowZIndexSeed++; },
    // window模版
    windowHtmlTemp   : ''
};

$(function()
{
    $('#allAppsBtn').click(toggleAllApps);
    $('#closeAllApps').click(hideAllApps);

    initWindowMovable();
    initWindowActivable();
    initWindowActions();
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
    this.display  = display ? display: 'normal';
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
// 根据窗口标识获取win容器的jQuery对象
function getWinObj(winQuery)
{
    if(winQuery)
    {
        if(winQuery instanceof jQuery)
        {
            return winQuery;
        }
        else
        {
            return (winQuery.constructor == Number)?$('#' + config.windowIdStrTemp.format(winQuery)):((winQuery.constructor == String)?$('#' + winQuery):$(winQuery));
        }
    }
    else
        return config.activeWindow;

}

// 获取桌面尺寸
function getDesktopSize()
{
    var desk = $("#deskContainer");
    return {width: desk.width() - config.desktopPos.x, height: desk.height() - config.desktopPos.y - config.bottomBarHeight};
}

// 窗口按钮操作事件
function initWindowActions()
{
    // max-win
    $(document).on('click', '.max-win', function(event)
    {
        toggleMaxSizeWindow($(this).closest('.window'));
        event.preventDefault();
    });

    // close-win
    $(document).on('click', '.close-win', function(event)
    {
        closeWindow($(this).closest('.window'));
        event.preventDefault();
    });
}

// 关闭应用窗口
function closeWindow(winQuery)
{
    var win = getWinObj(winQuery);
    if(win.hasClass('window-safeclose') && (!confirm(config.safeCloseTip.format(win.find('.window-head strong').text()))))
        return;

    win.remove();

    // todo: 此处加入销毁应用窗口的其他操作
}

// 切换窗口最大化状态和普通状态
function toggleMaxSizeWindow(winQuery)
{
    var win = getWinObj(winQuery);
    if(win.hasClass('window-max'))
    {
        var orginLoc = win.data('orginLoc');
        win.removeClass('window-max').css(
        {
            left: orginLoc.left,
            top: orginLoc.top,
            width: orginLoc.width,
            height: orginLoc.height
        }).find('.icon-resize-small').removeClass('icon-resize-small').addClass('icon-resize-full');
    }
    else
    {
        var dSize = getDesktopSize();
        win.data('orginLoc', 
        {
            left: win.css('left'),
            top: win.css('top'),
            width: win.css('width'),
            height: win.css('height')
        }).addClass('window-max').css(
        {
            left: config.desktopPos.x,
            top: config.desktopPos.y,
            width: dSize.width,
            height: dSize.height
        }).find('.icon-resize-full').removeClass('icon-resize-full').addClass('icon-resize-small');
    }
    handleWinResized(win);
}

// 处理窗口尺寸被更改调用此方法调整窗口内容尺寸
function handleWinResized(winQuery)
{
    var win  = getWinObj(winQuery);
    win.find('.window-content').height(win.height() - config.windowHeadheight);
}

// 处理拖放窗口事件
// 窗口内任何包含类 '.movable' 都可以相应鼠标拖动事件来移动窗口
function initWindowMovable()
{
    $(document).on('mousedown', '.movable,.window-movable .window-head', function(event)
    {
        config.movingWindow = $(this).closest('.window');
        var mwPos = config.movingWindow.position();
        config.movingWindow.data('mouseOffset', {x: event.pageX-mwPos.left, y: event.pageY-mwPos.top}).addClass('window-moving');
        event.preventDefault();
    }).mousemove(function(event)
    {
        if(config.movingWindow && config.movingWindow.hasClass('window-moving'))
        {
            var offset = config.movingWindow.data('mouseOffset');
            config.movingWindow.css(
            {
                left : event.pageX-offset.x,
                top : event.pageY-offset.y
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
    
    var win = getWinObj(query);

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