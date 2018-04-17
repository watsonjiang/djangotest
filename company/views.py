from django.http import JsonResponse
from django.views import View
from django.shortcuts import render


class Employee:
   def __init__(self):
      self.title = 'abc'
      self.author = 'watson'
      self.price = 10
      self.qty = 100

class EmployeeListView(View):
   def get(self, request):
      return render(request, 'company/employeelist.html')
     
