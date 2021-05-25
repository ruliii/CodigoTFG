from cloudant.client import Cloudant
from datetime import datetime, date


def main(args):
    print("{0}--Estableciendo conexion con la base de datos".format(datetime.now()))
    client = Cloudant.iam(None, "VsaAFud5PEb_NTu-P6q2XTPKuPMdh2d3dBk4sjcBuczl",
                      url= "https://apikey-v2-1ydxv3yyaitx75lhyqswq5lfpzx5tmgmouuh5phw8peh:44575386a643de8a12d5098f93a892ab@f1890360-b63a-49e2-bd2a-33704f0e8497-bluemix.cloudantnosqldb.appdomain.cloud",
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

