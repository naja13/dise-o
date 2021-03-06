



console.log("Go");



document.getElementById("centrar").style.display="none";
document.getElementById("borrec").style.display="none";
posact_fn = null;
var posact = function(){
    if(posact_fn == null){
        ref();
        posact_fn = setInterval(ref, 5000);
        document.getElementById("centrar").style.display="block";
        document.getElementById("borrec").style.display="block";
        document.getElementById("buscar").value="Detener Rastreo";
    }

    else{
        clearInterval(posact_fn);
        posact_fn = null;
        document.getElementById("centrar").style.display="none";
        document.getElementById("borrec").style.display="none";
        document.getElementById("buscar").value="Rastrear Dispositivo";
    }
}


var gMapa= null;
var gLatLon= null;

var imap = function(){
    var divMapa=document.getElementById('mapa');
    gLatLon = new google.maps.LatLng(11.02040,-74.85155);   
    gMapa = new google.maps.Map(divMapa,{ zoom: 15, center: gLatLon}); 
}
imap();


var flightPath = [];
var poliforid=function(jdatos){
    let polvec=[];
    let polhis=[];
    let i=0;
    let aid=null;

    let c=0;
    jdatos.forEach(jdato =>{
        if(i==0){
            aid=jdato.ID-1;
        }
        polvec.push(new google.maps.LatLng(jdato.Latitud, jdato.Longitud)); 
        if(aid!= (jdato.ID-1)){
            polvec.pop();
            polhis.push(polvec);
            polvec=[];
            aid=jdato.ID-1; 
            c=1;
        }
        aid=aid+1;
        i=1;
    });

    if(c==0){
        polhis.push(polvec);
    }

    flightPath = [];
    var color=null;

    var ii=0;
    polhis.forEach(polvec =>{
        var markerh=null;
        var markersh=[];
        color = give_color();
        polvec.forEach(point =>{
            var inf='El auto pasó por aquí el '+jdatos[ii].Fecha;

            markerh = new google.maps.Marker({
                position: point, 
                map: gMapa, 
                title:inf,
                icon:{
                   url     : "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle_blue.png",
                   size    : new google.maps.Size( 5, 5 ),
                   anchor  : new google.maps.Point( 3, 3 )
               }
            }); 
            markersh.push(marker); 
            ii=ii+1; 
        })


        let ft=new google.maps.Polyline({path:polvec,strokeColor: color ,strokeOpacity:0.8,strokeWeight:8});
        ft.setMap(gMapa);
        flightPath.push(ft);
    })

}


var deletepoli=function(){
    flightPath.forEach(ft =>{
        ft.setMap(null);
    })
}







var jdatoG=null; 
var circle=null;
var idraw =function(){

    var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControlOptions:{
            drawingModes:['marker','circle']
        }
    });
    drawingManager.setMap(gMapa);

    circle=null;

    google.maps.event.addListener(drawingManager,'overlaycomplete',function(event){

        if(event.type=='circle'){
            var center=event.overlay.getCenter();
            circle={
                radius:event.overlay.getRadius(),
                center:{
                    lat:center.lat(),
                    long:center.lng()
                },
                overLay:event.overLay
            }
        }
        
        var circleJson={'lat':circle.center.lat,'lng':circle.center.long,'rad':circle.radius};


        var R= 6378137; 
        var latr=(Math.PI*circleJson.lat)/180;
        var lngr=(Math.PI*circleJson.lng)/180;

        var latmax=(180/Math.PI)*Math.asin( Math.sin(latr)*Math.cos(circle.radius/R) + Math.cos(latr)*Math.sin(circle.radius/R));
        var latmin=(180/Math.PI)*Math.asin( Math.sin(latr)*Math.cos(circle.radius/R) - Math.cos(latr)*Math.sin(circle.radius/R));
        var longmax=(180/Math.PI)*(lngr + Math.atan2(Math.sin(circle.radius/R)*Math.cos(latr),Math.cos(circle.radius/R)-Math.sin(latr)*Math.sin(latr)));
        var longmin=(180/Math.PI)*(lngr + Math.atan2(-Math.sin(circle.radius/R)*Math.cos(latr),Math.cos(circle.radius/R)-Math.sin(latr)*Math.sin(latr)));

        limLatLon={'lat':circleJson.lat,'latmax':latmax,'latmin':latmin,'long':circleJson.lng,'longmax':longmax,'longmin':longmin,'radio':circleJson.rad};
        let datos = function(){ 
            let tmp = null;
            $.ajax({
                'async': false,
               'type' : "POST",
                'global' : false,
                'url' : "consul-area.php",
                'data': limLatLon,
                'success' : function (data){
                    tmp = data
                }
            }); 
            return tmp
        }();
        let jdatos=JSON.parse(datos);
        jdatoG = jdatos;
        console.log(jdatos);
        poliforid(jdatos);

    })

}



