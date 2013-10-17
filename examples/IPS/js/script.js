var config = 
{
    animateSpeed     : 'fast',  // 动画速度
    movingWindow     : null,    // 当前正在移动的窗口
    activeWindow     : null,    // 当前激活的窗口
    lastActiveWindow : null,    //　上次激活的窗口
    appIconRoot      : 'img/',  // 应用图标库目录地址
    windowHeadheight: 36,      　// 桌面任务栏栏高度
    bottomBarHeight  : 42,      // 应用窗口底栏高度
    desktopSize      : null,    // 当前桌面区域尺寸
    desktopPos       : {x: 96, y: 0},
    defaultWindowPos : {x: 110, y: 20},
    defaultWindowSize: {width:700,height:538},
    windowidstrTemplate  : 'win-{0}',
    safeCloseTip     : '确认要关闭　【{0}】 吗？',
    appNotFindTip    : '应用没有找到！',
    busyTip          : '应用正忙，请稍候...',
    getNextDefaultWinPos : function() 
        {
           this.defaultWindowPos = {x: this.defaultWindowPos.x + 30, y: this.defaultWindowPos.y + 30};
           return this.defaultWindowPos;
        },
    windowIdSeed     : 0,
    // 获取下一个新建窗口编号
    getNewWindowId   : function() { return this.windowIdSeed++; },
    windowZIndexSeed : 100,
    // 获取下一个新建窗口z-index
    getNewZIndex     : function() { return this.windowZIndexSeed++; },
    // window模版
    windowHtmlTemplate   : "<div id='{idstr}' class='window {cssclass}' style='width:{width}px;height:{height}px;left:{left}px;top:{top}px;z-index:{zindex};' data-id='{id}'><div class='window-head'><img src='{iconimg}' alt=''><strong>{title}</strong><ul><li><button class='reload-win'><i class='icon-repeat'></i></button></li><li><button class='min-win'><i class='icon-minus'></i></button></li><li><button class='max-win'><i class='icon-resize-full'></i></button></li><li><button class='close-win'><i class='icon-remove'></i></button></li></ul></div><div class='window-content'></div></div>",
    frameHtmlTemplate    : "<iframe id='iframe-{idstr}' name='iframe-{idstr}' src='{url}' frameborder='no' allowtransparency='true' scrolling='auto' hidefocus='' style='width: 100%; height: 100%; left: 0px;'></iframe>",
    leftBarShortcutHtmlTemplate : '<li><a href="javascript:;" class="app-btn" title="{title}" data-id="{id}"><img src="{iconimg}" alt=""></a></li>',
    appsLib           : null
};

$(function()
{
    initAppsLib();
    initLeftBar();
    initShortcusEvents();

    initWindowMovable();
    initWindowActivable();
    initWindowActions();

    initWindowResize();
    // initOther();
});

// == 应用库 ==
// 初始化应用库列表
function initAppsLib()
{
    var lib = new Array();

    lib['allapps'] = new App('allapps', '', '所有应用', 'none', '查看所有已安装应用', 'fullscreen', null, null, null, true);
    lib['store'] = new App('store', 'store.html', '应用商店', 'html', '浏览更多应用并安装', 'max', null, null, null, true);
    lib['themes'] = new App('themes', 'themes.html', '主题', 'html', '更换主题', 'fixed', null, null, null, true);

    lib['0'] = new App('0', 'guidelines.html', '窗口应用开发指南', 'html', '了解如何进行窗口应用开发');
    lib['1'] = new App('1', 'http://pms.zentao.net/', '禅道项目管理', 'iframe', '禅道项目管理系统');
    lib['2'] = new App('2', 'http://chanzhi.net/', '云蝉知', 'iframe', '一分钟开启互联网营销');
    lib['3'] = new App('3', 'http://baidu.com/', 'Google', 'iframe', '', null, null, null, 'https://www.google.com.hk/images/google_favicon_128.png');
    lib['4'] = new App('4', 'http://getbootstrap.com/', 'Bootstrap', 'iframe', '', null, null, null, 'http://getbootstrap.com/assets/ico/apple-touch-icon-144-precomposed.png');
    lib['5'] = new App('5', 'http://xirang.5upm.com/', '蝉知pms', 'iframe', '', null, null, null, 'img/app-1.png');
    lib['6'] = new App('6', 'http://tinypng.org/', 'TinyPng', 'iframe', '', null, null, null, 'http://tinypng.org/images/apple-touch-icon.png');
    lib['7'] = new App('7', 'https://github.com', 'Github', 'iframe', '', null, null, null, 'https://github.com/apple-touch-icon-144.png');
    lib['8'] = new App('8', 'https://github.com/Catouse', 'Catouse', 'iframe', '', null, null, null, 'img/avatar.jpg');
    lib['9'] = new App('9', 'https://mail.google.com', 'Gmail', 'iframe', '', null, null, null, 'img/app-9.png');
    lib['10'] = new App('10', 'http://translate.google.cn/#', 'Translate', 'iframe', '', null, null, null, 'img/app-10.png');
    lib['11'] = new App('5', 'http://chanzhi.org', '开源蝉知', 'iframe', '', null, null, null, 'img/app-2.png');

    config.appsLib = lib;
}

