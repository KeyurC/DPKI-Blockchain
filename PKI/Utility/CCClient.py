import requests
class CCClient():
    def __init__(self,url='http://localhost:3000/'):
        self.url = url;

    def sendNewCertificate(self,hash,CN):
        data = {'Hash': hash, 'CommonName': CN}
        post = requests.post(self.url+'postdata',
                     json=data)  # the POST request
        print(post.text)
