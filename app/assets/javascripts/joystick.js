g_Enabled = false;

$(document).ready(function(){
    $("#Zero").button();

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
    });

    $("#XY").click(function(ev){
        if(g_Enabled)
        {
            var X = ev.pageX;
            var Y = ev.pageY;
            X -= $("#XY").position().left + 0.5*$("#XY").width() - 7.5;
            Y -= $("#XY").position().top + 0.5*$("#XY").height() + 7.5;
            moveGreenDotTo(X, Y);
        }
    });

    $("#Z").click(function(ev){
        if(g_Enabled)
        {
            var Y = ev.pageY;
            Y -= $("#Z").position().top + 0.5*$("#Z").height() + 7.5;
            moveRedDotTo(Y);
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

    $("#Xlabel").text(x);
    $("#Ylabel").text(y);    
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

    $("#Zlabel").text(y);
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