from urllib.request import Request
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.response import Response

class ResponseException(APIException):
    status_code = 466
    default_detail = "Irgendwas ist schief gelaufen. INVALID"
    default_code = 'invalid'

    def __init__(self,detail=None, status_code=None):
        self.status_code = 666
        self.detail = "test"
        self.code = 'invalid'

        if detail is None and status_code is not None:
            if status_code==400:
                self.status_code = status_code
                self.detail ="Prüfen Sie Ihre Eingaben!"
            elif status_code==401:
                self.status_code = status_code
                self.detail = "Der Token ist abgelaufen!"
            elif status_code==403:
                self.status_code = status_code
                self.detail = "Ihre IP ist geblockt!"
            elif status_code==404:
                self.status_code = status_code
                self.detail = "Not found!"
            elif status_code==409:
                self.status_code = status_code
                self.detail = "Account wurde suspendiert!"
            else:
                self.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                self.detail = "Irgendetwas ist schiefgelaufen"
            
        if detail is not None:
            self.status_code = 400
            self.detail = detail
            self.code = 'invalid'
        
        