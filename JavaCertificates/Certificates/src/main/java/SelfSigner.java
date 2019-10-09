import sun.misc.BASE64Encoder;
import sun.security.provider.X509Factory;
import sun.security.tools.keytool.CertAndKeyGen;
import sun.security.x509.X500Name;

import java.io.IOException;
import java.security.*;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

/**
 * https://www.pixelstech.net/article/1406724116-Generate-certificate-in-Java----Self-signed-certificate
 * was the tutorial used to self sign a certificate
 */
public class SelfSigner {
    //For the Root, Need to implement a way to store the root certificate and retrieve
    //the keypair to sign CSRs.
    //For now just a way to test self signing

    X509Certificate cert;
    private PrivateKey RootPK;

    public SelfSigner() {
        try {
            CertAndKeyGen keyGen = new CertAndKeyGen("RSA", "SHA1WithRSA",null);
            keyGen.generate(2048);
            X509Certificate[] chain = new X509Certificate[1];
            chain[0]=keyGen.getSelfCertificate(new X500Name("CN=ROOT"), (long)365*24*3600);
            cert = chain[0];

            RootPK = keyGen.getPrivateKey();


        } catch (NoSuchAlgorithmException | NoSuchProviderException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (InvalidKeyException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (CertificateException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (SignatureException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }

    public PrivateKey getRootPK() {
        return RootPK;
    }

    public void print() {
        try {
            BASE64Encoder encoder = new BASE64Encoder();
            System.out.println(X509Factory.BEGIN_CERT);
            encoder.encodeBuffer(cert.getEncoded(), System.out);
            System.out.println(X509Factory.END_CERT);

        } catch (CertificateEncodingException | IOException e) {

        }

    }

    public void printDecoded() {
        System.out.println("Certificate : "+cert.toString());
    }
}
