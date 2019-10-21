from OpenSSL import crypto
from Model.CertificateAuthority import CertificateAuthority

class RegistrationAuthority():

    def __init__(self,certReq):
        self.certReq = certReq

    def verify(self):
        if self.certReq.verify(self.certReq.get_pubkey()):
            print("Certificate passed first verification")
            return self.generateCertificate()
        else:
            raise crypto.Error("Error with verifing certificate")

    def generateCertificate(self):
        CA = CertificateAuthority(self.certReq)
        cert = CA.sign()
        return cert
