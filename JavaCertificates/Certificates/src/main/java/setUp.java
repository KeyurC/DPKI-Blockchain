import org.bouncycastle.jce.provider.BouncyCastleProvider;
import sun.misc.BASE64Encoder;
import sun.security.provider.X509Factory;

import java.io.File;
import java.security.PrivateKey;
import java.security.Security;
import java.security.cert.X509Certificate;

public class setUp {
    public static void main(String[] args) {
        Security.addProvider(new BouncyCastleProvider());

        //Generates a CSR request
        CertificateRequest csr = new CertificateRequest("CN=www.Singh.com,O=Singh inc,OU=SinghSelss,C=UK");
        csr.createCSR();
        csr.print();

        KeyStore keyStore = new KeyStore();
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

        cf.genFile(cs.getCertChain(),extractCN(cs.getCertChain()));
        keyStore.KeyStoreImport(pk,cs.getCertChain(),"Certificates/"+ extractCN(cs.getCertChain()) + ".cer",extractCN(cs.getCertChain()));

    }

    public static String extractCN(X509Certificate[] cert) {
        String DN = cert[0].getSubjectDN().toString();
        return DN.substring(3,DN.indexOf(","));
    }
}
