from OpenSSL import crypto
from OpenSSL.crypto import PKey

class CASetUp():
    def __init__(self):
        self.RootPK = ""

    def generateKeyPair(self):
        key = PKey()
        key.generate_key(crypto.TYPE_RSA, 2048)
        return key

    def getPrivateKey(self):
        return self.RootPK

    def selfsign(self):
        cert = crypto.X509()
        subject = cert.get_subject()
        cert.set_subject(self.assignRootDN(subject))
        cert.gmtime_adj_notBefore(0)
        cert.gmtime_adj_notAfter(60*24*360)
        cert.set_issuer(cert.get_subject())
        key = self.generateKeyPair()
        cert.set_pubkey(key)
        cert.sign(key, "sha256")
        self.RootPK = self.privateKey = crypto.dump_privatekey(crypto.FILETYPE_PEM,key)

        return cert

    def assignRootDN(self,subject):
        subject.CN = "ROOT CA"
        subject.C = "UK"
        subject.O = "PKI-Blockchain"
        subject.OU = "PKI"

        return subject
