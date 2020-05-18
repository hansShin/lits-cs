<?php
/*
 List of functions for Computer Labs Calendar App.
 */

function parseCSV($csvURL){
    // Parses a CSV from a URL, and loads them into a two dimensional array.
    // First row of CSV data becomes the 2nd level of Arrays' Keys.
    // Returns a two dimensional array.
    $row = 1;
    $keys = array();
    $schedule = array();
    if (($handle = fopen($csvURL, "r")) !== FALSE) {
        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            if ($row == 1) {
                $keys = $data;
            } elseif ($row != 1) {
                $data = array_combine($keys, array_values($data));
                array_push($schedule, $data);
            }
            $row++;
        }
        fclose($handle);
    }
    return $schedule;
}

function isTodayClosed($csvURL){
    // Determines whether today is a Closed date.
    // Uses parseCSV to parse closed dates from CSV.
    // Handles dates as m-d
    // Returns an array, with it's first value being True or False, and its second being Holiday Name or N/A
    $closedStatus = FALSE;
    $closedReason = "";
    $closedDates = array();
    $closedDates = parseCSV($csvURL);
    $todayDate = date("m-d");
    foreach ($closedDates as $closedDay){
        if ($closedDay["Day"] == $todayDate) {
            $closedStatus = TRUE;
            $closedReason = $closedDay["Holiday"];
        }
    }
    return array($closedStatus, $closedReason);
}

function isTodayMaintenance($csvURL){
    // Determines whether today is a Maintenance date.
    // Uses parseCSV to parse closed dates from CSV.
    // Handles dates as m-d
    // Returns an array, with it's first value being True or False
    $closedStatus = FALSE;
    $closedDates = array();
    $closedDates = parseCSV($csvURL);
    $todayDate = date("m-d");
    foreach ($closedDates as $closedDay){
        if ($closedDay["Day"] == $todayDate) {
            $closedStatus = TRUE;
        }
    }
    return $closedStatus;
}

function isTodaySpecial($csvURL){
    // Determines whether today is a special schedule date.
    // Uses parseCSV to parse closed dates from CSV.
    // Handles dates as m-d
    // Returns an array, with it's first value being True or False, and if True, its second being Open time, and third being Close Time
    $specialStatus = FALSE;
    $specialDayOpen = "";
    $specialDayClose = "";
    $specialDates = array();
    $specialDates = parseCSV($csvURL);
    $todayDate = date("m-d");
    foreach ($specialDates as $specialDay){
        if ($specialDay["Day"] == $todayDate) {
            $specialStatus = TRUE;
            $specialDayOpen = $specialDay["Open"];
            $specialDayClose = $specialDay["Close"];
        }
    }
    return array($specialStatus, $specialDayOpen, $specialDayClose);
}

function sessionCode($session) {
    // Determines what the session is, and assigns it a numerical value
    // 0 = Normal
    // 1 = Summer
    // 2 = January Session
    // 3 = Summer Intersession
    // 4 = Spring Recess
    // 5 = Winter Recess
    $sessionCode = 0;
    if ($session == "Normal") {
        $sessionCode = 0;
    } elseif ($session == "Summer") {
        $sessionCode = 1;
    } elseif ($session == "January Session") {
        $sessionCode = 2;
    } elseif ($session == "Summer Intersession") {
        $sessionCode = 3;
    } elseif ($session == "Spring Recess") {
        $sessionCode = 4;
    } elseif ($session == "Winter Recess") {
        $sessionCode = 5;
    } else {
        $sessionCode = 0;
    }
    return $sessionCode;
}

function currentSession($csvURL) {
    // Determines what academic session / schedule are we in based on dates.
    // Uses parseCSV to parse closed dates from CSV.
    // Handles dates as m-d
    // Returns sessionCode function values
    $sessionRange = '';
    $sessionDates = parseCSV($csvURL);
    $todayDate = new DateTime(date("Y-m-d"));
    foreach ($sessionDates as $session){
        $startDate = new DateTime($session["Start"]);
        $endDate = new Datetime($session["End"]);
        if ($startDate <= $todayDate AND $todayDate <= $endDate) {
            $sessionRange = $session["Session"];
        }
    }
    return sessionCode($sessionRange);
}

?>
