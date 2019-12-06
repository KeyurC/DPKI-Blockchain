from jks import KeyStore
from Model.CASetUp import CASetUp
from OpenSSL import crypto
import jks
from Utility.FileHandler import FileHandler
from Utility.CCClient import CCClient
chaincode = CCClient()

"""
This class handles interacts with the keystore,
which acts as the centralized database to store certificates
and keys
"""
class KeyStoreHandler():
    def __init__(self):
        pass

    """
    This function generates a keystore if none exists
    """
    def createStore(self):
        setUp = CASetUp()
        cert = setUp.selfsign()
        key = setUp.getPrivateKey()
        list = []
        dumped = crypto.dump_certificate(crypto.FILETYPE_PEM, cert)
        root = jks.TrustedCertEntry.new("ROOT",dumped)

        list.append(root)
        pk = jks.PrivateKeyEntry.new("ROOT PK",[dumped],key,"rsa_raw")

        chaincode.InitCert(hash(dumped),'ROOT');
        list.append(pk)
        keystore = KeyStore.new('jks',list)
        keystore.save("PKIStore","temp1234")

    """
    This function loads the keystore, to be queried from and
    added to by other functions
    :return KeyStore keystore
    """
    def loadStore(self):
        keystore = KeyStore.load("PKIStore", "temp1234")
        return keystore

    """
    This function loads the CA's private key from the
    keystore
    :return PKey pkey
    """
    def loadPrivateKey(self,alias="root pk"):
        keystore = self.loadStore()
        pkey = crypto.load_privatekey(crypto.FILETYPE_PEM,self.searchPrivateKeys(alias,keystore))
        f = FileHandler()
        f.genPrivateFile("rootpk",pkey)
        return pkey

    """
    This function loads the CA's certificate
    from the keystore
    :return certificate cert
    """
    def loadCertificate(self,alias="root"):
        keystore = self.loadStore()
        cert = crypto.load_certificate(crypto.FILETYPE_PEM,self.searchCertificate(alias,keystore))
        f = FileHandler()
        f.genCertFile("root",cert,".crt")
        return cert

    """
    This function queries the keystore for a specific certificate
    :return certificate cert
    """
    def searchCertificate(self,name,keystore):
        for alias, c in keystore.certs.items():
            if c.alias == name:
                return c.cert

    """
    This function returns the entire content of the keystore
    """
    def getAllKeystoreContent(self,keystore):
        content = []
        root = ""
        for alias, c in keystore.certs.items():
            if alias == "root":
                root = c.cert
            tmp = jks.TrustedCertEntry.new(alias, c.cert)
            content.append(tmp)

        for alias, pk in keystore.private_keys.items():
            pk = jks.PrivateKeyEntry.new("ROOT PK", [root], pk.pkey, "rsa_raw")
            content.append(pk)

        return content

    """
    This function queries the keystore for a private key
    :return PKey pkey
    """
    def searchPrivateKeys(self,name,keystore):
        for alias, pk in keystore.private_keys.items():
            if pk.alias == name:
                return pk.pkey

    """
    This function adds a new certificate to the keystore
    """
    def importCert(self,cert):
        keystore = self.loadStore()
        list = self.getAllKeystoreContent(keystore)

        pemFormat = crypto.dump_certificate(crypto.FILETYPE_PEM, cert)
        newCert = jks.TrustedCertEntry.new(str(cert.get_subject().CN),pemFormat)
        list.append(newCert)
        keystore = KeyStore.new('jks', list)

        chaincode.invoke(hash(pemFormat),cert.get_subject().CN);
        keystore.save("PKIStore","temp1234")

    def exportCert(self):
        pass


