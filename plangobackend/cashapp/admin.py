from django.contrib import admin


from .models import FixAusgaben
from .models import FixIncome
from .models import Group
from .models import TransactionGroupIntermediate
# from .forms import CustomUserCreationForm, CustomUserChangeForm
# from .models import CustomUser


class CustomAusgabenAdmin(admin.ModelAdmin):
    model = FixAusgaben
    list_display = ('id', 'creditorName', 'debtorName', 'amount', 'created_by_id', 'mandate_id', 'creditor_iban', 'debtor_iban', 'transaction_date')

class CustomIncomeAdmin(admin.ModelAdmin):
    model = FixIncome
    list_display = ('id', 'creditorName', 'debtorName', 'amount', 'created_by_id', 'mandate_id', 'creditor_iban', 'debtor_iban', 'transaction_date')

class CustomGroupAdmin(admin.ModelAdmin):
    model = Group
    list_display = ('id', 'name', 'created_by_id')

class CustomTransactionGroupIntermediate(admin.ModelAdmin):
    model = TransactionGroupIntermediate
    list_display= ('id', 'transaction_id', 'month', 'amount', 'group', 'created_by_id')

admin.site.register(Group, CustomGroupAdmin)
admin.site.register(FixAusgaben, CustomAusgabenAdmin)
admin.site.register(FixIncome, CustomIncomeAdmin)
admin.site.register(TransactionGroupIntermediate, CustomTransactionGroupIntermediate)
