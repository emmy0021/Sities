var viewmode;


$(document).ready(new function() {                  // similar to int main()
    
    if (localStorage.getItem("viewmode") === null)
    {
        localStorage.setItem("viewmode", 0);
        viewmode = 0;
        document.getElementById("sheetoption").innerHTML = '<link rel="stylesheet" type="text/css" href="stylesheets/stylesheet.css" media="screen">';
    } else {
        viewmode = localStorage.getItem("viewmode");
        colorBlindFunction();
    }

    
    
});

function changeCBVal() {
    if (viewmode == 0)
    {
        viewmode = 1;
        localStorage.viewmode = 1;
    } 
    else if (viewmode == 1) 
    {
        viewmode = 0;
        localStorage.viewmode = 0;
    }
    colorBlindFunction();
}

function colorBlindFunction() {

    if (viewmode == 0)
    {
        document.getElementById("sheetoption").innerHTML = '<link rel="stylesheet" type="text/css" href="stylesheets/stylesheet.css" media="screen">';
    } 
    if (viewmode == 1) {
        document.getElementById("sheetoption").innerHTML = '<link rel="stylesheet" type="text/css" href="stylesheets/stylesheetcb.css" media="screen">';
    }
  }