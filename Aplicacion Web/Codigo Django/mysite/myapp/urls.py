from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('nuevaLista', views.nuevaLista, name="nuevaLista"),
    path('lista/<int:idLista>', views.verLista, name="lista"),
    path('addProducto/<int:idLista>', views.addProducto, name="nuevoProducto"),
    path('vaciar/<int:idLista>', views.vaciarLista, name="vaciar"),
    path('borrar/<int:idLista>', views.eliminarLista, name="borrar"),
    path('add/<int:idLista>', views.addProducto, name="add"),
]