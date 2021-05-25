from cloudant.client import Cloudant
from datetime import datetime, date



def main(args):
    print("{0}--Estableciendo conexion con la base de datos".format(datetime.now()))
    client = Cloudant.iam(None, "apiKey",
                      url= "url",
                      connect=True)
    database = client['listascompra']
    document = database[args['id']]
    print("{0}--Obteniendo los productos de la lista".format(datetime.now()))
    elementos = document['elementos']
    print(elementos)
    print("{0}--Devolviendo respuesta".format(datetime.now()))
    return {
            "statusCode": 200,
            "headers": {
                "Content-Type":"application/json"
            },
            "body": {
                "elementos":elementos
            }
        }
