var tablero = [[], [], [], [], [], [], []];

var jugador_actual = 'X'  // X persona; O es la ia

var ALTURA_MAXIMA = 6

function cambiar_jugador(){
    if(jugador_actual == 'X')
        return 'O'
    else
        return 'X'
}

function meter_ficha(columna){
    if (tablero[columna].length < ALTURA_MAXIMA)
        tablero[columna].push(jugador_actual)
}

function hay_ganador(){
    cont = 1
    // columnas
    for (var i = 0; i <tablero.length;i++){ 
        var ficha_ant = ''
        var columna = tablero[i]
        for (var j = 0; j<columna.length; j++){
            var ficha=columna[j];
            if (ficha_ant == ficha)
                cont += 1
            else
                cont = 1
            if (cont == 4)
                return ficha
            ficha_ant = ficha
        }
    }
    // filas
    var filas = get_filas()
    var posible_ganador_filas = hay_4_seguidos(filas)
    if (posible_ganador_filas != '-')
        return posible_ganador_filas

    // diagonales
    // daigonales hacia la derecha
    var diagonales = get_diagonales()
    var posible_ganador_diag = hay_4_seguidos(diagonales)
    if (posible_ganador_diag != '-')
        return posible_ganador_diag
    return '-'
}

function get_filas(){
    var filas = []
    for(var i = 0 ; i< ALTURA_MAXIMA;i++){
        var fila = [];
        for  (var j = 0; j< 7 ;j++){

            if(tablero[j].length <= i)
                fila.push('-');
            else
                fila.push(tablero[j][i]);
             //columna[i] if i < len(columna) else '-' for columna in tablero
        }
        filas.push(fila)
    }

    return filas
}

function hay_4_seguidos(lineas){
    var cont = 1
    for (var i = 0; i <lineas.length;i++){ 
        var ficha_ant = ''
        var linea = lineas[i]
        for (var j = 0; j<linea.length; j++){
            var ficha=linea[j];
            if (ficha_ant != '-' && ficha_ant == ficha)
                cont += 1
            else
                cont = 1
            if (cont == 4)
                return ficha
            ficha_ant = ficha
        }
    }
    return '-';
}

function get_diagonales(){
    var filas = get_filas()
    // daigonales hacia la derecha
    var diagonales = []
    for (var i = 0;i<ALTURA_MAXIMA; i++){
        var diagonal_arriba = [];//[filas[j + i][j] for j in range(ALTURA_MAXIMA) if i + j < ALTURA_MAXIMA]
        for (var  j = 0; j<7; j++){
            if (i + j < ALTURA_MAXIMA)
                diagonal_arriba.push(filas[j + i][j])
        }

        var diagonal_abajo = []//filas[j][j + i] for j in range(ALTURA_MAXIMA) if i + j < len(tablero)
        for (var  j = 0; j<ALTURA_MAXIMA; j++){
            if (i + j < 7)
                diagonal_abajo.push(filas[j][j + i]);
        }
        if (i != 0 && (diagonal_abajo).length > 3) // para que no se duplique la primera diagonal
            diagonales.push(diagonal_abajo)
        diagonales.push(diagonal_arriba)
    }

        // diagonales hacia la izquierda
    for (var i = 0 ; i< ALTURA_MAXIMA; i++){
        var diagonal_arribaIz = [] //filas[j][-j - 1 - i] for j in range(ALTURA_MAXIMA) if -j - 1 - i >= -7
        for (var  j = 0; j<ALTURA_MAXIMA; j++){
            if (-j - 1 - i >= -7)
                diagonal_arribaIz.push(filas[j][ 7 -j - 1 - i]);
        }

        var diagonal_abajoIz = [] //filas[j + i][-j - 1] for j in range(ALTURA_MAXIMA) if j + i < ALTURA_MAXIMA
        for (var  j = 0; j<7; j++){
            if (j + i < ALTURA_MAXIMA)
                diagonal_abajoIz.push(filas[j + i][ 7 -j - 1]);
        }

        diagonales.push(diagonal_abajoIz)
        if (i != 0 && (diagonal_arribaIz).length > 3)  // para que no se duplique la primera diagonal
            diagonales.push(diagonal_arribaIz)
    }
    return diagonales
}


function get_abiertos(){
    var columnas = [3,4,2,5,1,6,0] //con este orden se priorizan las columnas del medio
    for (var i = 0 ; i< tablero.length;i++){
        if ((tablero[i]).length >=ALTURA_MAXIMA){
            index = columnas.indexOf(i);
            columnas.splice(index, 1);
        }
    }
    return columnas //[i for i in range(len(tablero)) if len(tablero[i]) < ALTURA_MAXIMA
}

