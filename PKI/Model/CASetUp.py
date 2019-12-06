from OpenSSL import crypto
from OpenSSL.crypto import PKey

"""
This class sets up a Certificate authority certificate in situation,
where one does not exist using the Single CA architecture
"""
class CASetUp():
    def __init__(self):
        self.RootPK = ""

    """
    This function generates a keypair comprising of the CA's private and public
    key
    """
    def generateKeyPair(self):
        key = PKey()
        key.generate_key(crypto.TYPE_RSA, 2048)
        return key

    """
    This function returns the private key of the CA
    :returns pkey
    """
    def getPrivateKey(self):
        return self.RootPK

    """
    This function self signs the CA's certificate
    """
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

    """
    This function assigns the root CA's Domain Name information
    """
    def assignRootDN(self,subject):
        subject.CN = "ROOT CA"
        subject.C = "UK"
        subject.O = "PKI-Blockchain"
        subject.OU = "PKI"

        return subject
