g_Enabled = false;

$(document).ready(function(){
    $("#Zero").button();

    $("#set_kinematics").button();
    
    $("#Enable").button().toggle(function() {
        $(this).button('option', 'label', 'Disable');
        g_Enabled = true;
    }, function() {
        moveGreenDotTo(0, 0);
        moveRedDotTo(0);
        $(this).button('option', 'label', 'Enable');
        g_Enabled = false;
    });
    
    $("#Zero").click(function(){
        moveGreenDotTo(0, 0);
        moveRedDotTo(0);
        $("form#new_kinematic").submit();        
    });

    $("#XY").click(function(ev){
        if(g_Enabled)
        {
            var X = ev.pageX;
            var Y = ev.pageY;
            X -= $("#XY").position().left + 0.5*$("#XY").width() - 7.5;
            Y -= $("#XY").position().top + 0.5*$("#XY").height() + 7.5;
            moveGreenDotTo(X, Y);
            $("form#new_kinematic").submit();                
        }
    });

    $("#Z").click(function(ev){
        if(g_Enabled)
        {
            var Y = ev.pageY;
            Y -= $("#Z").position().top + 0.5*$("#Z").height() + 7.5;
            moveRedDotTo(Y);
            $("form#new_kinematic").submit();                
        }
    });

    moveGreenDotTo(0, 0);
    moveRedDotTo(0);
    
 });

function moveGreenDotTo(x, y)
{
    var w = 15;
    var px = x - 0.5*w;
    var py = y;
    var off = px + " " + py;
    $("#green_dot").position({
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

    $("form#new_kinematic").submit();
}

function moveRedDotTo(y)
{
    var w = 15;
    var px = -0.5*$("#Z").width() + 0.5*w;
    var py = y;
    var off = px + " " + py;
    $("#red_dot").position({
        my: "center center",
        at: "center center",
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

function toggleEnabled()
{
    g_Enabled = !g_Enabled;
    if(g_Enabled == true)
    {
        $("#Enable .ui-button-text").text("Disable").button("refresh");
    }
    else
    {
        $("#Enable .ui-button-text").text("Enable").button("refresh");
    }
}