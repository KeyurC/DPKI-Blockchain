from Model.Client import Client
from Utility.FileHandler import FileHandler
from Views.CommandLineInterface import CommandLineUI
from Utility.ConfigLoader import ConfigLoader
from Utility.KeyStoreHandler import KeyStoreHandler
from Model.RegistrationAuthority import RegistrationAuthority
import os
import time

config = ConfigLoader()


class Controller():
    def __init__(self):
        self.DN = []
        self.questions = []
        self.DNTags = []
        self.certReq = ""
        self.DNDict = {}

    def genDict(self):
        for i in range(len(self.DNTags)):
            self.DNDict[self.DNTags[i]] = self.DN[i]

    def loadConfig(self):
        config = ConfigLoader()
        config.readConfig()
        self.questions = config.getQuestions()
        self.DNTags = config.getDN()
        # config.print()

    def main(self):
        while (True):
            if not os.path.exists("PKIStore"):
                print("No keystore, generating a keystore")
                self.createKeystore()
                time.sleep(10)
            else:
                self.loadConfig()
                self.input()
                self.genDict()
                self.genCSR()
                self.createCertReqFile()
                self.createCertificate()


    def input(self):
        UI = CommandLineUI(self.questions)
        UI.inputs()
        self.DN = UI.getInputs()

    def print(self):
        print(self.DN)

    def genCSR(self):
        client = Client(self.DN,self.DNDict)
        client.generateCSR()
        self.certReq = client.getCertReq()

    def createKeystore(self):
        keystore = KeyStoreHandler()
        keystore.createStore()

    def createCertificate(self):
        Ra = RegistrationAuthority(self.certReq)
        cert = Ra.verify()
        self.createCertFile(cert)

    def createCertFile(self,cert):
        file = FileHandler()
        file.genCertFile(self.DN[1], cert, ".crt")

    def createCertReqFile(self):
        file = FileHandler()
        file.genCertReqFile(self.DN[1], self.certReq, ".cer")

controller = Controller()
controller.main()