var markers = []; // vector que guardará los marcadores a mostrar
var pos=[]; //vector que guardará posiciones para la polilinea
var marker = new google.maps.Marker({position: gLatLon, map: gMapa}); // primer marcador por defecto
marker.setMap(null); 
markers.push(marker);
var trayecact=[];

function ref(){
    console.log("firme");
    let datos = function(){ //la función datos hace la solisitud a la BD con datos.php
        let tmp = null;
        $.ajax({
            'async': false,
            'type' : "POST",
            'global' : false,
            'url' : "consul-actual.php",
            'success' : function (data){
                tmp = data
            }
        }); 
        return tmp
    }(); 
    let jdatos=JSON.parse(datos);
    var jdato=jdatos[0]
    trayecact.push(jdato);
    console.log(trayecact);
    document.getElementById('id').innerHTML=jdato.ID;
    document.getElementById('fecha').innerHTML=jdato.Fecha;
    document.getElementById('latitud').innerHTML=jdato.Latitud;
    document.getElementById('longitud').innerHTML=jdato.Longitud;

    refrescar_marcador(jdato.Latitud, jdato.Longitud);
    poliforid(trayecact);
}

//Función que refresca el marcador
var marker=null;
function refrescar_marcador(latitud, longitud){

    marker = new google.maps.Marker({position: new google.maps.LatLng(latitud, longitud), map: gMapa}); //Se establece el marcador en función de la posición dada y el mapa gMapa creado
    markers.push(marker); //Se agrega al array markers el nuevo marcador
    markers[markers.length - 2].setMap(null); //Se elimina del mapa el marcador anterior
    markers.shift(); //Eliminar del array markers el anterior marcador para evitar uso innesesario de memoria
    
}


var centrar =function(){
    gMapa.setCenter(marker.getPosition()); //Se centra el mapa en la posición del marcador colocado en el mapa
}







//Consulta por fecha

function refconsul(){

    var h1 =document.getElementById('h1').value;
    var f1 =document.getElementById('f1').value;
    var h2 =document.getElementById('h2').value;
    var f2 =document.getElementById('f2').value;

    if(h1==0){
        h1="00:00:00"; 

    }
        else{
            h1=h1+":00";
        }


    if(h2==0){
        h2="23:59:59"; 

    }
        else{
            h2=h2+":00";
        }

    
    
    

    var fh1=f1+" "+h1;
    var fh2=f2+" "+h2;

    var intJson={"t1":fh1 , "t2":fh2}; //Json que se enviará a php
    console.log(intJson);


    if ( circle==null){ //Si no se ha hecho una consulta por área 
        var datos = function(){ 
            let tmp = null;
            $.ajax({
                'async': false,
                'type' : "POST",
                'global' : false,
                'url' : "consul-hist.php",
                'data': intJson,
                'success' : function (data){
                    tmp = data
                }
            }); 
            return tmp
        }(); 
        let jdatos=JSON.parse(datos);
        let polhis=[];
        jdatos.forEach(jdato =>{  polhis.push(jdato); });
        poliforid(polhis);
    }else{ //Dado el caso que si haya anteriormente una consulta por área

        deletepoli();
        var polhis=[];  
        console.log(intJson.t1);
        console.log(intJson.t2);
        jdatoG.forEach(jdato =>{  
            if((intJson.t1<jdato.Fecha) && (jdato.Fecha<intJson.t2)){
                polhis.push(jdato);
            }
        });
        poliforid(polhis);
        circle=null;
    }

}


//Función para hallar 
var getKilometros = function(lat1,lon1,lat2,lon2)
 {
     rad = function(x) {return x*Math.PI/180;}
    var R = 6378.137; //Radio de la tierra en km
     var dLat = rad( lat2 - lat1 );
     var dLong = rad( lon2 - lon1 );
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
     var d = R * c;
    return d.toFixed(3); //Retorna tres decimales
 }



//  Genrador de colores aleatorios

var aleatorio = function (inferior,superior){ 
   numPosibilidades = superior - inferior 
   aleat = Math.random() * numPosibilidades 
   aleat = Math.floor(aleat) 
   return parseInt(inferior) + aleat 
}

var  give_color = function(){ 
   hexadecimal = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F") 
   color_aleatorio = "#"; 
   for (i=0;i<6;i++){ 
      posarray = aleatorio(0,hexadecimal.length) 
      color_aleatorio += hexadecimal[posarray] 
   } 
   return color_aleatorio 
}
