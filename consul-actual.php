<?php 
 $con=mysqli_connect("mydb.cqa6xge5dfnw.us-east-1.rds.amazonaws.com","DB","JersonPerez","diseno");
 if ($con) {
	$datos =$con -> query("SELECT ID,Fecha,lat,lng from dsyrus order by ID desc limit 100");
	$vdatos=mysqli_fetch_row($datos);
	$json[]=array(
		'ID'=>$vdatos[0],
		'Fecha'=>$vdatos[1],
		'Latitud'=>$vdatos[2],
		'Longitud'=>$vdatos[3]
	);
	$jsontring=json_encode($json);
	echo $jsontring;
}

 ?>