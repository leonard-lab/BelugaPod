$(document).ready(function(){
    $("#EnableXY").button();

    $("#green_dot").show();
    moveGreenDotTo(0, 0);

    $("#XY").click(function(ev){
        var X = ev.pageX;
        var Y = ev.pageY;
        X -= $("#XY").position().left + 0.5*$("#XY").width() - 7.5;
        Y -= $("#XY").position().top + 0.5*$("#XY").height() + 7.5;
        moveGreenDotTo(X, Y);
    });
    
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
}

