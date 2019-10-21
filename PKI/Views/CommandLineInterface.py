class CommandLineUI():
    def __init__(self,questions):
        self.DN = []
        self.questions = questions

    def inputs(self):
        print(len(self.questions))
        for i in self.questions:
            self.DN.append(input(i))

    def getInputs(self):
        return self.DN
