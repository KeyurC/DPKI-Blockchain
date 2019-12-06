import unittest
from Model.RegistrationAuthority import RegistrationAuthority
from Model.Client import Client

class RATest(unittest.TestCase):

    def test_verify(self):
        DN = []
        Dict = {"CN": "test"}
        client = Client(DN, Dict)
        client.generateCSR()
        certReq = client.getCertReq()

        Ra = RegistrationAuthority(certReq)
        self.assertTrue(Ra.verify())


if __name__ == '__main__':
    unittest.main()
