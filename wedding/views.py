from django.shortcuts import render
from django.http import HttpResponseRedirect
from guestlist.models import Guest
import urllib
import json
from decimal import Decimal
import math
from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(max_length=100,
                           widget=forms.TextInput(attrs={'class':'form-control', 'placeholder':'Enter your name'})
                           )
    email = forms.EmailField(label='Email Address',
                             widget=forms.EmailInput(attrs={'class':'form-control', 'placeholder':'Enter your email'})
                             )
    message = forms.CharField(widget=forms.Textarea(attrs={'class':'form-control', 'rows':'5'})
                              )

def index(request):
    guests = Guest.objects.all()
    latSum = Decimal(0.0)
    lngSum = Decimal(0.0)
    latlngCount = 0
    for guest in guests:
        if not guest.locached:
            # Google API Server Key
            api_key = "AIzaSyB-GdhQesyakVLm30BXYvHJCdvmxH7UUCk"

            url  = "https://maps.googleapis.com/maps/api/geocode/json"
            url += "?address=%s,%s,%s,%s" % (guest.street, guest.city, guest.state, guest.zip)
            url += "&key=%s" % api_key

            url = url.replace(' ', '')
            
            attempts = 0
            tryagain = True

            print(url)
            
            while tryagain and attempts < 3:
                #response = urllib.request.urlopen(url)
                #print(response)
                
                req = urllib.request.Request(url)
                try:
                    response = urllib.request.urlopen(req)
                except urllib.error.HTTPError as e:
                    print(e.code)
                    print(e.read())  

                
                jresult = json.loads(response.read().decode('UTF-8'))
                # The GetStatus function parses the answer and returns the status code
                # This function is out of the scope of this example (you can use a SDK).
                status = jresult['status']
                if status == "OK":
                    guest.lat = Decimal(jresult['results'][0]['geometry']['location']['lat'])
                    guest.lng = Decimal(jresult['results'][0]['geometry']['location']['lng'])
                    guest.locached = True
                    guest.save()
                    tryagain = False
                elif status == "OVER_QUERY_LIMIT":
                    time.sleep(1)
                attempts += 1
        if guest.locached:
            latSum += guest.lat
            lngSum += guest.lng
            latlngCount += 1
    latC = latSum / latlngCount
    lngC = lngSum / latlngCount

    form = ContactForm()
    
    return render(request, 'index.html', locals())

def lodging(request):
    success = False
    attendingValidationState = ''
    commentValidationState = ''
    buttonType = 'btn-default'
    statusMsg = ''
    if request.method == 'GET':
        form = request.GET
        guest = Guest.objects.get(email=form['email'])
    elif request.method == 'POST':
        form = request.POST
        guest = Guest.objects.get(pk=form['id'])
        if 'attending' in form and int(form['attending']) >= 0 and int(form['attending']) <= guest.max:
            guest.attending = int(form['attending'])
            success = True
            attendingValidationState = 'has-success'
        if 'comment' in form and form['comment'] != '':
            guest.comment = form['comment']
            success = True
            commentValidationState = 'has-success'
        guest.save()

    if success:
        buttonType = 'btn-success'
        statusClass = 'text-success'
        statusMsg = 'Thanks! Your changes have been saved.'
                
    sellist = [ '' for x in range(guest.max+1) ]
    sellist[guest.attending] = 'selected'

    ceremonyLat = 38.910193
    ceremonyLng = -77.036937
    dist = round(distMiles(ceremonyLat, ceremonyLng, float(guest.lat), float(guest.lng)), 1)
    return render(request, 'lodging.html', locals())

def contact(request):
    if request.method == 'POST': # If the form has been submitted...
        # ContactForm was defined in the previous section
        form = ContactForm(request.POST) # A form bound to the POST data
        if form.is_valid(): # All validation rules pass
            subject = "A wedding message from " + form.cleaned_data['name']
            message = form.cleaned_data['message']
            sender = form.cleaned_data['email']
            recipients = ['contact@sarahandmichaelwed.com']
            from django.core.mail import send_mail
            send_mail(subject, message, sender, recipients)
            #print subject, message, sender, recipients
            return render(request, 'contactsuccess.html', {})
    else:
        form = ContactForm() # An unbound form

    return render(request, 'contact.html', {
        'form': form,
    })

def thanks(request):
    return render(request, 'index.html', locals())

def distMiles(lat1, lon1, lat2, lon2):
    """Calculate the distance in miles between two points.

    Convert the distance between two points on the
    unit sphere to a distance in radians.
    Multiply by the radius of the earth = 3960.
    (Assumes the earth is a perfect sphere)
    lat1 -- the latitude of coordinate point 1
    lon1 -- the longitude of coordinate point 1
    lat1 -- the latitude of coordinate point 2
    lon1 -- the longitude of coordinate point 2
    """
    return distOnUnitSphere(lat1, lon1, lat2, lon2) * 3960

def distOnUnitSphere(lat1, lon1, lat2, lon2):
    """Calculate the distance between two points on a unit sphere."""
    # Convert latitude and longitude to 
    # spherical coordinates in radians.
    degrees_to_radians = math.pi/180.0
    # phi = 90 - latitude
    phi1 = (90.0 - lat1)*degrees_to_radians
    phi2 = (90.0 - lat2)*degrees_to_radians
    # theta = longitude
    theta1 = lon1*degrees_to_radians
    theta2 = lon2*degrees_to_radians
    # Compute spherical distance from spherical coordinates.
    # For two locations in spherical coordinates 
    # (1, theta, phi) and (1, theta, phi)
    # cosine( arc length ) = 
    #    sin phi sin phi' cos(theta-theta') + cos phi cos phi'
    # distance = rho * arc length
    cos = (math.sin(phi1)*math.sin(phi2)*math.cos(theta1 - theta2) + 
           math.cos(phi1)*math.cos(phi2))
    arc = math.acos( cos )
    # Remember to multiply arc by the radius of the earth 
    # in your favorite set of units to get length.
    return arc
