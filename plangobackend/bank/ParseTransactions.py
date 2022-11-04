import json
from marshmallow import Schema, fields

class ParseTransaction(Schema):

    def __init__(self, date, creditor, debitor, value, mandateId, creditor_iban, debtor_iban, fixOutcome, fixIncome):
        self.date = date
        self.creditor = creditor
        self.debitor = debitor
        self.value = value
        self.mandateId = mandateId
        self.creditorIban = creditor_iban
        self.debtorIban = debtor_iban
        self.isFixOutcome = fixOutcome
        self.isFixIncome = fixIncome

    