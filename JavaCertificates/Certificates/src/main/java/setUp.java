import org.bouncycastle.jce.provider.BouncyCastleProvider;
import java.io.File;
import java.security.PrivateKey;
import java.security.Security;
import java.security.cert.X509Certificate;
import java.util.Scanner;

/**
 * Set up class which runs all the other classes and methods
 */
public class setUp {
    public static void main(String[] args) {
        Security.addProvider(new BouncyCastleProvider());

        KeyStore keyStore = new KeyStore();
        Scanner in = new Scanner(System.in);
        System.out.println("Select 1 to create a certificate or 2 to verify an existing certificate");

        if (in.nextLine().equals("2")) {
            System.out.println("Enter certificate name");
            keyStore.verifyCertificate(in.nextLine());
        } else {


            UserData input = new UserData();

            RegistrationAuthority RA = new RegistrationAuthority(input.getDN());

            if (RA.verify()) {
                //Generates a CSR request
                CertificateRequest csr = new CertificateRequest(input.getDNToString());
                csr.createCSR();
                csr.print();

                cerFileGen cf = new cerFileGen();

                File tmp = new File("PKIStore");
                boolean exists = tmp.exists();

                if (!exists) {
                    keyStore.generateKeyStore();
                }

                //Checks if Root CA exists to sign CSRs
                if (!keyStore.verifyCAExists()) {
                    SelfSigner selfSigner = new SelfSigner();
                    PrivateKey pk = selfSigner.getRootPK();
                    cf.genFile(selfSigner.getCert(),"cert");
                    keyStore.KeyStoreImport(pk,selfSigner.getCert(),"Certificates/cert.cer","ROOT");
                }

                //Signs the CSR using the Private Key of the CA loaded from the keystore
                PrivateKey pk = (PrivateKey) keyStore.loadCAKEY();
                CertifcateSigner cs = new CertifcateSigner(csr.getCsr(),csr.getPair(),pk);
                cs.createCert();
                cs.print();

                cf.genFile(cs.getCertChain(),input.getOrg());
                keyStore.KeyStoreImport(pk,cs.getCertChain(),"Certificates/"+ input.getOrg() + ".cer",input.getOrg());

            } else {
                System.out.println("Data entered failed verification by the Registration authority");
            }

        }

    }
}
