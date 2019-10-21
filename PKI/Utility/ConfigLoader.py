class ConfigLoader():
    def __init__(self):
        self.DN = []
        self.DNQuestions = []

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

    def print(self):
        print(self.DNQuestions)
        print(self.DN)

    def getDN(self):
        return self.DN

    def getQuestions(self):
        return self.DNQuestions
