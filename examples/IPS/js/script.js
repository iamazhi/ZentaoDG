var animateSpeed = 'fast';

$(function()
{
    $("#allAppsBtn").click(toggleAllApps);
    $("#closeAllApps").click(hideAllApps);

    $(".movable").each(function(handle)
    {
        initWindowMovable($(this));
    });
    releaseWindowMoveHandle();
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
// 拖放窗口
function initWindowMovable(handle)
{
    var iWindow = handle.closest('.window');
    var iWindowPos;
    var mouseOffset;
    handle.mousedown(function(event)
    {
        iWindowPos = iWindow.position();
        mouseOffset = {x:event.pageX-iWindowPos.left,y:event.pageY-iWindowPos.top}
        iWindow.addClass("window-moving");
    });
    $(document).mousemove(function(event)
    {
        if(iWindow.hasClass('window-moving'))
        {
            iWindow.css(
            {
              left: event.pageX-mouseOffset.x,
              top: event.pageY-mouseOffset.y
            });
        }
    });;
}

function releaseWindowMoveHandle()
{
    $(document).mouseup(function()
    {
        $('.window.window-moving').removeClass('window-moving');
    });
}