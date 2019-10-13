package UI;

import CertificateAuthority.CertifcateSigner;
import CertificateAuthority.SelfSigner;
import KeyStore.KeyStore;
import RegistrationAuthority.RegistrationAuthority;
import Utility.cerFileGen;
import Utility.csrData;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.io.File;
import java.security.PrivateKey;
import java.security.Security;
import java.util.Scanner;

public class CMD {

    private void Options() {
        System.out.println("Select 1 to create a certificate or 2 to verify an existing certificate");
    }


}
