var g_Enabled = false;

var g_HaveCounter;
var g_NeedSend = false;
var g_LockWaypointId = -1;
var g_SendPeriod = 500;  // milliseconds between updates

var g_RTank = 3.2;

$(document).ready(function(){

    requestWaypoints();
    requestPositions();
    
    $("#Zero").button();

    $("#set_waypoint").button();
    
    $("#Enable").button().toggle(function() {
        enableDraggables();
        g_LockWaypointId = selectedRobotId();
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

    $("#robot_select").buttonset()
    $("#robot_select input").each(function(){$(this).click(function(){
        var id_num = idNumFromId($(this).attr('id'));
        g_LockWaypointId = id_num;
        updateWaypointForm(id_num);
    })});

    if(g_HaveCounter == undefined)
    {
        window.setInterval(doSend, g_SendPeriod);
        g_HaveCounter = true;
    }
    
 });

function requestWaypoints()
{
    $.ajax({
        url: "/waypoints",
        dataType: "script"
    });
}

function requestPositions()
{
    $.ajax({
        url: "/positions",
        dataType: "script"
    });
}

function updateWaypoint(id_num, x, y, z)
{
    if(id_num != g_LockWaypointId || !g_Enabled)
    {
        movePuckToWorldCoordinates("#wp_" + id_num, x, y);
        moveVSliderToWorldCoordinates("#zp_" + id_num, z);
    }
}

function rTankFig()
{
    return 0.45*$("#XY").width();    
}

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
        requestPositions();
        requestWaypoints();
    }
}

function setPosition(i, x, y, z)
{
    movePuckToWorldCoordinates("#cp_" + i, x, y);
    moveVSliderToWorldCoordinates("#z_" + i, z);
}

function idNumFromId(id)
{
    return parseInt(id.match(/^.+_(.+)/)[1]);
}

function enableDraggables()
{
    $(".waypoint.orange").each(function(){
        $(this).draggable({
            containment: "#XY",
            drag: function(ev, ui){
                var id = "#" + $(this).attr('id');

                var id_num = idNumFromId(id);
                selectRobot(id_num);
                
                var px = puckCenterX(id);
                var py = puckCenterY(id);
                var x = (g_RTank/rTankFig())*(px);
                var y = (g_RTank/rTankFig())*(py);
                if(x*x + y*y > g_RTank*g_RTank)
                {
                    var th = Math.atan2(py, px);
                    px = 0.95*rTankFig()*Math.cos(th);
                    py = 0.95*rTankFig()*Math.sin(th);
                    movePuckTo(id, px, py);
                    ev.preventDefault();
                }
                
                updateWaypointXY(id, px, py);
                var zid = "#zp_" + id_num;
                updateWaypointZ(zid, sliderCenterY(zid));
            }
        })
    });
    
    $(".vslider.orange").each(function(){
        $(this).draggable({
            axis: "y",
            containment: "#Z",
            drag: function(ev, ui){
                var id = "#" + $(this).attr('id');
                var id_num = idNumFromId(id);
                selectRobot(id_num);
                
                updateWaypointZ(id, sliderCenterY(id));
                var xid = "#wp_" + id_num;
                updateWaypointXY(xid, puckCenterX(xid), puckCenterY(xid));
            }
        })
    });
}

function disableDraggables()
{
    $(".waypoint orange").each(function(){$(this).draggable('destroy')});
    $(".vslider orange").each(function(){$(this).draggable('destroy')}); 
}

function selectRobot(id_num)
{
    g_LockWaypointId = id_num;
    $("#robot_select > input")[id_num].checked = true;
    $("#robot_select").buttonset('refresh');
    updateWaypointForm(id_num);
}

function updateWaypointForm(id_num)
{
    setFormValue("#waypoint_x", fig2WorldXorY(puckCenterX("#wp_" + id_num)));
    setFormValue("#waypoint_y", fig2WorldXorY(puckCenterY("#wp_" + id_num)));
    setFormValue("#waypoint_z", fig2WorldZ(sliderCenterY("#zp_" + id_num)) );
}

/* function to set form value with rounding to two decimal places */
function setFormValue(id, value)
{
    $(id).val(Math.round(100*value)/100);
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

function fig2WorldXorY(x_or_y)
{
    return x_or_y*(g_RTank/rTankFig());
}

function fig2WorldZ(z)
{
    var d_tank = 2.286;
    var d_fig = $("#Z").height();
    return (0.5*d_fig - z)*(d_tank/d_fig);
}

function updateWaypointXY(id, X, Y)
{
    var waypoint_x = fig2WorldXorY(X);
    var waypoint_y = fig2WorldXorY(Y);

    /* make sure the point is inside the tank */
    var r2 = waypoint_x*waypoint_x + waypoint_y*waypoint_y;
    if(r2 > g_RTank*g_RTank)
    {
        return;
    }

    setFormValue("#waypoint_x", waypoint_x);
    setFormValue("#waypoint_y", waypoint_y);    
        
    movePuckTo(id, X, Y);
    g_NeedSend = true;
}

function updateWaypointZ(id, Y)
{
    var waypoint_z = fig2WorldZ(Y);

    setFormValue("#waypoint_z", waypoint_z);
    
    moveVSliderTo(id, Y);
    g_NeedSend = true;
}

function movePuckToWorldCoordinates(id, x_w, y_w)
{
    var x_fig = x_w*(rTankFig()/g_RTank);
    var y_fig = y_w*(rTankFig()/g_RTank);
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
    var px = x - 1;
    var py = y - 1;
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
    var px = 1;
    var py = y - 1;
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
