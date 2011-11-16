var g_Enabled = false;

var g_HaveCounter;
var g_NeedSend = false;
var g_SendPeriod = 100;  // milliseconds between updates

$(document).ready(function(){
    $("#Zero").button();

    $("#set_waypoint").button();
    
    $("#Enable").button().toggle(function() {
        enableDraggables();
        $(this).button('option', 'label', 'Disable');
        g_Enabled = true;
    }, function() {
        movePuckTo(0, 0);
        moveVSliderTo(0);
        disableDraggables();
        $(this).button('option', 'label', 'Enable');
        g_Enabled = false;
    });
    
    $("#XY").unbind("click").click(function(ev){
        if(g_Enabled)
        {
            updateWaypointXY(ev.pageX - 0.5*$("#XY").width() - $("#XY").position().left,
                             ev.pageY - 0.5*$("#XY").height() - $("#XY").position().top);
        }
    });

    $("#Z").unbind("click").click(function(ev){
        if(g_Enabled)
        {
            updateWaypointZ(ev.pageY - $("#Z").position().top - 0.5*$("#Z").height());
        }
    });

    movePuckTo(0, 0);
    moveVSliderTo(0);

    if(g_HaveCounter == undefined)
    {
        window.setInterval(doSend, g_SendPeriod);
        g_HaveCounter = true;
    }
    
 });

function doSend()
{
    if(g_NeedSend)
    {
        $("form.new_waypoint").submit();
        g_NeedSend = false;
    }
}

function enableDraggables()
{
    $("#puck").draggable({
        containment: "#XY",
        drag: function(){
            updateWaypointXY(puckCenterX(), puckCenterY());
        }
    });

    $("#vslider").draggable({
        axis: "y",
        containment: "#Z",
        drag: function(){
            updateWaypointZ(sliderCenterY());
        }
    });
}

function disableDraggables()
{
    $("#puck").draggable('destroy');
    $("#vslider").draggable('destroy');    
}

function puckCenterX()
{
    return $("#puck").position().left - $("#XY").position().left
        + 0.5*$("#puck").width() - 0.5*$("#XY").width();
}

function puckCenterY()
{
    return $("#puck").position().top - $("#XY").position().top
        + 0.5*$("#puck").height() - 0.5*$("#XY").height();
}

function sliderCenterY()
{
    return $("#vslider").position().top - $("#Z").position().top
        + 0.5*$("#vslider").height() - 0.5*$("#Z").height();
}

function debugOut(txt)
{
    $("#debug_out").text(txt);
}

function updateWaypointXY(X, Y)
{
    movePuckTo(X, Y);
    g_NeedSend = true;
}

function updateWaypointZ(Y)
{
    moveVSliderTo(Y);
    g_NeedSend = true;
}

function movePuckTo(x, y)
{
    var w = 30;
    var px = x - 0.5*w;
    var py = y - 0.5*w;
    var off = px + " " + py;

    $("#puck").position({
        my: "center center",
        at: "center center",
        of: "#XY",
        offset: off
    });
    
    y = -y;
    
    $("#Xlabel").text(x);
    $("#Ylabel").text(y);
    
    x = x/(0.5*parseFloat($("#XY").width()));
    y = y/(0.5*parseFloat($("#XY").height()));    

    var x_max = 1;
    var y_max = 1;

    x = x*x_max;
    y = y*y_max;

    $("#waypoint_x").val(y);
    $("#waypoint_y").val(x);

}

function moveVSliderTo(y)
{
    var h = 10;
    var px = 1;
    var py = y - 0.5*h;
    var off = px + " " + py;
    $("#vslider").position({
        my: "left center",
        at: "left center",
        of: "#Z",
        offset: off
    });

    y = 0.5*$("#Z").height()-y;

    $("#Zlabel").text(y);

    y = y/(parseFloat($("#Z").height()));
    
    var z_max = 2.286;
    y = y*z_max;

    $("#waypoint_z").val(y);


}
