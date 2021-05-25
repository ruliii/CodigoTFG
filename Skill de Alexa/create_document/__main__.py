from cloudant.client import Cloudant
from datetime import datetime, date


def main(args):
    print("{0}--Estableciendo conexion con la base de datos".format(datetime.now()))
    client = Cloudant.iam(None, "apiKey",
                      url= "url",
                      connect=True)
    print(args['database'])
    database = client[args['database']]
    document = args['doc']
    print("{0}--Creando lista en la base de datos".format(datetime.now()))
    my_document = database.create_document(document)
    print("{0}--Devolviendo respuesta".format(datetime.now()))
    if my_document.exists():
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type":"application/json"
            },
            "body": {
                "mensaje":"Documento añadido correctamente"
            }
        }
    else:
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type":"application/json"
            },
            "body": {
                "mensaje":"Error al añadir"
            }
        }

