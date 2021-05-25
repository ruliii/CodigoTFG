/* LIBRERIAS*/
var Cloudant = require('@cloudant/cloudant');
var openwhisk = require("openwhisk");

/* VARIABLES DE CLOUDANT */
var plugins = {
    plugins: { 
        iamauth: { 
            iamApiKey: "apiKey"
        } 
    } 
}
var cloudant = new Cloudant({
    url: "url", 
    username:"username",
    password:"password"
});

const databaseName = "listascompra";

/* OPCCIONES DESDE ENTORNO */
var options = {
    apihost:process.env.__OW_API_HOST,
    api_key:process.env.__OW_API_KEY
}
var ow = openwhisk(options);

const blocking = true;
const result = true;
/* FUNCIONES DE LOGGIN */
/**
 * Funcion que crea un string con la fecha y la hora de la ejecucion
 * @author ruliii
 * @version 1.0
 * @returns {string} Un string con la fecha y hora
 */
function fecha(){
    let date = new Date();
    var dia = date.getDate();
    var mes = date.getMonth();
    var annio = date.getFullYear();
    var hora = date.getHours();
    var minutos = date.getMinutes();
    var segundos = date.getSeconds();
    var miliseg = date.getMilliseconds();
    return dia + "/" + mes + "/" + annio + "-"+ hora + ":" + minutos + ":" + segundos+":"+miliseg;
}
/**
 * Funcion que crea un string con un mensaje de log 
 * @author ruliii
 * @version 1.0
 * @param {string} fuctionName Nombre de la funcion
 * @param {string} mensaje Mensaje de log
 * @returns {string} Un string con el mensaje de log
 */
function logMessage(fuctionName,mensaje){
    console.log( "Ejecutando: " + fuctionName+"--"+mensaje+"("+fecha()+")");
}
/* FUNCIONES */
/**
 * Funcion para crear una nueva lista en la base de datos
 * @author ruliii
 * @version 1.0
 * @param {JSON} slots un json con los parametros de invocacion de la skill
 * @returns {JSON} response con el mensaje que alexa responde
 */
function newList(slots){
    console.log("newList: Creando variables");
    var lista = slots.lista.value;
    const database = cloudant.use(databaseName);
    var doc = {
        _id:lista,
        nombre:lista,
        elementos: []
    };
    console.log("newList: Creando documento");
    database.insert(doc);
    var response = {
        version:"1.0",
        response:{
            shouldEndSession:true,
            outputSpeech:{
                type:"PlainText",
                text:"La lista "+lista+" se ha creado correctamente"
            }
        }
    };
    console.log("newList: Devolviendo respuesta");
    return {
        statusCode: 200,
        headers: {
            "Content-Type":"application/json"
        },
        body:response
    }
}

/* FUNCION CREAR LISTA PERO CON INVOCACION DE OTRA ACCION*/
/**
 * Funcion para crear una nueva lista en la base de datos mediante invocacion de una accion
 * en el espacion de nombres de la skill
 * @author ruliii
 * @version 1.0
 * @param {JSON} slots un json con los parametros de invocacion de la skill 
 * @returns {JSON} response con el mensaje que alexa responde
 */
function newListInvokation(slots){
    logMessage("newList","Creando variables");
    var lista = slots.lista.value;
    var document = {
        _id:lista,
        nombre:lista,
        elementos: []
    };
    var  name = "alexa/create_document";
    var params = {
        database: databaseName,
        doc: document
    };
    logMessage("newList","Invocando accion create_document");
    var response = ow.actions.invoke({name,blocking,result,params}).then(
        function(result){
            var response = {
                version:"1.0",
                response:{
                    shouldEndSession:true,
                    outputSpeech:{
                        type:"PlainText",
                        text:"La lista "+lista+" se ha creado correctamente"
                    }
                }
            };
            console.log("newList: Creando respuesta");
            return {
                statusCode: 200,
                headers: {
                    "Content-Type":"application/json"
                },
                body:response
            }
        }).catch(
            function(err){
                logMessage("newList",err);
                var response = {
                    version:"1.0",
                    response:{
                        shouldEndSession:true,
                        outputSpeech:{
                            type:"PlainText",
                            text: "Error al crear la lista"
                        }
                    }
                };
                logMessage("newList","Creando respuesta de error");
                return {
                    statusCode: 200,
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body:response
                }
            }
        );
        while(!response){print(response);continue;}
        logMessage("newList","Devolviendo respuesta");
        return response;
}

/**
 * Funcion para eliminar lista en la base de datos 
 * @author ruliii
 * @version 1.0
 * @param {JSON} slots un json con los parametros de invocacion de la skill 
 * @returns {JSON} response con el mensaje que alexa responde
 */

