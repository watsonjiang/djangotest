from django.conf.urls import url

from django.contrib.auth import views

app_name = 'myauth'
urlpatterns = [
    url(r'^login/$', views.LoginView.as_view(template_name='myauth/login.html'), name='login'),
    url(r'^logout/$', views.LogoutView.as_view(), name='logout'),
]    
