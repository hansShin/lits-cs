<?php

/* Base code provided by Sarah Bailey. Case Western Reserve University, Cleveland OH. scb89@case.edu. */

/////////
//Calendar Configuration
//

//TO DEBUG UNCOMMENT THESE LINES
//error_reporting(E_ALL);
//ini_set("display_errors", 1);

//INCLUDE THE GOOGLE API PHP CLIENT LIBRARY FOUND HERE https://github.com/google/google-api-php-client. DOWNLOAD IT AND PUT IT ON YOUR WEBSERVER IN THE ROOT FOLDER. 
include dirname(__DIR__) . '/vendor/autoload.php';

//SET THE DEFAULT TIMEZONE SO PHP DOESN'T COMPLAIN. SET TO YOUR LOCAL TIME ZONE.
date_default_timezone_set('America/New_York');

//TELL GOOGLE WHAT WE'RE DOING
$client = new Google_Client();
$client->setApplicationName("My Calendar"); //DON'T THINK THIS MATTERS
$client->setDeveloperKey('AIzaSyDbq8WZZ3rnadjQfeE5VnvodMU-LR_icME'); //GET AT AT DEVELOPERS.GOOGLE.COM
$cal = new Google_Service_Calendar($client);
//THE CALENDAR ID, FOUND IN CALENDAR SETTINGS. IF YOUR CALENDAR IS THROUGH GOOGLE APPS, YOU MAY NEED TO CHANGE THE CENTRAL SHARING SETTINGS. THE CALENDAR FOR THIS SCRIPT MUST HAVE ALL EVENTS VIEWABLE IN SHARING SETTINGS.
$calendarId = 'nyu.edu_6c69625f626c636370636c616232@resource.calendar.google.com';
//TELL GOOGLE HOW WE WANT THE EVENTS
$params = array(
	'singleEvents' => true, //CAN'T USE TIME MIN WITHOUT THIS, IT SAYS TO TREAT RECURRING EVENTS AS SINGLE EVENTS
	'orderBy' => 'startTime',
	'timeMin' => date(DateTime::ATOM),//ONLY PULL EVENTS STARTING TODAY
	
);
$events = $cal->events->listEvents($calendarId, $params); //THIS IS WHERE WE ACTUALLY PUT THE RESULTS INTO A VAR

/////////
//Schedule Configuration
//

// Include the list of Functions for deciphering the BLCC Calendar
include dirname(__DIR__) . '/calendarFunctions.php';

// CSV URLs for different schedules
$closedDatesURL = 'https://docs.google.com/spreadsheet/pub?key=0AuMOergFE4WIdEE4cW5UQjJSaUpEWi1vZk8tM3FDNlE&single=true&gid=1&output=csv';
$sessionsURL = 'https://docs.google.com/spreadsheet/pub?key=0AuMOergFE4WIdEE4cW5UQjJSaUpEWi1vZk8tM3FDNlE&single=true&gid=14&output=csv';
$specialDatesURL = 'https://docs.google.com/spreadsheet/pub?key=0AuMOergFE4WIdEE4cW5UQjJSaUpEWi1vZk8tM3FDNlE&single=true&gid=9&output=csv';
$normalScheduleURL = 'https://docs.google.com/a/nyu.edu/spreadsheets/d/1tZi83l07pymhIDhgpz35GSvJzkQ3Kx4VyfEeGYQTRes/pub?gid=0&single=true&output=csv';
$summerScheduleURL = 'https://docs.google.com/spreadsheet/pub?key=0AuMOergFE4WIdEE4cW5UQjJSaUpEWi1vZk8tM3FDNlE&single=true&gid=2&output=csv';
$januaryScheduleURL = 'https://docs.google.com/spreadsheet/pub?key=0AuMOergFE4WIdEE4cW5UQjJSaUpEWi1vZk8tM3FDNlE&single=true&gid=4&output=csv';
$summerIntersessionScheduleURL = 'https://docs.google.com/spreadsheet/pub?key=0AuMOergFE4WIdEE4cW5UQjJSaUpEWi1vZk8tM3FDNlE&single=true&gid=6&output=csv';
$springRecessScheduleURL = 'https://docs.google.com/spreadsheet/pub?key=0AuMOergFE4WIdEE4cW5UQjJSaUpEWi1vZk8tM3FDNlE&single=true&gid=10&output=csv';
$winterRecessScheduleURL = 'https://docs.google.com/spreadsheet/pub?key=0AuMOergFE4WIdEE4cW5UQjJSaUpEWi1vZk8tM3FDNlE&single=true&gid=8&output=csv';

