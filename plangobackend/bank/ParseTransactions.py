import json
from marshmallow import Schema, fields

class ParseTransaction(Schema):

    def __init__(self, uoi, date, creditor, debitor, value, creditor_iban, debtor_iban, fixOutcome, fixIncome, group):
        self.uoi = uoi
        self.date = date
        self.creditor = creditor
        self.debitor = debitor
        self.value = value
        self.creditorIban = creditor_iban
        self.debtorIban = debtor_iban
        self.isFixOutcome = fixOutcome
        self.isFixIncome = fixIncome
        self.group = group

    