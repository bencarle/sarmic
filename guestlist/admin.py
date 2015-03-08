from django.contrib import admin
from guestlist.models import Guest, GuestAdmin

# Register your models here.
#admin.site.register(Guest)
admin.site.register(Guest, GuestAdmin)
