<?php 
 $con=mysqli_connect("mydb.cqa6xge5dfnw.us-east-1.rds.amazonaws.com","DB","JersonPerez","diseno");
if ($con) {
	$t1=$_POST['t1'];
	$t2=$_POST['t2'];
	if (!empty($t1)&&!empty($t2)) {
		$datos = mysqli_query($con, "SELECT * FROM dsyrus WHERE Fecha BETWEEN '$t1' AND '$t2' ORDER BY ID ASC");
        if(mysqli_num_rows($datos)>0){
        	$jdatos=array();
            while($vdatos = mysqli_fetch_array($datos)){
                $jdatos[]=array(
        			'ID'=>$vdatos['ID'],
					'Fecha'=>$vdatos['Fecha'],
					'Latitud'=>$vdatos['lat'],
					'Longitud'=>$vdatos['lng']
                );
            }
            $vjdatos= json_encode($jdatos);
            echo $vjdatos;
        }	
	}

}

 ?>