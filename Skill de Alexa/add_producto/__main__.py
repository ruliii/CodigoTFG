from cloudant.client import Cloudant
from datetime import datetime, date

def main(args):
    print("{0}--Estableciendo conexion con la base de datos".format(datetime.now()))
    client = Cloudant.iam(None, "apiKey",
                      url= "url",
                      connect=True)
    database = client['listascompra']
    document = database[args['id']]
    print(document)
    print("{0}--Añadiendo producto a la lista".format(datetime.now()))
    document['elementos'].append(args['product'])
    print(document)
    print("{0}--Guardando documento".format(datetime.now()))
    document.save()
    print("{0}--Devolviendo respuesta".format(datetime.now()))
    return {
            "statusCode": 200,
            "headers": {
                "Content-Type":"application/json"
            },
            "body": {
                "mensaje":"Producto añadido correctamente"
            }
        }
