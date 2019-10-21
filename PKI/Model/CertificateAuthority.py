from Utility.KeyStoreHandler import KeyStoreHandler
from OpenSSL import crypto

class CertificateAuthority():
    def __init__(self,req):
        self.cert = ""
        self.req = req

    def getCert(self):
        return self.getCert()

    def sign(self):
        keystore = KeyStoreHandler()
        CA = keystore.loadCertificate()
        CAPK = keystore.loadPrivateKey()

        cert = crypto.X509()
        cert.gmtime_adj_notBefore(0)
        cert.gmtime_adj_notAfter(60*24*360)
        cert.set_issuer(CA.get_subject())
        cert.set_subject(self.req.get_subject())
        cert.set_pubkey(self.req.get_pubkey())
        cert.sign(CAPK,"sha256")
        keystore.importCert(cert)
        return cert


    def verify(self):
        pass

    def print(self):
        pass
