import unittest
from Model.Client import Client

class ClientTest(unittest.TestCase):

    def test_generateCSR(self):
        DN = []
        Dict = {"CN": "test"}
        client = Client(DN, Dict)
        self.assertTrue(client.generateCSR())

    def test_generateKeyPair(self):
        DN = []
        Dict = {"CN": "test"}
        client = Client(DN, Dict)
        key = client.generateKeyPair()
        self.assertNotEqual(key,"","Key is empty, hence test failed")

    def test_returnCSR(self):
        DN = []
        Dict = {"CN": "test"}
        client = Client(DN, Dict)
        client.generateCSR()
        certReq = client.getCertReq()
        self.assertNotEqual(certReq,"","Test failed as CSR is empty");


if __name__ == '__main__':
    unittest.main()
