from django.contrib import admin


from .models import FixAusgaben
from .models import FixIncome
from .models import Group
# from .forms import CustomUserCreationForm, CustomUserChangeForm
# from .models import CustomUser


class CustomAusgabenAdmin(admin.ModelAdmin):
    model = FixAusgaben
    list_display = ('id', 'creditorName', 'debtorName', 'amount', 'created_by_id', 'mandate_id', 'creditor_iban', 'debtor_iban')

class CustomIncomeAdmin(admin.ModelAdmin):
    model = FixIncome
    list_display = ('id', 'creditorName', 'debtorName', 'amount', 'created_by_id', 'mandate_id', 'creditor_iban', 'debtor_iban')

class CustomGroupAdmin(admin.ModelAdmin):
    model = Group
    list_display = ('id', 'name', 'created_by_id')

admin.site.register(Group, CustomGroupAdmin)
admin.site.register(FixAusgaben, CustomAusgabenAdmin)
admin.site.register(FixIncome, CustomIncomeAdmin)