function imprimir_tablero(){
    var str = "";
    var filas = get_filas()
    for (var i = filas.length -1 ; i>=0 ; i--){
        str+= "|"
        for  (var j = 0; j < 7 ;j++){
            str += filas[i][j] + "|";
        }
        str +="\n";  
    }
    str+="|0|1|2|3|4|5|6|";
    console.log(str)
}


function minimax_alpha_beta(profundidad, alpha, beta, jugador){
    ganador = hay_ganador()
    if (ganador == 'X')
         return {heu : -1000000, pos :-1}
    if (ganador == 'O')
         return  {heu : 1000000, pos :-1}
    if( profundidad == 0)
        return {heu : heuristico(), pos :-1}
    if (jugador == 'O'){
        var valor = -10000000
        var abiertos = get_abiertos()
        var posicion_mejor = 0
        var mejor_valor = -100000000
        var heuristicos = [];
        for (var i = 0 ; i<abiertos.length;i++){
            
            var pos=abiertos[i];
            tablero[pos].push(jugador) // # "generar" estado hijo
            var posibleMejor =minimax_alpha_beta(profundidad - 1, alpha, beta, 'X').heu
            valor = Math.max(valor, posibleMejor)
            tablero[pos].pop() // # volver al estado actual
            alpha = Math.max(alpha, valor)
            if (profundidad == 8){
                heuristicos.push(posibleMejor)
                if(i==abiertos.length-1) {console.log(heuristicos); console.log(abiertos)}
            }
            if (alpha >= beta)
                break  //# poda
            if (valor > mejor_valor){  //# guardar la columna de la mejor jugada
                mejor_valor = valor
                posicion_mejor = pos
            }
        }
        return {heu : valor, pos : posicion_mejor}
    }
    else{
        var valor2 = 10000000
        var abiertos = get_abiertos()
        for (var i = 0 ; i<abiertos.length;i++){
            var pos=abiertos[i];
            tablero[pos].push(jugador)
            valor2 = Math.min(valor2, minimax_alpha_beta(profundidad - 1, alpha, beta, 'O').heu)
            tablero[pos].pop()
            beta = Math.min(beta, valor2)
            if (alpha >= beta)
                break  //# poda
        }
        return {heu : valor2, pos : -1}
    }
}

function heuristico(){
    //# sobre el tablero acutal
    var valor = 0
    var filas = get_filas()
    var diagonales = get_diagonales()
    var columnas = [] //[fila[i] for fila in filas] for i in range(len(filas[0]))
    for (var i=0; i<filas[0].length;i++){
        var col = [];
        for(var j = 0;j<filas.length;j++){
            col.push(filas[j][i]);
        }
        columnas.push(col);
    }

    var lineas = (diagonales.concat(filas)).concat(columnas)
    for (var i = 0 ; i< lineas.length;i++){
        var linea = lineas[i];
        valor += heuristico_linea(linea)
        if (valor<-1000 || valor>1000)
            return valor
    }
    return valor
}

function heuristico_linea(linea){
    //# devuelve el numero de fichas que hay pos cada posible(un jugador puede ganar en ella)
    var puntuacion = 0
    for (var i = 0 ; i < linea.length - 3;i++){
        puntuacion += evaluar_4_elementos(linea.slice(i,4 + i));
        if (puntuacion<-1000 || puntuacion>1000)
            return puntuacion
    }
    return puntuacion
}

    function evaluar_4_elementos(linea){
    //# linea va a tener 4 elementos
    var cant_o = 0
    var cant_x = 0
    for (var i =0; i <linea.length ;i++){
        var elemento = linea[i];
        if (elemento == 'X')
            cant_x += 1
        else if (elemento == 'O')
            cant_o += 1
    }
    if( cant_x == 0)
        if (cant_o == 4)
            return 100000
        else 
            return cant_o
    else if (cant_o == 0)
        if (cant_x==4)
            return -100000
         else 
            return -1 * cant_x
    else
        return 0
}


var inGame;

function setListenersCasillasIa(){
    var haJugadoIa=false
    function clickListenerJcj(pos){
        if(jugador_actual=='X' ){ 
            listenerJugador(pos);
            haJugadoIa=false
        }
        else{
            juegaIa()
            haJugadoIa = true
        }
    }
    
    var filasHtml =[];
    for (var i =0; i<6 ; i++){
        filasHtml.push(document.getElementsByClassName("fila"+i))
    }
    for (var i=0; i< ALTURA_MAXIMA ; i++){
        for(var j=0; j < 7 ;j++){
            const jota = j
            handlerJcIa = function(){
                clickListenerJcj(jota);
                if(!haJugadoIa && inGame)
                    setTimeout(handlerJcIa, 1); // para que se ejecute la funcion de nuevo y entre medias se actualice el tablero 
            }
            filasHtml[i][j].addEventListener("click",handlerJcIa);   
        }
    }
}



