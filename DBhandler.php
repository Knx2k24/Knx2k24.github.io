<?php
    $nick = $_POST["nick"];
    $score = $_POST["score"];
    $date = $_POST["date"];
    $debug = $_POST["debugOn"];
    $notes = $_POST["notes"];
    

    $conn = new mysqli("192.168.100.18", "adminDebug", "admin123", "testing");
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
        echo "Błąd połączenia";
    }
    $insertQuery = mysqli_query($conn,"insert into testing.scoreboard (nick, score, date, debug, notes) values ('$nick', $score, '$date', $debug, '$notes');");
    
    echo "Pomyślnie dodano!";

    $conn -> close();
?>