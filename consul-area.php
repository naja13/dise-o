<?php 



    function distanceCalculation($point1_lat, $point1_long, $point2_lat, $point2_long, $unit = 'km', $decimals = 8) {
        $degrees = rad2deg(acos((sin(deg2rad($point1_lat))*sin(deg2rad($point2_lat))) + (cos(deg2rad($point1_lat))*cos(deg2rad($point2_lat))*cos(deg2rad($point1_long-$point2_long)))));
        switch($unit) {
            case 'km':
            
                $distance = $degrees * 111.13384; 
                break;
            case 'mi':
                $distance = $degrees * 69.05482;
                break;
            case 'nmi':
                $distance =  $degrees * 59.97662;
        }
        return round($distance, $decimals);
    }


    $con=mysqli_connect("mydb.cqa6xge5dfnw.us-east-1.rds.amazonaws.com","DB","JersonPerez","diseno");

	if ($con) {
        $lat=$_POST['lat'];
        $latmax=$_POST['latmax'];
        $latmin=$_POST['latmin'];
        $long=$_POST['long'];
        $longmax=$_POST['longmax'];
        $longmin=$_POST['longmin'];
        $rad=$_POST['radio'];
        

            $datos = mysqli_query($con, "SELECT * FROM dsyrus WHERE  lat BETWEEN '$latmin' AND '$latmax' AND lng BETWEEN '$longmax' AND '$longmin' ORDER BY ID ASC");
            if(mysqli_num_rows($datos)>0){
    
                $jdatos=array();
                while($vdatos = mysqli_fetch_array($datos)){
                    $dis = distanceCalculation($vdatos['lat'],$vdatos['lng'],$lat,$long);
                    if (($dis*1000)<$rad) {
                        $jdatos[]=array(
                            'ID'=>$vdatos['ID'],
                            'Fecha'=>$vdatos['Fecha'],
                            'Latitud'=>$vdatos['lat'],
                            'Longitud'=>$vdatos['lng']
                        );
                    }
                }

                $vjdatos= json_encode($jdatos);
                echo $vjdatos;

            }   
        
    }

 ?>