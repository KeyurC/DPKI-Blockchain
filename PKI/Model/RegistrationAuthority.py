from OpenSSL import crypto
from Model.CertificateAuthority import CertificateAuthority

"""
This class performs the roles and responsibilites of the 
RA, so verifies incoming CSR before passing them onto the 
CA
"""
class RegistrationAuthority():

    def __init__(self,certReq):
        self.certReq = certReq

    """
    This function verifies a CSR 
    """
    def verify(self):
        if self.certReq.verify(self.certReq.get_pubkey()):
            print("Certificate passed first verification")
            return True
        else:
            raise crypto.Error("Error with verifing certificate")

    """
    This function passes the CSR onto the CA, to issue a certificate
    """
    def generateCertificate(self):
        CA = CertificateAuthority(self.certReq)
        cert = CA.sign()
        return cert
