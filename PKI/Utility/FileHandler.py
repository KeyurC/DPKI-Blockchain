from OpenSSL import crypto
import os

class FileHandler():
    def __init__(self,location=os.path.dirname(os.path.abspath((__file__)).replace("Utility",""))+"/Resources/"):
        self.path = location

    def genCertReqFile(self, name,cert,type):
        print(str(self.path) + "CertificateRequests/" + name + type)
        with open(self.path + name + type, "wb") as f:
            f.write(crypto.dump_certificate_request(crypto.FILETYPE_PEM, cert))

    def genCertFile(self, name, cert, type):
        print(str(self.path) + "Certificates/" + name + type)
        with open(self.path + name + type, "wb") as f:
            f.write(crypto.dump_certificate(crypto.FILETYPE_PEM, cert))

    def genPrivateFile(self, name, cert):
        print(str(self.path) + "PrivateKeys/" + name)
        with open(self.path + name, "wb") as f:
            f.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, cert))

    def readCertFile(self, name, type, cert):
        with open(self.path + name + type, "wb") as f:
            cert = f.read()
            return cert

