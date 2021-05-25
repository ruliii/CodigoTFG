from cloudant.client import Cloudant
from datetime import datetime, date



def main(args):
    print("{0}--Estableciendo conexion con la base de datos".format(datetime.now()))
    client = Cloudant.iam(None, "apikey",
                      url= "url",
                      connect=True)
    database = client['listascompra']
    document = database[args['id']]
    print(document)
    print("{0}--Vaciando la lista de productos".format(datetime.now()))
    document['elementos'] = []
    print("{0}--Guardando documento".format(datetime.now()))
    document.save()
    print("{0}--Devolviendo respuesta".format(datetime.now()))
    return {
            "statusCode": 200,
            "headers": {
                "Content-Type":"application/json"
            },
            "body": {
                "mensaje":"La lista se vacio correctamente"
            }
        }
