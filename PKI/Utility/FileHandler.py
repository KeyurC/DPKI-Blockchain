from OpenSSL import crypto
import os

"""
This class generates certificate,CSR,Key files and reads said files
"""
class FileHandler():
    def __init__(self,location=os.path.dirname(os.path.abspath((__file__)).replace("Utility",""))+"/Resources/"):
        self.path = location

    """
    This function creates a CSR file
    """
    def genCertReqFile(self, name,cert,type):
        print(str(self.path) + "CertificateRequests/" + name + type)
        with open(self.path + name + type, "wb") as f:
            f.write(crypto.dump_certificate_request(crypto.FILETYPE_PEM, cert))

    """
    This function creates a certificate file
    """
    def genCertFile(self, name, cert, type):
        print(str(self.path) + "Certificates/" + name + type)
        with open(self.path + name + type, "wb") as f:
            f.write(crypto.dump_certificate(crypto.FILETYPE_PEM, cert))

    """
    This function creates a private key file
    """
    def genPrivateFile(self, name, cert):
        print(str(self.path) + "PrivateKeys/" + name)
        with open(self.path + name, "wb") as f:
            f.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, cert))

    """
    This function reads and loads the content of a certificate file
    """
    def readCertFile(self, name, type, cert):
        with open(self.path + name + type, "wb") as f:
            cert = f.read()
            return cert

