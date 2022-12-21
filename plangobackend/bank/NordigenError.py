
# I need this class to catch all Errors coming from the Nordigen.py Class.
# If there is a 401 response, the token has to be refreshed. Then a relaod has to be triggered
# Is this the right way? 
class NordigenError:

    def __init__(self):
        self.callback = None
        # Function call with class and callback else set resposnse???

