/* Function to request the current param string from the server.  The
 * response script calls updateParamString, which you can define as
 * you see fit.
 *
 * Example:
 * 
 * function updateParamString(new_string){
 *   $("#param_string").text(new_string);
 * }
 */
function requestParamString()
{
    $.ajax({ url: 'params', dataType: 'script' });
}

/* Function to set the param string on the server.  The response script
 * calls updateParamString.  See requestParamString.
 *
 * Example usage:
 * setParamString($("#param_string").text());
 *
 */
function setParamString(params)
{
    $.ajax({
        type: "POST",
        url: "params",
        data: "param[string]=" + params,
        dataType: "script"
    });
}