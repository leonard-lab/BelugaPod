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
        disableDraggables();
        $(this).button('option', 'label', 'Enable');
        g_Enabled = false;
    });
    
    $("#XY").unbind("click").click(function(ev){
        if(g_Enabled)
        {
            var id = "#wp_" + selectedRobotId();
            updateWaypointXY(id,
                             ev.pageX - 0.5*$("#XY").width() - $("#XY").position().left,
                             ev.pageY - 0.5*$("#XY").height() - $("#XY").position().top);
        }
    });

    $("#Z").unbind("click").click(function(ev){
        if(g_Enabled)
        {
            var id = "#zp_" + selectedRobotId();
            updateWaypointZ(id, ev.pageY - $("#Z").position().top - 0.5*$("#Z").height());
        }
    });

    $("#robot_select").buttonset();

    if(g_HaveCounter == undefined)
    {
        window.setInterval(doSend, g_SendPeriod);
        g_HaveCounter = true;
    }
    
 });

function selectedRobotId()
{
    return $("#robot_select input:checked").val();
}

function doSend()
{
    if(g_NeedSend)
    {
        $("form.new_waypoint").submit();
        g_NeedSend = false;
    }
    if(g_Enabled)
    {
        $.ajax({
            url: "/positions",
            dataType: "script",
        });
    }
}

function setPosition(i, x, y, z)
{
    movePuckToWorldCoordinates("#cp_" + i, x, y);
    moveVSliderToWorldCoordinates("#z_" + i, z);
}

function enableDraggables()
{
/*    $(".waypoint orange").draggable({
        containment: "#XY",
        drag: function(){
            updateWaypointXY(puckCenterX(), puckCenterY());
        }
    });

    $(".slider orange").draggable({
        axis: "y",
        containment: "#Z",
        drag: function(){
            updateWaypointZ(sliderCenterY());
        }
    });*/
}

function disableDraggables()
{
    $(".waypoint orange").draggable('destroy');
    $(".slider orange").draggable('destroy');    
}

function puckCenterX(id)
{
    return $(id).position().left - $("#XY").position().left
        + 0.5*$(id).width() - 0.5*$("#XY").width();
}

function puckCenterY(id)
{
    return $(id).position().top - $("#XY").position().top
        + 0.5*$(id).height() - 0.5*$("#XY").height();
}

function sliderCenterY(id)
{
    return $(id).position().top - $("#Z").position().top
        + 0.5*$(id).height() - 0.5*$("#Z").height();
}

function debugOut(txt)
{
    $("#debug_out").text(txt);
}

function updateWaypointXY(id, X, Y)
{
    var r_tank = 3.2;
    var r_fig = 0.45*$("#XY").width();

    var waypoint_x = X*(r_tank/r_fig);
    var waypoint_y = Y*(r_tank/r_fig);    
    $("#waypoint_x").val(waypoint_x);
    $("#waypoint_y").val(waypoint_y);
        
    movePuckTo(id, X, Y);
    g_NeedSend = true;
}

function updateWaypointZ(id, Y)
{
    var d_tank = 2.286;
    var d_fig = $("#Z").height();

    var waypoint_z = (0.5*d_fig - Y)*(d_tank/d_fig);

    $("#waypoint_z").val(waypoint_z);
    
    moveVSliderTo(id, Y);
    g_NeedSend = true;
}

function movePuckToWorldCoordinates(id, x_w, y_w)
{
    var r_tank = 3.2;
    var r_fig = 0.45*$("#XY").width();
    var x_fig = x_w*(r_fig/r_tank);
    var y_fig = y_w*(r_fig/r_tank);
    movePuckTo(id, x_fig, y_fig);
}

function moveVSliderToWorldCoordinates(id, z_w)
{
    var d_tank = 2.286;
    var d_fig = $("#Z").height();
    var y_fig =  0.5*d_fig - z_w*(d_fig/d_tank);

    moveVSliderTo(id, y_fig);
}

function movePuckTo(id, x, y)
{
    var w = 30;
    var px = x;// - 0.5*w;
    var py = y;// - 0.5*w;
    var off = px + " " + py;

    $(id).position({
        my: "center center",
        at: "center center",
        of: "#XY",
        offset: off
    });
    
    y = -y;

    $("#Xlabel").text(x);
    $("#Ylabel").text(y);
    
}

function moveVSliderTo(id, y)
{
    var h = 10;
    var px = 1;
    var py = y - 0.5*h;
    var off = px + " " + py;
    $(id).position({
        my: "left center",
        at: "left center",
        of: "#Z",
        offset: off
    });

    y = 0.5*$("#Z").height()-y;

    $("#Zlabel").text(y);

}
