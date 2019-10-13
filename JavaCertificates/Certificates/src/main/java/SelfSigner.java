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
 * This class generates a self signed certificate.
 * The class in mainly used for the CA to be generated if one doesn't exist in
 * the keystore.
 *
 * https://www.pixelstech.net/article/1406724116-Generate-certificate-in-Java----Self-signed-certificate
 * was the tutorial used to self sign a certificate
 */
public class SelfSigner {

    private X509Certificate[] cert = new X509Certificate[1];
    private PrivateKey RootPK;

    /**
     * Function returns the certificate
     * @return Certificate chain
     */
    public X509Certificate[] getCert() {
         return cert;
    }

    /**
     * Produces a self signed certificate
     */
    public SelfSigner() {
        try {
            CertAndKeyGen keyGen = new CertAndKeyGen("RSA", "SHA1WithRSA",null);
            keyGen.generate(2048);
            X509Certificate[] chain = new X509Certificate[1];
            chain[0]=keyGen.getSelfCertificate(new X500Name("CN=ROOT"), (long)365*24*3600);
            cert[0] = chain[0];

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

    /**
     * Returns the private key of the certificate
     * @return Private Key of CA
     */
    public PrivateKey getRootPK() {
        return RootPK;
    }

    /**
     * Prints the self signed certificate
     */
    public void print() {
        try {
            BASE64Encoder encoder = new BASE64Encoder();
            System.out.println(X509Factory.BEGIN_CERT);
            encoder.encodeBuffer(cert[0].getEncoded(), System.out);
            System.out.println(X509Factory.END_CERT);

        } catch (CertificateEncodingException | IOException e) {

        }

    }

    /**
     * Prints the self signed certificate in english
     */
    public void printDecoded() {
        System.out.println("Certificate : "+cert.toString());
    }
}
