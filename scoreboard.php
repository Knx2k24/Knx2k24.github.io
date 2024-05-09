<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SCOREBOARD</title>
</head>
<body>
    <div id="title">
        SCOREBOARD
    </div>
    <div id="tableContainer">
        <?php
            $conn = new mysqli("192.168.100.18", "adminDebug", "admin123", "testing");
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
                echo "Błąd połączenia";
            }
            $query = "SELECT nick, max(score) FROM scoreboard GROUP BY nick ORDER BY score DESC LIMIT 10"; 
            $result = mysqli_query($conn, $query);

            $scoreIndex = 1;

            echo "<table><tr><th>NICK</th><th style='text-align:right;'>SCORE</th></tr>";

            while($row = mysqli_fetch_array($result)){
                echo "<tr><td class='scoreIndex' id='sIndex_".$scoreIndex."'>".$scoreIndex."</td><td class='nickCell'>" . htmlspecialchars($row['nick']) . "</td><td>" . htmlspecialchars($row['max(score)']) . "</td></tr>";
                $scoreIndex++;
            }

            echo "</table>";
            $conn -> close();
        ?>
    </div>

    <div class="credits">
        Autor: <hr> Kacper Dyduch <br> kierunek Technik Programista
    </div>

    <script>
        function autoRefresh() {
            window.location = window.location.href;
        }
        setInterval('autoRefresh()', 5000);
    </script>
    <style>
        @font-face {
        font-family: minecraft;
        src: url(fonts/MinecraftTen-VGORe.ttf);
        }
        #title{
            text-align:center;
            font-size: 500%;
        }
        #sIndex_1{
            font-size: 55px;
            color: gold;
        }
        #sIndex_2{
            font-size: 45px;
            color: goldenrod;
        }
        #sIndex_3{
            font-size: 35px;
            color: peru;
        }
        .scoreIndex{
            font-size: 30px;
        }
        .nickCell{
            width: 70%;
            letter-spacing:2px;
        }
        table{
            font-size:300%;
            position:absolute;
            width: 50%;
            left:25%;
        }
        table, td{
            border-bottom: 1px white solid;
            border-collapse: collapse;
        }
        body{
            font-family: minecraft;
            color: white;
            background-color: black;
        }

        .credits{
            color: white;
            padding: 1rem;
            text-align: right;
            position: absolute;
            bottom: 0px;
            right: 0px;
            font-size: 1rem;
            font-weight: 800;
            align-self: baseline;
            font-family: 'Courier New', Courier, monospace;
        }
    </style>
</body>
</html>