from OpenSSL.crypto import X509Req
from OpenSSL.crypto import PKey
from OpenSSL import crypto

"""
This class performs the responsibilites of the Client,
so generates CSR request using the information queried from
the user
"""
class Client():
    def __init__(self,DN,Dict):
        self.DN = DN
        self.Dict = Dict
        self.key = self.generateKeyPair()
        self.privateKey = crypto.load_privatekey(crypto.FILETYPE_PEM,crypto.dump_privatekey(crypto.FILETYPE_PEM,self.key))
        self.publicKey = crypto.load_publickey(crypto.FILETYPE_PEM,crypto.dump_publickey(crypto.FILETYPE_PEM,self.key))
        self.req = ""

    """
    This function generates the Clients private and public key
    :return KeyPair
    """
    def generateKeyPair(self):
        key = PKey()
        key.generate_key(crypto.TYPE_RSA,2048)
        return key

    """
    This function returns the Certificate Signing Request
    :return CSR
    """
    def getCertReq(self):
        return self.req

    """
    This function issues a CSR, which contains the Domain Name as 
    well as the Clients public key. It is signed using the private key
    to allow for the RA and CA to verify the CSR.
    """
    def generateCSR(self):
        req = X509Req()
        subject = req.get_subject()
        if self.Dict.get("CN"): subject.CN = self.Dict.get("CN")
        if self.Dict.get("O"): subject.O = self.Dict.get("O")
        if self.Dict.get("OU"): subject.OU = self.Dict.get("OU")
        if self.Dict.get("C"): subject.C = self.Dict.get("C")
        if self.Dict.get("ST"): subject.ST = self.Dict.get("ST")
        if self.Dict.get("L"): subject.L = self.Dict.get("L")
        if self.Dict.get("emailAddress"): subject.emailAddress = self.Dict.get("emailAddress")

        req.set_pubkey(self.publicKey)
        req.sign(self.privateKey,"sha256")
        self.req = req
        return True

    """
    This function prints the certificate request
    """
    def printData(self):
        print(crypto.dump_certificate_request(crypto.FILETYPE_PEM,self.req))
        print(self.privateKey)
