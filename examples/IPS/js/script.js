var animateSpeed = 'fast';

$(function()
{
    $("#allAppsBtn").click(toggleAllApps);
    $("#closeAllApps").click(hideAllApps);

    initWindowMovable();
    initWindowActivable();
});

function toggleAllApps()
{
    if($("#allApps").hasClass('show')) hideAllApps(); else showAllApps();
}

function hideAllApps()
{
    $("#allAppsBtn").removeClass("active");
    $("#allApps").fadeOut(animateSpeed).removeClass("show");
    $("#deskContainer").fadeIn(animateSpeed);
}

function showAllApps()
{
    $("#allAppsBtn").addClass("active");
    $("#deskContainer").fadeOut(animateSpeed);
    $("#allApps").fadeIn(animateSpeed).addClass("show");
}

// == 窗口 ==
// 处理拖放窗口事件
// 窗口内任何包含类 '.movable' 都可以相应鼠标拖动事件来移动窗口
function initWindowMovable()
{
    var movingWindow;
    $(document).on('mousedown','.movable,.window-movable .window-head',function(event){
        movingWindow = $(this).closest('.window');
        var mwPos = movingWindow.position();
        movingWindow.data('mouseOffset', {x:event.pageX-mwPos.left,y:event.pageY-mwPos.top}).addClass("window-moving");
    }).mousemove(function(event)
    {
        if(movingWindow && movingWindow.hasClass('window-moving'))
        {
            var offset = movingWindow.data('mouseOffset');
            movingWindow.css(
            {
              left: event.pageX-offset.x,
              top: event.pageY-offset.y
            });
        }
    }).mouseup(function()
    {
        $('.window.window-moving').removeClass('window-moving');
    });
}


