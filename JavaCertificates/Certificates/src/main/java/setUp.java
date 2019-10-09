import org.bouncycastle.jce.provider.BouncyCastleProvider;
import sun.misc.BASE64Encoder;
import sun.security.provider.X509Factory;

import java.security.PrivateKey;
import java.security.Security;

public class setUp {
    public static void main(String[] args) {
        Security.addProvider(new BouncyCastleProvider());

        //Generates a CSR request
        CertificateRequest csr = new CertificateRequest("CN=www.test.com,O=Daniel,OU=Nerd,C=DanielLand");
        csr.createCSR();
        csr.print();

        KeyStore keyStore = new KeyStore();

        System.out.println(keyStore.verifyCAExists());

        if (!keyStore.verifyCAExists()) {
            SelfSigner selfSigner = new SelfSigner();
            PrivateKey pk = selfSigner.getRootPK();
            cerFileGen cf = new cerFileGen();
            cf.genFile(selfSigner.getCert());
            keyStore.KeyStoreImport(pk,selfSigner.getCert());

        }
        //Self signs and creates a certificate
//        SelfSigner selfSigner = new SelfSigner();
//        PrivateKey pk = selfSigner.getRootPK();
//        selfSigner.print();

        //Signs a CSR using a CA, which was self signed
        PrivateKey pk = (PrivateKey) keyStore.loadCAKEY();
        CertifcateSigner cs = new CertifcateSigner(csr.getCsr(),csr.getPair(),pk);
        cs.createCert();
        cs.print();

//        cerFileGen cf = new cerFileGen();
//        cf.genFile(selfSigner.getCert());

//        KeyStore keyStore = new KeyStore(pk,selfSigner.getCert());

//        keyStore.KeyStoreImport(pk,selfSigner.getCert());
//        keyStore.loadCAKEY();
    }
}
