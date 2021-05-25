from cloudant.client import Cloudant
from datetime import datetime, date


def main(args):
    print("{0}--Estableciendo conexion con la base de datos".format(datetime.now()))
    client = Cloudant.iam(None, "apiKey",
                      url= "url",
                      connect=True)
    print(args['database'])
    database = client[args['database']]
    my_document = database[args['id']]
    print("{0}--Borrando lista".format(datetime.now()))
    my_document.delete()
    print("{0}--Devolviendo respuesta".format(datetime.now()))
    if not my_document.exists():
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type":"application/json"
            },
            "body": {
                "mensaje":"Documento borado correctamente"
            }
        }
    else:
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type":"application/json"
            },
            "body": {
                "mensaje":"Error al borrar documento"
            }
        }

