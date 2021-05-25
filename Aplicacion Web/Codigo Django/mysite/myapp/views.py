from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
import requests as reqst
from requests.api import post
# Create your views here.

auth = " 23bc46b1-71f6-4ed5-8c54-816aa4f8c502:123zO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP"
auth = auth.split(":")

def index(request):
    if request.method == 'GET':
        response = reqst.post(url="http://localhost:3233/api/v1/web/guest/default/getListas",
                            json={'header':'XXX'},params={'blocking':True,'result':True},auth=(auth[0],auth[1]))
        responseJson = response.json()
        context = {
            'listas':responseJson['listas']
        }
        template = loader.get_template("myapp/index.html")
        return HttpResponse(template.render(context,request))

def nuevaLista(request):
    if request.method == 'POST':
        json = {
            'nombre': request.POST['nombre'],
            'descripcion': request.POST['descripcion']
        }
        response = reqst.post(url="http://localhost:3233/api/v1/web/guest/default/nuevalista",
                            json=json,params={'blocking':True,'result':True},auth=(auth[0],auth[1]))
        responseJson = response.json()
        if responseJson['statusCode'] == 200:
            return redirect('index')
        else:
            return response
    elif request.method == 'GET':
        template = loader.get_template("myapp/nuevaLista.html")
        return HttpResponse(template.render(None,request))

def verLista(request,idLista):
    if request.method == 'GET':
        response = reqst.post(url="http://localhost:3233/api/v1/web/guest/default/getlista",json={'idLista':idLista},
        params={'blocking':True,'result':True},auth=(auth[0],auth[1]))
        responseJson = response.json()
        context = {
            "productos": responseJson['productos'],
            'id': idLista
        }
        template = loader.get_template("myapp/lista.html")
        return HttpResponse(template.render(context,request))

def addProducto(request,idLista):
    if request.method == 'POST':
        json = {
            'nombre': request.POST['nombre'],
            'cantidad': request.POST['cantidad'],
            'id':idLista
        }
        response = reqst.post(url="http://localhost:3233/api/v1/web/guest/default/addElemento",
                    json=json,params={'blocking':True,'result':True},auth=(auth[0],auth[1]))
        responseJson = response.json()
        if responseJson['statusCode'] == 200:
            return redirect('index')
        else:
            return response
    elif request.method == 'GET':
        template = loader.get_template("myapp/nuevoElemento.html")
        return HttpResponse(template.render(None,request))

def vaciarLista(request,idLista):
    json = {
            'id':idLista
    }
    response = reqst.post(url="http://localhost:3233/api/v1/web/guest/default/vaciarLista",
    json=json,params={'blocking':True,'result':True},auth=(auth[0],auth[1]))
    responseJson =response.json()
    if responseJson['statusCode'] == 200:
        return redirect('index')
    else:
        return response

def eliminarLista(request,idLista):
    json = {
            'id':idLista
    }
    response = reqst.post(url="http://localhost:3233/api/v1/web/guest/default/borrarLista",
    json=json,params={'blocking':True,'result':True},auth=(auth[0],auth[1]))
    responseJson =response.json()
    if responseJson['statusCode'] == 200:
        return redirect('index')
    else:
        return  {
                "statusCode": 500,
                "headers": {
                    "Content-Type":"application/json"
                },
                "body": {response}
        }
        
