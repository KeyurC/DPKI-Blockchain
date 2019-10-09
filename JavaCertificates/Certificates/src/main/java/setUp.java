import org.bouncycastle.jce.provider.BouncyCastleProvider;
import sun.misc.BASE64Encoder;
import sun.security.provider.X509Factory;

import java.security.PrivateKey;
import java.security.Security;

public class setUp {
    public static void main(String[] args) {
        Security.addProvider(new BouncyCastleProvider());

        //Generates a CSR request
//        CertificateRequest csr = new CertificateRequest("CN=www.test.com");
//        csr.createCSR();
//        csr.print();

        //Self signs and creates a certificate
        SelfSigner selfSigner = new SelfSigner();
        PrivateKey pk = selfSigner.getRootPK();
//        selfSigner.print();

        //Signs a CSR using a CA, which was self signed
//        CertifcateSigner cs = new CertifcateSigner(csr.getCsr(),csr.getPair(),pk);
//        cs.createCert();
//        cs.print();

        cerFileGen cf = new cerFileGen();
        cf.genFile(selfSigner.getCert());

//        KeyStore keyStore = new KeyStore(pk,selfSigner.getCert());
        KeyStore keyStore = new KeyStore();
        keyStore.KeyStoreImport(pk,selfSigner.getCert());
        keyStore.loadCAKEY();
    }
}
