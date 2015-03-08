# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

def add_initial(apps, schema_editor):
    """Add the initial guests."""
    Guest = apps.get_model("guestlist", "Guest")

    Guest(
        name="Dr. Sarah Carle and Mr. Michael Marrone",
        email="sarahjcarle@gmail.com",
        phone="914-411-3391",
        street="1433 Bolton Street",
        city="Baltimore", 
        state="MD", 
        zip="21217", 
        max=2,
        ).save()

    Guest(
        name="Dr. Benjamin Carle and Mrs. Melissa Eastham", 
        email="bencarle@gmail.com",
        phone="518-441-1367", 
        street="33 Greenbush Drive", 
        city="Poughkeepsie", 
        state="NY", 
        zip="12601", 
        max=2, 
        ).save()

class Migration(migrations.Migration):

    dependencies = [
        ('guestlist', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_initial) 
    ]
