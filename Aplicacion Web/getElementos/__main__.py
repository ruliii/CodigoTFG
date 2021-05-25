import mysql.connector 
from datetime import datetime, date



def main(args):
    try:
        print("{0}--Estableciendo conexion con la base de datos".format(datetime.now()))
        conn = mysql.connector.connect(user='admin', password='admin',
            host='192.168.1.47',database='Shoplist')
        print("{0}--Creando cursor".format(datetime.now()))
        cursor = conn.cursor()
        get_listas = ("SELECT * FROM producto WHERE lista_id = {0} ".format(args['id']))
        print("{0}--Realizando consulta".format(datetime.now()))
        cursor.execute(get_listas)
        productos = []
        for (id, nombre , cantidad, lista_id) in cursor:
            productos.append(
                {
                    'id': id,
                    'nombre': nombre,
                    'cantidad': cantidad,
                    'lista_id': lista_id
                }
            )
        print("{0}--Cerrando cursor".format(datetime.now()))
        cursor.close()
        print("{0}--Cerrando conexion".format(datetime.now()))
        conn.close()
        print("{0}--Devolviendo respuesta".format(datetime.now()))
        return  {
                "statusCode": 200,
                "headers": {
                    "Content-Type":"application/json"
                },
                "body": {
                    "statusCode": 200,
                    "mensaje":"ok",
                    "productos":productos,
                    "lista_id":args['id']
                }
        }
    except Exception as e:
        print("{0}--Devolviendo respuesta por excepcion".format(datetime.now()))
        print(e)
        return {
                "statusCode": 500,
                "headers": {
                    "Content-Type":"application/json"
                },
                "body": {
                    "statusCode": 500,
                    "err":"Error al insertar los datos"
                }
        }