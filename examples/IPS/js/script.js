var animateSpeed = 'fast';

$(function()
{
    $("#allAppsBtn").click(toggleAllApps);
    $("#closeAllApps").click(hideAllApps);
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