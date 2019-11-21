import requests
class CCClient():
    def __init__(self,url='http://localhost:3000/'):
        self.url = url;

    def InitCert(self,hash,CN):
        data = {'Hash': hash, 'CommonName': CN}
        post = requests.post(self.url+'postroot',
                     json=data)  # the POST request
        print(post.text)

    def invoke(self, hash, CN):
        data = {'Hash': hash, 'CommonName': CN}
        post = requests.post(self.url + 'postnewentry',
                             json=data)  # the POST request
        print(post.text)
