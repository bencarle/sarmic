from django.db import models
from django.contrib import admin

class Guest(models.Model):
    max       = models.IntegerField()
    attending = models.IntegerField(default=0)
    name      = models.CharField(max_length=100)
    street    = models.CharField(max_length=100)
    city      = models.CharField(max_length=50)
    state     = models.CharField(max_length=2)
    zip       = models.CharField(max_length=5)
    email     = models.EmailField(max_length=254)
    phone     = models.CharField(max_length=14)
    comment   = models.TextField(blank=True)
    lat       = models.DecimalField(max_digits=17, decimal_places=14, default=0.0)
    lng       = models.DecimalField(max_digits=17, decimal_places=14, default=0.0)
    locached  = models.BooleanField(default=False)

    def __str__(self):
        return str(self.name)

class GuestAdmin(admin.ModelAdmin):
    list_display = ('name', 'attending', 'comment')
