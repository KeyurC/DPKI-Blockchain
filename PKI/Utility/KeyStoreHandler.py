from jks import KeyStore
from Model.CASetUp import CASetUp
from OpenSSL import crypto
import jks
from Utility.FileHandler import FileHandler
from Utility.CCClient import CCClient;
chaincode = CCClient();
class KeyStoreHandler():
    def __init__(self):
        pass

    def createStore(self):
        setUp = CASetUp()
        cert = setUp.selfsign()
        key = setUp.getPrivateKey()
        list = []
        dumped = crypto.dump_certificate(crypto.FILETYPE_PEM, cert)
        root = jks.TrustedCertEntry.new("ROOT",dumped)

        list.append(root)
        pk = jks.PrivateKeyEntry.new("ROOT PK",[dumped],key,"rsa_raw")

        chaincode.sendNewCertificate(hash(dumped),'ROOT');
        list.append(pk)
        keystore = KeyStore.new('jks',list)
        keystore.save("PKIStore","temp1234")

    def loadStore(self):
        keystore = KeyStore.load("PKIStore", "temp1234")
        return keystore

    def loadPrivateKey(self,alias="root pk"):
        keystore = self.loadStore()
        pkey = crypto.load_privatekey(crypto.FILETYPE_PEM,self.searchPrivateKeys(alias,keystore))
        f = FileHandler()
        f.genPrivateFile("rootpk",pkey)
        return pkey

    def loadCertificate(self,alias="root"):
        keystore = self.loadStore()
        cert = crypto.load_certificate(crypto.FILETYPE_PEM,self.searchCertificate(alias,keystore))
        f = FileHandler()
        f.genCertFile("root",cert,".crt")
        return cert

    def searchCertificate(self,name,keystore):
        for alias, c in keystore.certs.items():
            if c.alias == name:
                return c.cert

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

    def searchPrivateKeys(self,name,keystore):
        for alias, pk in keystore.private_keys.items():
            if pk.alias == name:
                return pk.pkey

    def importCert(self,cert):
        keystore = self.loadStore()
        list = self.getAllKeystoreContent(keystore)

        pemFormat = crypto.dump_certificate(crypto.FILETYPE_PEM, cert)
        newCert = jks.TrustedCertEntry.new(str(cert.get_subject().CN),pemFormat)
        list.append(newCert)
        keystore = KeyStore.new('jks', list)

        chaincode.sendNewCertificate(hash(pemFormat),cert.get_subject().CN);
        keystore.save("PKIStore","temp1234")

    def exportCert(self):
        pass