// CSV URL Specific to PC Lab 2 Maintenance
$maintenanceDateURL = 'https://docs.google.com/spreadsheet/pub?key=0AuMOergFE4WIdEE4cW5UQjJSaUpEWi1vZk8tM3FDNlE&single=true&gid=13&output=csv';

// Define Global Variables
$labStatus = FALSE;
$maintenanceMode = FALSE;
$notOpenHours = FALSE;
$holidayName = '';
$todayOpen = '';
$todayClose = '';
$todayTime = date('h:i A');
$beforeClose = FALSE;

// Test if today is a special schedule
$isTodaySpecial = isTodaySpecial($specialDatesURL);

if (!$isTodaySpecial[0]) { // If it is not a special schedule

    // Determine what session are we in
    $session = currentSession($sessionsURL);
    if ($session == 0) {
        $currentSchedule = parseCSV($normalScheduleURL);
    } elseif ($session == 1) {
        $currentSchedule = parseCSV($summerScheduleURL);
    } elseif ($session == 2) {
        $currentSchedule = parseCSV($januaryScheduleURL);
    } elseif ($session == 3) {
        $currentSchedule = parseCSV($summerIntersessionScheduleURL);
    } elseif ($session == 4) {
        $currentSchedule = parseCSV($springRecessScheduleURL);
    } elseif ($session == 5) {
        $currentSchedule = parseCSV($winterRecessScheduleURL);
    } else {
        $currentSchedule = parseCSV($normalScheduleURL);
    }
    
    // Extract Open and Close times for today's date
    $todayDate = date("l");
    //$tomorrowDate = date("l", time()+86400);
    foreach ($currentSchedule as $daySet){
        if ($daySet["Day"] == $todayDate) {
            $todaySchedule = $daySet;
            $todayDate = $daySet["Day"];
            $todayOpen = date('h:iA', strtotime($daySet["Open"]));
            $todayClose = date('h:iA', strtotime($daySet["Close"]));
        }
        //if ($daySet["Day"] == $tomorrowDate) {
        //    $tomorrowSchedule = $daySet;
        //    $tomorrowDate = $daySet["Day"];
        //    $tomorrowOpen = date('h:iA', strtotime($daySet["Open"]));
        //    $tomorrowClose = date('h:iA', strtotime($daySet["Close"]));
        //}
    }
    
} else { // If it is a special schedule
    $todayOpen = date('h:iA', strtotime($isTodaySpecial[1]));
    $todayClose = date('h:iA', strtotime($isTodaySpecial[2]));
}

// Verify if we are open
if (!(strtotime($todayOpen) <= strtotime($todayTime) AND strtotime($todayTime) < strtotime($todayClose))) {
    $labStatus = FALSE;
    $notOpenHours = TRUE;
} else {
    $labStatus = TRUE;
    // Time left before lab is closed
    if (strtotime($todayClose) - strtotime($todayTime) <= 900) {
        $timeLeftClose = intval(date('i', round((strtotime($todayClose) - strtotime($todayTime))/60)*60));
        $beforeClose = TRUE;
    }
}

// Test if today is closed due to holiday
$isTodayClosed = isTodayClosed($closedDatesURL);

if ($isTodayClosed[0] == TRUE) {
    $labStatus = FALSE;
    $holidayName = $isTodayClosed[1];
}

// Test if today is closed due to maintenance
$isTodayMaintenance = isTodayMaintenance($maintenanceDateURL);

if ($isTodayMaintenance) {
    $labStatus = FALSE;
    $maintenanceMode = TRUE;
}

?>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="refresh" content="60" />
<title>Bobst Library Computer Center PC Lab 2</title>