function deleteList(slots){
    console.log(logMessage("deleteList","creando variables"));
    var lista = slots.lista.value;
    const database = cloudant.use(databaseName);
    console.log(logMessage("deleteList","obteniendo _rev"));
    database.get(lista,function(err,data){
        if(err){
            throw err;
        }
        else{
            console.log(logMessage("deleteList","borrando la lista"));
            database.destroy(lista,data._rev); 
        }
    });
    var response = {
            version:"1.0",
            response:{
                shouldEndSession:true,
                outputSpeech:{
                    type:"PlainText",
                    text:"La lista "+lista+" se ha borrado correctamente"
                },
                lista:lista,
            }
            };
            console.log(logMessage("deleteList","devolviendo respuesta"));
            return {
                statusCode: 200,
                headers: {
                    "Content-Type":"application/json"
                },
                body:response
            }; 
}

/**
 * Funcion para eliminar lista en la base de datos mediante invocacion de una accion
 * en el espacion de nombres de la skill
 * @author ruliii
 * @version 1.0 
 * @param {JSON} slots un json con los parametros de invocacion de la skill 
 * @returns {JSON} response con el mensaje que alexa responde
 */
function deleteListInvokation(slots){
    logMessage("deleteList","Creando variables");
    var lista = slots.lista.value;
    var  name = "alexa/delete_document";
    var params = {
        database: databaseName,
        id: lista
    };
    logMessage("deleteList","Invocando accion delete_document");
    var response = ow.actions.invoke({name,blocking,result,params}).then(
        function(result){
            var response = {
                version:"1.0",
                response:{
                    shouldEndSession:true,
                    outputSpeech:{
                        type:"PlainText",
                        text:"La lista "+lista+" se ha borrado"
                    }
                }
            };
            logMessage("deleteList","Creando respuesta ");
            return {
                statusCode: 200,
                headers: {
                    "Content-Type":"application/json"
                },
                body:response
            };
        }).catch(
            function(err){
                logMessage("deleteList",err);
                var response = {
                    version:"1.0",
                    response:{
                        shouldEndSession:true,
                        outputSpeech:{
                            type:"PlainText",
                            text: "Error al borrar la lista"
                        }
                    }
                };
                logMessage("deleteList","Creando respuesta de error");
                return {
                    statusCode: 200,
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body:response
                };
            }
        );
        while(!response){print(response);continue;}
        logMessage("deleteList","Devolviendo respuesta");
        return response;
}
/**
 * @author ruliii
 * @version 1.0 
 * @param {JSON} slots un json con los parametros de invocacion de la skill 
 * @returns {JSON} response con el mensaje que alexa responde
 */
function addItemList(slots){
    console.log("addItemList: Creando variables");
    var lista = slots.lista.value;
    console.log(lista);
    var producto = slots.producto.value;
    console.log(producto);
    const database = cloudant.use('listascompra');
    database.get(lista,function(err,data){
        if(err){
            throw err;
        }
        else{
            data.elementos.append(producto);
            console.log(data.elementos);
            console.log("addItemList: Añadiendo producto");
            database.insert(data);
        }
    });
    var response = {
        version:"1.0",
        response:{
            shouldEndSession:true,
            outputSpeech:{
                type:"PlainText",
                text:"Se ha añadido el producto correctamente"
            }
        }
    };
    console.log("addItemList: Devolviendo respuesta");
    return {
        statusCode: 200,
        headers: {
            "Content-Type":"application/json"
        },
        body:response
    };
}

/**
 * Funcion para añadir un producto a una lista en la base de datos mediante invocacion de una accion
 * en el espacion de nombres de la skill
 * @author ruliii
 * @version 1.0
 * @param {JSON} slots un json con los parametros de invocacion de la skill 
 * @returns {JSON} response con el mensaje que alexa responde
 */
function addItemListInvokaction(slots){
    logMessage("addItemList","Creando variables");
    var lista = slots.lista.value;
    var producto=slots.producto.value;
    console.log(producto);
    var  name = "alexa/add_product";
    var params = {
        id: lista,
        product: producto
    };
    logMessage("addItemList","Invocando accion add_product");
    var response = ow.actions.invoke({name,blocking,result,params}).then(
        function(result){
            var response = {
                version:"1.0",
                response:{
                    shouldEndSession:true,
                    outputSpeech:{
                        type:"PlainText",
                        text:"El producto se ha añadido correctamente"
                    }
                }
            };
            logMessage("addItemList","Creando respuesta");
            return {
                statusCode: 200,
                headers: {
                    "Content-Type":"application/json"
                },
                body:response
            }
        }
    ).catch(
        function(err){
            logMessage("addItemList",err);
            var response = {
                version:"1.0",
                response:{
                    shouldEndSession:true,
                    outputSpeech:{
                        type:"PlainText",
                        text: "Error al añadir el producto"
                    }
                }
            };
            logMessage("addItemList","Creando respuesta de error");
            return {
                statusCode: 200,
                headers: {
                    "Content-Type":"application/json"
                },
                body:response
            };
        }
    );
    while(!response){print(response);continue;}
    logMessage("addItemList","Devolviendo respuesta");
    return response;
}

