from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'wedding.views.index', name='index'),
    url(r'^lodging/$', 'wedding.views.lodging', name='lodging'),
    url(r'^contact/$', 'wedding.views.contact', name='contact'),
    url(r'^thanks/$', 'wedding.views.thanks', name='thanks'),

    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
)
