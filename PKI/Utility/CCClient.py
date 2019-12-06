import requests
"""
This class is the client used to send information over
to the blockchain server
"""
class CCClient():
    def __init__(self,url='http://localhost:3000/'):
        self.url = url

    """
    This function passes on the CAs hash value and CN
    """
    def InitCert(self,hash,CN):
        data = {'Hash': hash, 'CommonName': CN}
        post = requests.post(self.url+'postroot',
                     json=data)  # the POST request
        print(post.text)

    """
    This function passes on the values of newly issued certificates
    """
    def invoke(self, hash, CN):
        data = {'Hash': hash, 'CommonName': CN}
        post = requests.post(self.url + 'postnewentry',
                             json=data)  # the POST request
        print(post.text)