<link rel="stylesheet" type="text/css" href="../css/style.css" media="screen" />
<script class="jsbin src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>

</head>
<body onload="startTime()">
    <div id="schedule">
        <div class="headtitle">Computer Classroom 2</div>
        <div class='datetitle'>
            <?php echo date('l - M j, Y'); ?>
        </div>

<?php

$currentTime = time();
$sessionFlag = FALSE;
$beforeFlag = FALSE;
$beforeClass = FALSE;

$items_shown=0;
$event_error="<p>There are no classes or events scheduled today.</p>";

if ($labStatus == TRUE){
    foreach ($events->getItems() as $event) {
        //Convert date to month and day
        $eventDateStr = $event->start->dateTime;
        $eventDateEnd = $event->end->dateTime;
        if(empty($eventDateStr)) {
            // it's an all day event
            $eventDateStr = $event->start->date;
            $eventDateEnd = $event->end->date;
        }
        
        $temp_timezone = $event->start->timeZone;
        
        if(!empty($temp_timezone)) {
            $timezone = new DateTimeZone($temp_timezone); //GET THE TIME ZONE
        } else {
            $timezone = new DateTimeZone("America/New_York"); //Set your default timezone in case your events don't have one
        }
        
        $eventdate = new DateTime($eventDateStr,$timezone);
        $eventdateEnd = new DateTime($eventDateEnd,$timezone);
        
        if(($eventdate->format("j")) != (date("j"))) { //ENDS FOR LOOP IF DATE IS DIFFERENT THAN TODAY
            break;
        }
        
        $startTime = $eventdate->format("g:ia");//CONVERT REGULAR EVENT DATE TO LEGIBLE TIME
        $endTime = $eventdateEnd->format("g:ia");
        
        ?>
	<div class="event">
	    <div class="time"><?php echo $startTime; ?> - <?php echo $endTime; ?></div>
            <div class="title"><?php echo $event->summary; ?></div>
            </div>
        <?php
        
        if ($sessionFlag == FALSE) {
            if (strtotime($startTime)<=$currentTime AND $currentTime<strtotime($endTime)) {
                $sessionFlag = TRUE;
                $labStatus = FALSE;
            }
        }
        if ($beforeFlag == FALSE) {
            if (strtotime($startTime) - strtotime($todayTime) <= 900) {
                $beforeClass = TRUE;
                $timeLeftClass = intval(date('i', round((strtotime($startTime) - strtotime($todayTime))/60)*60));
            }
        }
        ++$items_shown; //INCREASE ITEMS SHOWN COUNT
        ++$count; //INCREASE COUNT AND START AGAIN.
    }
}

if (!$items_shown) {
    echo $event_error;
}

?>

    </div>
    <div id="footer">
        <div id="timeClock"><?php echo date("h:iA"); ?></div>
    <?php if ($labStatus == FALSE) { ?>
        <div id="labStatus" style="background-color:red;">
            <span>Lab is closed
            <?php
            if($holidayName) { echo "due to $holidayName"; }
            elseif($sessionFlag) { echo "due to class"; }
            elseif($maintenanceMode) {echo "due to maintenance"; }
            // BETA: Second Line - When will we re-open
            // elseif($notOpenHours) {echo "<br />We will re-open<br />tomorrow at $tomorrowOpen"; }
            ?></span>
        </div>
    <?php } elseif ($labStatus == TRUE AND $beforeClose == TRUE) { ?>
        <div id="labStatus" style="background-color:orange;"><span>Lab will close in <?php echo $timeLeftClose; if ($timeLeftClose < 2){ echo " min."; } else { echo " mins."; } ?></span></div>
    <?php } elseif ($labStatus == TRUE AND $beforeClass == TRUE) { ?>
        <div id="labStatus" style="background-color:orange;"><span>Lab will close for class<br />in <?php echo $timeLeftClass; if ($timeLeftClass < 2){ echo " min."; } else { echo " mins."; } ?></span></div>
    <?php } elseif ($labStatus == TRUE) { ?>
        <div id="labStatus" style="background-color:green;"><span>Lab is open</span></div>
    <?php } ?>
    </div>
</body>
</html>
