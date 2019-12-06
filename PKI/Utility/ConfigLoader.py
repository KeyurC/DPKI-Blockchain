
"""
This class reads data from a config file and loads all the data from
the config file into appropriate data structures to be used
"""
class ConfigLoader():
    def __init__(self):
        self.DN = []
        self.DNQuestions = []

    """
    This function reads and generates data structures
    to store the config files content
    """
    def readConfig(self):
        with open('Config') as f:
            startDN = False
            for line in f:
                # print (line)
                if line.strip() == "Start DN":
                    startDN = True
                elif line.strip() == "End":
                    startDN = False
                elif startDN:
                    splitted = line.split(",")
                    # print("line ",splitted[0])
                    self.DN.append(splitted[0])
                    self.DNQuestions.append(splitted[1])

    """
    This function prints the values of the config
    """
    def print(self):
        print(self.DNQuestions)
        print(self.DN)

    """
    This function returns the DN information from the config
    :return Array Domain Name
    """
    def getDN(self):
        return self.DN

    """
    This function returns the information used to query the user
    :return Array Questions
    """
    def getQuestions(self):
        return self.DNQuestions
