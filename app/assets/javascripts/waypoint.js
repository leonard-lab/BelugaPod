var g_Enabled = false;

var g_HaveCounter;
var g_NeedSend = false;
var g_LockWaypointId = -1;
var g_SendPeriod = 500;  // milliseconds between updates

var g_RTank = 3.2;

/* this gets called when the page is loaded */
$(document).ready(function(){

    /* update the waypoints and positions from the server
     *  - this will cause the pucks to move to the right positions */
    requestWaypoints();
    requestPositions();

    /* make these jquery-ui styled buttons */
    $("#Zero").button();
    $("#set_waypoint").button();

    /* make the enable button, specify that it is a toggle button */
    $("#Enable").button().toggle(function() {
        /* the first time we click the enable button, enable
         * the pucks to be draggable */
        enableDraggables();
        /* keeps the puck from getting moved by the server
         *  while we're dragging it */
        g_LockWaypointId = selectedRobotId();
        /* Change the label to 'Disable' */
        $(this).button('option', 'label', 'Disable');
        g_Enabled = true;
    }, function() {
        /* when we click again, disable the draggable pucks */
        disableDraggables();
        /* Change the label to 'Enable' */
        $(this).button('option', 'label', 'Enable');
        g_Enabled = false;
    });

    /* set up the click event handler for the tank image */
    $("#XY").unbind("click").click(function(ev){
        if(g_Enabled)
        {
            /* calculate the X and Y position that was clicked, relative
             * to the container */
            var x = ev.pageX - 0.5*$("#XY").width() - $("#XY").position().left;
            var y = ev.pageY - 0.5*$("#XY").height() - $("#XY").position().top;

            /* update the form values for the selected robot */
            var id = "#wp_" + selectedRobotId();
            updateWaypointXY(id, x, y);
        }
    });

    /* set up the click event handler for the depth slider */
    $("#Z").unbind("click").click(function(ev){
        if(g_Enabled)
        {
            /* update the depth value for the selected robot */
            var id = "#zp_" + selectedRobotId();
            updateWaypointZ(id, ev.pageY - $("#Z").position().top - 0.5*$("#Z").height());
        }
    });

    /* sets up the robot selection buttons as a jquery-ui styled button group */
    $("#robot_select").buttonset()
    /* set the click event handlers for each of the robot select buttons */
    $("#robot_select input").each(function(){$(this).click(function(){
        /* when we select a robot, don't let the server change it's waypoints,
         * and update the form with the last known values */
        var id_num = idNumFromId($(this).attr('id'));
        g_LockWaypointId = id_num;
        updateWaypointForm(id_num);
    })});

    /* set up the loop timer, but make sure we don't accidentally create two of
     * them (this can happen if the page reloads, or if somehow this function
     * gets called again for whatever reason) */
    if(g_HaveCounter == undefined)
    {
        /* call doSend every g_SendPeriod milliseconds */
        window.setInterval(doSend, g_SendPeriod);
        g_HaveCounter = true;
    }
    
 });

/* sends a request to the server for updated waypoints
 * the response from the server will be a piece of javascript code
 * that gets executed.  The code is a call to updateWaypoint for
 * each of the four waypoints.
 *   see app/views/waypoints/index.js.erb */
function requestWaypoints()
{
    $.ajax({
        url: "/waypoints",
        dataType: "script"
    });
}

/* same as requestWaypoints, but requests updated positions of the vehicles.
 * In this case the code calls setPosition
 *   see app/views/positions/index.js.erb */
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
