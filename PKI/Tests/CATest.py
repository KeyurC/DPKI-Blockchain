import unittest
from Model.CertificateAuthority import CertificateAuthority
from Model.Client import Client
from Utility.KeyStoreHandler import KeyStoreHandler

class CATest(unittest.TestCase):

    def test_sign(self):
        DN = []
        Dict = {"CN": "test"}
        client = Client(DN, Dict)
        client.generateCSR()
        certReq = client.getCertReq()
        CA = CertificateAuthority(certReq)
        keystore = KeyStoreHandler()
        keystore.createStore()
        self.assertTrue(CA.sign(),"Signing failed, check if the PKIStore has certificate already")


if __name__ == '__main__':
    unittest.main()
