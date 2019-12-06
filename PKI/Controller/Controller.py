from Model.Client import Client
from Utility.FileHandler import FileHandler
from Views.CommandLineInterface import CommandLineUI
from Utility.ConfigLoader import ConfigLoader
from Utility.KeyStoreHandler import KeyStoreHandler
from Model.RegistrationAuthority import RegistrationAuthority
import os
import time

config = ConfigLoader()

"""
This class is the main controller, where all the different methods and classes
are handled and controls the flow of the program
"""
class Controller():

    """
    this function initializes the data types used by all the other methods,
    within the class
    """
    def __init__(self):
        self.DN = []
        self.questions = []
        self.DNTags = []
        self.certReq = ""
        self.DNDict = {}

    """
    This function loads all the Domain Name attributes into a Dictionary to be used
    """
    def genDict(self):
        for i in range(len(self.DNTags)):
            self.DNDict[self.DNTags[i]] = self.DN[i]

    """
    This function calls the config loader and extracts all the details from the config
    and sets them within datatypes to be used when quering a user
    """
    def loadConfig(self):
        config = ConfigLoader()
        config.readConfig()
        self.questions = config.getQuestions()
        self.DNTags = config.getDN()
        # config.print()

    """
    This function controls the main transaction flow of the program
    """
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

    """
    This program handles the interacts with the input class in order to query
    relevent information to be used to construct a certificate.
    """
    def input(self):
        UI = CommandLineUI(self.questions)
        UI.inputs()
        self.DN = UI.getInputs()

    """
    This class prints the Domain name
    """
    def print(self):
        print(self.DN)

    """
    This function communicates with the client class in order to construct a 
    certificate signing request
    """
    def genCSR(self):
        client = Client(self.DN,self.DNDict)
        client.generateCSR()
        self.certReq = client.getCertReq()

    """
    This function generates a keystore, to store certificates
    """
    def createKeystore(self):
        keystore = KeyStoreHandler()
        keystore.createStore()

    """
    This function generates a certificate by passing the CSR to the RA,
    whom verifies it and passes it to the CA
    """
    def createCertificate(self):
        Ra = RegistrationAuthority(self.certReq)
        if Ra.verify():
            cert = Ra.generateCertificate()
            self.createCertFile(cert)

    """
    This function creates a physical certificate crt file
    """
    def createCertFile(self,cert):
        file = FileHandler()
        file.genCertFile(self.DN[1], cert, ".crt")

    """
    This file generates a csr file
    """
    def createCertReqFile(self):
        file = FileHandler()
        file.genCertReqFile(self.DN[1], self.certReq, ".cer")

controller = Controller()
controller.main()