// == 应用快捷图标　==
// 初始化左侧栏图标
function initLeftBar()
{
    var lib = config.appsLib;
    var leftMenu = $('#apps-menu .bar-menu');
    for(var index in lib)
    {
        var app = lib[index];
        leftMenu.append(app.toLeftBarShortcutHtml());
    }
}

function initShortcusEvents()
{
    $(document).on('click', '.app-btn', function(event)
    {
        var app = config.appsLib[$(this).attr('data-id')];
        if(app)
        {
            openWindow(app);
        }
        else
        {
            alert(config.appNotFindTip);
        }
        event.preventDefault();
    });
}

function initOther()
{
    $('#allAppsBtn').click(toggleAllApps);
    $('#closeAllApps').click(hideAllApps);

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
}

// == 应用窗口对象 ==
// 构造函数
// 参数说明请参见开发指南
function App(id, url, title, type,　description, display, size, position, imgicon, systemapp)
{
    this.id       = id;
    this.idstr    = config.windowidstrTemplate.format(this.id);
    this.url      = url;
    this.title    = title ? title : '';
    this.type     = type ? type : 'iframe';
    this.description = description ? description : '';
    this.display  = display ? display: 'normal';
    this.size     = size ? size : config.defaultWindowSize;
    this.position = position ? position : null;
    this.iconimg  = imgicon ? imgicon : config.appIconRoot + 'app-' + this.id + '.png';
    this.systemapp= systemapp ? systemapp : false;
    this.cssclass = 'window-movable';
    

    this.toWindowHtml   = function()
    {
        this.init();

        return config.windowHtmlTemplate.format(this);
    };

    this.toLeftBarShortcutHtml = function()
    {
        if(!this.systemapp)
            return config.leftBarShortcutHtmlTemplate.format(this);
    };


    this.init = function()
    {
        switch(this.display)
        {
            case 'normal':
                this.zindex = config.getNewZIndex();
                if(!this.position) this.position = config.getNextDefaultWinPos();
                break;
            case 'fixed':
                this.cssclass += ' window-fixed';
                this.zindex = config.getNewZIndex();
                if(!this.position) this.position = config.getNextDefaultWinPos();
                break;
            case 'fullscreen':
                this.cssclass += ' window-fullscreen window-active';
                this.zindex = config.getNewZIndex() + 20000;
                this.position = config.desktopPos;
                this.size = config.desktopSize;
                break;
            case 'max':
                this.cssclass += ' window-max';
                this.zindex = config.getNewZIndex();
                this.position = config.desktopPos;
                this.size = config.desktopSize;
                break;
        }

        this.left     = this.position.x;
        this.top      = this.position.y;
        this.width    = this.size.width;
        this.height   = this.size.height;
    }
}

// 显示应用窗口
// 如果应用窗口没有打开则创建一个应用窗口
function openWindow(app)
{
    var appWin = $('#' + app.idstr);
    if(appWin.length<1)
    {
        // 此处判断应用类型如果为新标签页中打开...

        $("#deskContainer").append(app.toWindowHtml());
        handleWinResized(app.idstr);
        activeWindow(app.idstr);

        reloadWindow(app.idstr);
    }
    else
    {
        showWindow(appWin);
    }
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
            return (winQuery.constructor == Number)?$('#' + config.windowidstrTemplate.format(winQuery)):((winQuery.constructor == String)?$('#' + winQuery):$(winQuery));
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
        event.stopPropagation()
    }).on('dblclick', '.window-head', function(event) // double click for max-win
    {
        toggleMaxSizeWindow($(this).closest('.window'));
        event.preventDefault();
        event.stopPropagation()
    }).on('click', '.close-win', function(event) // close-win
    {
        closeWindow($(this).closest('.window'));
        event.preventDefault();
        event.stopPropagation()
    }).on('click', '.min-win', function(event) // min-win
    {
        toggleShowWindow($(this).closest('.window'));
        event.preventDefault();
        event.stopPropagation()
    }).on('click', '.reload-win', function(event)
    {
        reloadWindow($(this).closest('.window'));
        event.preventDefault();
        event.stopPropagation()
    });
}

// 显示或最小化窗口
function toggleShowWindow(winQuery)
{
    var win = getWinObj(winQuery);
    if(win.hasClass('window-min'))
    {
        showWindow(win);
    }
    else
    {
        hideWindow(win);
    }
}

//　最小化窗口
function hideWindow(winQuery)
{
    var win = getWinObj(winQuery);
    if(!win.hasClass('window-min'))
    {
        win.fadeOut(config.animateSpeed).addClass('window-min');
        activeWindow(config.lastActiveWindow);
    }
}

