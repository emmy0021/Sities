var inputtext;
var city = '';
var ip = 'check';
var eventW;
var access_key = '145a6e1f8118cacc7daf96e2b3f5ab42';
var date = '';
var enddate = '';
var viewmode;
var boxlist = '';
var box = '<div class="eventbox">';
var evennumber;
var eventnames = [];
var eventdates = [];
var eventtimes = [];
var eventvenues = [];
var eventticketlinks = [];
var eventpics = [];




$(document).ready(new function() {                  // similar to int main()

    getLocation();
    getDate();

    if (localStorage.getItem("viewmode") === null)
    {
        localStorage.setItem("viewmode", 0);
        viewmode = 0;
        document.getElementById("sheetoption").innerHTML = '<link rel="stylesheet" type="text/css" href="stylesheets/stylesheet.css" media="screen">';
    } else {
        viewmode = localStorage.getItem("viewmode");
        colorBlindFunction();
    }


    if (localStorage.getItem("popup") === null)
    {
        localStorage.setItem("popup",0);
        alert("To use the site as intended, please disable adblockers and load unsafe scripts");
    }

    //getEvents();
});

$(document).on('keypress', function(e) {            // checks when enter key is pressed in text box
    if(e.which == 13) {
        inputtext = document.getElementById("inputtext").value;

        city = inputtext;

        city = city.charAt(0).toUpperCase() + city.substr(1);

        for (i = 0; i < city.length; i++)
        {
            if (city.charAt(i) == ' ' && i < city.length - 2)
            {
                city = city.substr(0,i+1) + city.charAt(i+1).toUpperCase() + city.substr(i+2);
            }
        }

        document.getElementById("inputtext").value = city;


        //outputCity();
        getEvents();
    }
});


function getLocation(){
    $.ajax({
        url: 'http://api.ipstack.com/' + ip + '?access_key=' + access_key,   
        dataType: 'jsonp',
        success: function(json) {

        // output the "capital" object inside "location"
        console.log(json);
                    
        city = json.city;
                    
        $(".city").append(city);

        outputCity();
        getEvents();
        }
    });
}

function outputCity() {
    document.getElementById("inputtext").value = city;
}


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



  function getEvents() {
    $.ajax({
        type:"GET",
        //url:"https://app.ticketmaster.com/discovery/v2/events.json?size=10&city=" + city + "&radius=20&unit=miles&includeTBA=no&includeTBD=no&startDateTime=" + date + "Z&endDateTime=" + enddate +"Z&sort=date,name,desc&apikey=jAgPHe9zhnVREzoNhSvYNrfX1V9zeecJ",
        url:"https://app.ticketmaster.com/discovery/v2/events.json?size=20&city=" + city + "&radius=20&unit=miles&includeTBA=no&includeTBD=no&startDateTime=" + date + "Z&endDateTime=" + enddate +"Z&sort=date,name,desc&apikey=jAgPHe9zhnVREzoNhSvYNrfX1V9zeecJ",
        async:true,
        dataType: "json",
        success: function(json) {
                    console.log(json);
                    //console.log(json._embedded.events);

                    if (json.page.totalElements > 0) {

                        eventnumber = json._embedded.events.length;
                        
                        var i;
                        for (i = 0; i < eventnumber; i++) {
                            eventnames.push(json._embedded.events[i].name);
                            eventdates.push(json._embedded.events[i].dates.start.localDate);
                            eventtimes.push(json._embedded.events[i].dates.start.localTime);
                            eventvenues.push(json._embedded.events[i]._embedded.venues[0].name);
                            eventticketlinks.push(json._embedded.events[i].url);
                            eventpics.push(json._embedded.events[i].images[1].url);
                        }

                        //console.log(eventdates);
                        dateAdjuster();

                        outputEvents();
                    }
                    else
                    {
                        eventnumber = 0;
                        outputEvents();
                    }
                 },
        error: function(xhr, status, err) {
                    // This time, we do not end up here!
                 }
      });
}

function outputEvents() {

    boxlist = '';
    var i;
    for (i = 0; i < eventnumber; i++) {

        if (eventtimes[i] == null) {
            eventtimes[i] = 'No Time Provided';
        }
        else {
            eventtimes[i] = timeAdjuster(eventtimes[i]);
        }

        boxlist = boxlist + box + '<img src=' + eventpics[i] + ' width="150"><section class="eventtext"><h3>' + eventnames[i] + '</h3><div>' + eventvenues[i] + ', ' + city + '</div><div>' + eventtimes[i] + '  ' + eventdates[i] + '</div><a href=' + eventticketlinks[i] +'>Tickets</a></section></div>';
    }
    //document.getElementById("boxes").innerHTML = '<div class="eventbox"><h3> Event name </h3><div>Location</div> <div> date and time </div> <div> Information </div></div>';

    if (eventnumber == 0)
    {
        boxlist = boxlist + box + '<h3>No Events Around You Listed For Today</h3></div>';
    }

    boxlist = boxlist + box + '<h3>Data Provided By <a href=https://www.ticketmaster.com>TicketMaster</a></h3></div>';

    document.getElementById("boxes").innerHTML = boxlist;

    boxlist = '';
    eventnames = [];
    eventdates = [];
    eventtimes = [];
    eventvenues = [];
    eventticketlinks = [];
    eventpics = [];
}

function getDate() {
    var today = new Date();
    today.setHours(today.getHours() - 6);
    var latertoday = new Date(today);
    latertoday.setHours(latertoday.getHours() + 18);
    date = (new Date(today)).toISOString().slice(0, 19).replace("'T'", " ");
    //date = (new Date(today)).toISOString().slice(0, 10).replace("'T'", " ")+"T20:00:00";
    enddate = (new Date(latertoday)).toISOString().slice(0, 19).replace("'T'", " ");
    //document.getElementById("eventwidget").innerHTML = enddate ;
}


  function timeAdjuster(timestring) {

    var res;
    var num;
    var end;


    num = timestring.substr(0,2);


    if (num >= 12)
    {
        end = " PM";
    }
    else
    {
        end = " AM";
    }

    if (num > 12)
    {
        res = (num - 12) + timestring.substr(2,3);
    }
    else
    {
        res = timestring.substr(0,5);
    }

    res = res + end;

    return res;
  }

  function dateAdjuster() {
      for (i = 0; i < eventnumber; i++) {
          eventdates[i] = eventdates[i].substr(5,2) + '/' + eventdates[i].substr(8,2);
      }
  }
