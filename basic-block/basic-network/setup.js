let enroll = require('./enrollAdmin.js');
let register = require('./registerUser.js');
let install = require('./install.js')

function setup() {
    enroll.enrollAdmin();
    register.register();
    install.chaincodeInstall();
    // install.chaincodeInstantiate();
}


setup();