//　显示窗口
function showWindow(winQuery)
{
    var win = getWinObj(winQuery);
    if(win.hasClass('window-min'))
    {
        win.fadeIn(config.animateSpeed).removeClass('window-min');
    }
    activeWindow(win);
}

// 重新加载窗口内容
function reloadWindow(winQuery)
{
    var win = getWinObj(winQuery);
    if(!win.hasClass('window-loading'))
    {
        win.addClass('window-loading').removeClass('window-error').find('.reload-win i').addClass('icon-spin');
        var app = config.appsLib[win.attr('data-id')];

        var result = true;
        switch(app.type)
        {
            case 'iframe':
                result = loadIframeWindow(win, app);
                break;
            case 'html':
                result = loadHtmlWindow(win, app);
                break;
        }
    }
    else
    {
        alert(config.busyTip);
    }
}

function loadHtmlWindow(win, app)
{
    var result = true;
    var content = win.find('.window-content').html('');
    $.ajax(
    {
        url: app.url,
        dataType: 'html',
    })
    .done(function(data)
    {
        content.html(data);
    })
    .fail(function()
    {
        win.addClass('window-error');
        result = false;
    })
    .always(function()
    {
        win.removeClass('window-loading');
        win.find('.reload-win i').removeClass('icon-spin');
    });
    return result;
}

// 加载iFrameWindow内容
function loadIframeWindow(win, app)
{
    var fName = 'iframe-' + app.idstr;
    var frame = $('#' + fName);
    if(frame.length > 0)
    {
        document.getElementById(fName).src = app.url; 
    }
    else
    {
        win.find('.window-content').html(config.frameHtmlTemplate.format(app));
    }
    $('#' + fName).load(function(){
        win.removeClass('window-loading');
        win.find('.reload-win i').removeClass('icon-spin');
    });
    return true;
}

// 关闭应用窗口
function closeWindow(winQuery)
{
    var win = getWinObj(winQuery);
    if(win.hasClass('window-safeclose') && (!confirm(config.safeCloseTip.format(win.find('.window-head strong').text()))))
        return;

    win.fadeOut(config.animateSpeed, function(){ win.remove(); });
    activeWindow(config.lastActiveWindow);
    // todo: 此处加入销毁应用窗口的其他操作
}

// 切换窗口最大化状态和普通状态
function toggleMaxSizeWindow(winQuery)
{
    var win = getWinObj(winQuery);
    if(win.hasClass('window-fixed')) return;

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
        var win = $(this).closest('.window:not(.window-max)');
        if(win.length<1)
        {
            return;
        }
        config.movingWindow = win;
        var mwPos = config.movingWindow.position();
        config.movingWindow.data('mouseOffset', {x: event.pageX-mwPos.left, y: event.pageY-mwPos.top}).addClass('window-moving');
        $(document).bind('mousemove',mouseMove).bind('mouseup',mouseUp)
        event.preventDefault();
    });

    function mouseUp()
    {
        $('.window.window-moving').removeClass('window-moving');
        config.movingWindow = null;
        $(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp)
    }

    function mouseMove(event)
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
    }
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
    var win = getWinObj(query);

    if(win.hasClass('window-active')) return;

    if(config.activeWindow)
    {
        config.lastActiveWindow = config.activeWindow;
        config.activeWindow.removeClass('window-active').css('z-index', parseInt(config.activeWindow.css('z-index'))%10000);
    }

    config.activeWindow = win.addClass('window-active').css('z-index',parseInt(win.css('z-index'))+10000);
}

// 调整界面元素尺寸
// 初始化窗口尺寸更改
function initWindowResize()
{
    refreshSize();
    $(window).resize(refreshSize);
}

function refreshSize()
{
    refreshDesktopSize();
    resizeAppsMenu();
    refreshWindowSize();
}

function refreshDesktopSize()
{
    var desktop = $('#desktop');
    config.desktopSize = {width: desktop.width() - config.desktopPos.x, height: desktop.height() - config.desktopPos.y - config.bottomBarHeight};
    console.log('desktopSize:'+config.desktopSize.width+","+config.desktopSize.height);
}

// 更新桌面窗口尺寸，仅限最大化状态及全屏状态的窗口尺寸
function refreshWindowSize()
{
    $('.window-fullscreen,.window-max').each(function()
    {
        var win = $(this);
        win.width(config.desktopSize.width);
        win.height(config.desktopSize.height);
        handleWinResized(win);
    });
}

// 更新appsMenu尺寸
function resizeAppsMenu()
{
    var menu = $('#apps-menu');
    var iconHeight = menu.find('li').height();
    var menuHeight = config.desktopSize.height - $('#leftBar .dock-bottom').height();
    console.log('iconHeight:'+iconHeight+',menuHeight:'+menuHeight);
    while(menuHeight%iconHeight!=0)
    {
        menuHeight--;
    }
    menu.height(menuHeight);
    console.log('iconHeight:'+iconHeight+',menuHeight:'+menuHeight);
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