import sun.security.pkcs10.PKCS10;
import sun.security.x509.X500Name;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.security.*;
import java.security.cert.CertificateException;

/**
 * Generates a CSR request
 * https://www.pixelstech.net/article/1464167276-Generating-CSR-using-Java was
 * the tutorial used to develop this
 */
public class CertificateRequest {
    private ByteArrayOutputStream outStream;
    private PrintStream printStream;
    private String privateKey;
    private String dn;
    private PKCS10 csr;
    private KeyPair pair;

    /**
     * Returns the CSR
     * @return CSR
     */
    public PKCS10 getCsr() {
        return csr;
    }

    /**
     * Returns the private and public key
     * @return KeyPair
     */
    public KeyPair getPair() {
        return pair;
    }

    /**
     * Constructor of class
     * @param newDN DN information
     */
    public CertificateRequest(String newDN) {
        outStream = new ByteArrayOutputStream();
        printStream = new PrintStream(outStream);
        dn = newDN;
    }

    /**
     * Generates a Certificate Request
     */
    public void createCSR() {
        try {
            KeyPairGenerator keypair = KeyPairGenerator.getInstance("RSA");
            keypair.initialize(2048);
            Signature sig = Signature.getInstance("SHA1withRSA");
            KeyPair key = keypair.generateKeyPair();
            pair = key;
            System.out.println(this.dn);
            X500Name x500Name = new X500Name(this.dn);
            sig.initSign(key.getPrivate());
            PKCS10 pkcs10 = new PKCS10(key.getPublic());
            pkcs10.encodeAndSign(x500Name, sig);
            this.csr = pkcs10;


        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (CertificateException e) {
            e.printStackTrace();
        } catch (SignatureException e) {
            e.printStackTrace();
        }
    }

    /**
     * Prints the CSR
     */
    public void print() {
        try {
            csr.print(printStream);
            System.out.println(outStream.toString());
        } catch (IOException | SignatureException e) {
            System.out.println("Error with printing CSR");
        }
    }
}