/**
 * Funcion para vaciar una lista mediante la invocacion de una accion
 * @author ruliii
 * @version 1.0
 * @param {JSON} slots un json con los parametros de invocacion de la skill 
 * @returns {JSON} response con el mensaje que alexa responde
 */
function clearList(slots){
    logMessage("clearList","Creando variables");
    var lista = slots.lista.value;
    var  name = "alexa/clear_list";
    var params = {
        id: lista,
    };
    logMessage("clearList","Invocando accion clear_list");
    var response = ow.actions.invoke({name,blocking,result,params}).then(
        function(result){
            var response = {
                version:"1.0",
                response:{
                    shouldEndSession:true,
                    outputSpeech:{
                        type:"PlainText",
                        text:"La lista se ha vaciado completamente"
                    }
                }
            };
            logMessage("clearList","Creando respuesta");
            return {
                statusCode: 200,
                headers: {
                    "Content-Type":"application/json"
                },
                body:response
            }
        }
    ).catch(
        function(err){
            logMessage("clearList",err);
            var response = {
                version:"1.0",
                response:{
                    shouldEndSession:true,
                    outputSpeech:{
                        type:"PlainText",
                        text: "Error al vaciar la lista"
                    }
                }
            };
            logMessage("clearList","Creando respuesta de error");
            return {
                statusCode: 200,
                headers: {
                    "Content-Type":"application/json"
                },
                body:response
            };
        }
    );
    while(!response){print(response);continue;}
    logMessage("clearList","Devolviendo respuesta");
    return response;
}

/**
 * Funcion para vaciar una lista mediante la invocacion de una accion
 * @author ruliii
 * @version 1.0
 * @param {JSON} slots un json con los parametros de invocacion de la skill 
 * @returns {JSON} response con el mensaje que alexa responde
 */
 function listProducts(slots){
    logMessage("listProducts","Creando variables");
    var lista = slots.lista.value;
    var  name = "alexa/list_products";
    var params = {
        id: lista,
    };
    logMessage("listProducts","Invocando accion list_products");
    var response = ow.actions.invoke({name,blocking,result,params}).then(
        function(result){
            var texto;
            var elementos = result.body.elementos;
            if(elementos.length!=0){
                texto = "Tiene los siguientes elementos en la lista: ";
                for(let i=0 ; i<elementos.length ; i++){
                    if(i == elementos.length-1){
                        texto += elementos[i];
                    }
                    else{
                        texto += elementos[ì] + ", "
                    }
                }
            }
            else{
                texto= "No tiene elementos en la lista"
            }
            var response = {
                version:"1.0",
                response:{
                    shouldEndSession:true,
                    outputSpeech:{
                        type:"PlainText",
                        text:texto
                    }
                }
            };
            logMessage("listProducts","Creando respuesta");
            return {
                statusCode: 200,
                headers: {
                    "Content-Type":"application/json"
                },
                body:response
            }
        }
    ).catch(
        function(err){
            logMessage("listProducts",err);
            var response = {
                version:"1.0",
                response:{
                    shouldEndSession:true,
                    outputSpeech:{
                        type:"PlainText",
                        text: "Error al listar los productos de la lista"
                    }
                }
            };
            logMessage("listProducts","Creando respuesta de error");
            return {
                statusCode: 200,
                headers: {
                    "Content-Type":"application/json"
                },
                body:response
            };
        }
    );
    while(!response){print(response);continue;}
    logMessage("listProducts","Devolviendo respuesta");
    return response;
}
/**
 * @author ruliii
 * @version 1.0 
 * @param {JSON} msg un json con los parametros de que se reciven de la invocacion de la skill
 * @returns {JSON} un json con el mensaje que alexa tiene que decir
 */
function main(msg){
    logMessage("Main","Creando variables");
    var request = msg.request;
    var intent = request.intent;
    var intentName = intent.name;
    var slots = intent.slots;
    if(intentName == "AddItemList"){
        logMessage("Main","Ejecutando AddItemList intent");
        //return addItemList(slots);
        return addItemListInvokaction(slots);
    }
    else if(intentName == "NewList"){
        logMessage("Main","Ejecutando NewList intent");
        /*return newList(slots);*/
        return newListInvokation(slots);
    }
    else if(intentName == "DeleteList"){
        logMessage("Main","Ejecutando DeleteList intent");
        //return deleteList(slots);
        return deleteListInvokation(slots);
    }
    else if(intentName == "ClearList"){
        logMessage("Main","Ejecutando ClearList intent");
        //return deleteList(slots);
        return clearList(slots);
    }
    else if(intentName == "ListProducts"){
        logMessage("Main","Ejecutando ListProducts intent");
        //return deleteList(slots);
        return listProducts(slots);
    }
}

exports.main = main;
