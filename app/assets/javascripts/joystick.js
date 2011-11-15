var g_Enabled = false;

$(document).ready(function(){
    $("#Zero").button();

    $("#set_kinematics").button();
    
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
    
    $("#Zero").unbind("click").click(function(){
        movePuckTo(0, 0);
        moveVSliderTo(0);
        $("form#new_kinematic").submit();        
    });

    $("#XY").unbind("click").click(function(ev){
        if(g_Enabled)
        {
            updateKinematicsXY(ev.pageX - 0.5*$("#XY").width() - $("#XY").position().left,
                               ev.pageY - 0.5*$("#XY").height() - $("#XY").position().top);
        }
    });

    $("#Z").unbind("click").click(function(ev){
        if(g_Enabled)
        {
            updateKinematicsZ(ev.pageY - $("#Z").position().top + 0.5*$("#Z").height());
        }
    });

    movePuckTo(0, 0);
    moveVSliderTo(0);
    
 });

function enableDraggables()
{
    debugOut("Hi");
    $("#puck").draggable({
        containment: "#XY",
        drag: function(){
            updateKinematicsXY(puckCenterX(), puckCenterY());
        }
    });

    $("#vslider").draggable({
        axis: "y",
        containment: "#Z",
        drag: function(){
            updateKinematicsZ(sliderCenterY());
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

function updateKinematicsXY(X, Y)
{
    movePuckTo(X, Y);
    $("form#new_kinematic").submit();                
}

function updateKinematicsZ(Y)
{
    moveVSliderTo(Y);
    $("form#new_kinematic").submit();                
}

function movePuckTo(x, y)
{
    var w = 15;
    var px = x - 0.5*w;
    var py = y;
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

    var s_max = parseFloat($("#kinematic_max_speed").val());
    var o_max = parseFloat($("#kinematic_max_omega").val());

    x = x*o_max;
    y = y*s_max;

    $("#kinematic_speed").val(y);
    $("#kinematic_omega").val(x);

}

function moveVSliderTo(y)
{
    var w = 15;
    var px = 1; //-0.5*$("#Z").width() + 0.5*w;
    var py = y;
    var off = px + " " + py;
    $("#vslider").position({
        my: "left center",
        at: "left center",
        of: "#Z",
        offset: off
    });

    y = -y;

    $("#Zlabel").text(y);

    y = y/(0.5*parseFloat($("#Z").height()));
    
    var zdot_max = parseFloat($("#kinematic_max_zdot").val());
    y = y*zdot_max;

    $("#kinematic_zdot").val(y);


}
