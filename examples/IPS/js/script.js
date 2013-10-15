var config = 
{
    animateSpeed     : 'fast',  // 动画速度
    movingWindow     : null,    // 当前正在移动的窗口
    activeWindow     : null,    // 当前激活的窗口
    appIconRoot      : '',      // 应用图标库目录地址
    windowIdSeed     : 0,
    getNewWindowId   : function() { return windowIdSeed++; },
    windowZIndexSeed : 0,
    getNewZIndex   : function() { return windowZIndexSeed++; }

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
    
    var win = (query.constructor == Number)?$('#app-' + query):((query.constructor == String)?$('#' + query):query);

    config.activeWindow = win.addClass('window-active').css('z-index',win.css('z-index')+10000);
}