from django.contrib import admin


from .models import FixAusgaben
# from .forms import CustomUserCreationForm, CustomUserChangeForm
# from .models import CustomUser


class CustomAusgabenAdmin(admin.ModelAdmin):
    model = FixAusgaben
    list_display = ('id', 'name', 'amount', 'created_by_id', 'mandate_id', 'creditor_iban', 'debtor_iban')

admin.site.register(FixAusgaben, CustomAusgabenAdmin)