function getcolorJugador(jugador){
    if(jugador == 'X')
        return "Amarillo"
    else
        return "Rojo"
}

function listenerJugador(pos){
    var divJugador = document.getElementsByName("turno")[0]
    meter_ficha(pos);
    dibujarTablero();
    
    divJugador.innerHTML ="jugador actual" + getcolorJugador( jugador_actual);
    
    var posible_ganador = hay_ganador()
    if( posible_ganador != '-'){
        divJugador.innerHTML = ("Ganan " + getcolorJugador( jugador_actual))
        resetListeners();
        esconderMostrarBotones(true);
        inGame = false;
    }
    else divJugador.innerHTML ="jugador actual " + getcolorJugador(cambiar_jugador())

    jugador_actual = cambiar_jugador();
}


function juegaIa(){
    var PROFUNDIDAD = 8
    var ALPHA = -1000000000
    var BETA = 1000000000
    var divJugador = document.getElementsByName("turno")[0]
    meter_ficha( minimax_alpha_beta(PROFUNDIDAD, ALPHA, BETA, 'O').pos);
    dibujarTablero();
    var posible_ganador = hay_ganador()
    if( posible_ganador != '-'){
        divJugador.innerHTML = ("Ganan " + getcolorJugador( jugador_actual))
        resetListeners();
        esconderMostrarBotones(true);
        inGame = false;
    }
    else divJugador.innerHTML ="jugador actual " + getcolorJugador( cambiar_jugador());

    jugador_actual = cambiar_jugador()
}


function setListenersCasillasJcj(){
    function clickListenerJcj(pos){
        listenerJugador(pos)
    }

    var filasHtml =[];
    for (var i =0; i<6 ; i++){
        filasHtml.push(document.getElementsByClassName("fila"+i))
    }

    for (var i=0; i< ALTURA_MAXIMA ; i++){
        for(var j=0; j < 7 ;j++){
            const constJ = j
            handlerJcJ = function(){
                clickListenerJcj(constJ)
            }
            filasHtml[i][j].addEventListener("click",handlerJcJ);
        }
    }
}


function dibujarTablero(){
    var filas = get_filas();
    var filasHtml =[];
    for (var i =0; i<7 ; i++){
        var fila = []
        fila = document.getElementsByClassName("fila"+i);
        filasHtml.push(fila)
    }

    for (var i=0; i< filas.length ; i++){
        for(var j=0;j<filas[i].length;j++){
            if(filas[i][j] == 'X'){
                filasHtml[ALTURA_MAXIMA-1-i][j].innerHTML = '<img class="img-fluid" alt="Responsive image" src="./images/ciruclo-amarilllo.png">';
            }
            else if (filas[i][j] == 'O'){
                filasHtml[ALTURA_MAXIMA-1-i][j].innerHTML = '<img class="img-fluid" alt="Responsive image" src="./images/ciruclo-rojo.png">';
            }
        }
    }
}

function vaciarTablero(){
    tablero = [[], [], [], [], [], [], []];
    for (var i =0; i<6 ; i++){
        var fila = []
        fila = document.getElementsByClassName("fila"+i);
        for(j=0;j<fila.length;j++){
            fila[j].innerHTML = '<img class="img-fluid" alt="Responsive image" src="./images/ciruclo-blanco.png">'; 
        }
    }
}


function esconderMostrarBotones(mostrar){
    if(mostrar){
        document.getElementsByName("botonIniciar")[0].style.visibility = "visible"
        document.getElementsByName("botonIniciar")[1].style.visibility = "visible"
    }
    else{
        document.getElementsByName("botonIniciar")[0].style.visibility = "hidden"
        document.getElementsByName("botonIniciar")[1].style.visibility = "hidden"
    }
}

function resetListeners(){
    for (var i =0; i<6 ; i++){
        var fila = []
        fila = document.getElementsByClassName("fila"+i);
        for(j=0;j<fila.length;j++){
            var el =fila[j];
            elClone = el.cloneNode(true);
            el.parentNode.replaceChild(elClone, el);
        }
    }
}


function playGameIa(){
    vaciarTablero();
    esconderMostrarBotones(false);
    
    if( !inGame ){
        setListenersCasillasIa()  
        inGame = true
    }
}

function playGameJcj(){
    vaciarTablero();
    esconderMostrarBotones(false);
    
    if( !inGame ){
        setListenersCasillasJcj()
        inGame = true  
    }
}