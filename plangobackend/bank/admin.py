from django.contrib import admin


from .models import Credentials
# from .forms import CustomUserCreationForm, CustomUserChangeForm
# from .models import CustomUser


class CustomCredentialAdmin(admin.ModelAdmin):
    model = Credentials
    list_display = ('id', 'user', 'institution', 'accounts')



admin.site.register(Credentials, CustomCredentialAdmin)
