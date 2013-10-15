var config = 
{
    animateSpeed : 'fast',
    movingWindow : null,
    activeWindow : null
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

// == 窗口 ==
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

function initWindowActivable()
{
    config.activeWindow = $('.window-active');
    $(document).on('mousedown', '.window', function()
    {
        if(config.activeWindow)
            config.activeWindow.removeClass('window-active').css('z-index', config.activeWindow.css('z-index')%10000);
        config.activeWindow = $(this).addClass('window-active').css('z-index',$(this).css('z-index')+10000);

    });
}
