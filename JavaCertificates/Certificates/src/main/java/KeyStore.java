import org.bouncycastle.openssl.jcajce.JcaPEMWriter;

import java.io.*;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

/**
 * This class handles anything to do with the keystore file e.g import/exporting and generation.
 * https://stackoverflow.com/questions/18889058/programmatically-import-ca-trust-cert-into-existing-keystore-file-without-using
 * Learnt parts of the code from the link above.
 */
public class KeyStore {

    private java.security.KeyStore keyStore;
    private FileInputStream is;
    private String store = "PKIStore";
    private char[] password = "temp1234".toCharArray();

    /**
     * Creates an instance of keystore
     */
    public KeyStore() {
        try {
            keyStore = java.security.KeyStore.getInstance(
                    java.security.KeyStore.getDefaultType()
            );
        } catch (KeyStoreException e) {
            System.out.println("Error with establishing keystore\n" + e);
        }

    }

    /**
     * Function determines whether the CA certificate exists
     * @return Returns true if CA certificate exists.
     */
    public Boolean verifyCAExists() {
        try {
            is = new FileInputStream(store);
            keyStore.load(is,password);

            if (keyStore.containsAlias("ROOT")) {
                return true;
            } else {
                return false;
            }

        } catch (Exception e) {
            System.out.println("ERROR" + e);
        }

        return false;
    }

    /**
     * The function exports the private key of the CA from
     * the keystore.
     * @return Private Key of CA
     */
    public Key loadCAKEY() {
        try {
            is = new FileInputStream(store);
            keyStore.load(is,password);

            Key key = keyStore.getKey("privatekey",password);
            return key;

        } catch (Exception e) {
            System.out.println("Error with loading CA key from keystore" + e);
        }
        return null;
    }

    /**
     * Function determines if the certificate in the keystore and the
     * certificate provided are the same or not using their hash.
     * @param certName Certificate Name
     * @return Boolean if certificate is the same or not.
     */
    public boolean verifyCertificate(String certName) {
        try {
            is = new FileInputStream(store);
            keyStore.load(is,password);
            Certificate certImported = keyStore.getCertificate(certName);
            String location = "Certificates/"+certName+".cer";

            Certificate certs = this.buildCertificate(location);

            System.out.println("Keystore: " + certImported.hashCode());
            System.out.println("NON - Keystore: " + certs.hashCode());

            if (certImported.hashCode() == certs.hashCode()) {
                return true;
            }

            return false;

        } catch (Exception e) {
            System.out.println(e);
        }
        return false;
    }

    /**
     * Function creates a keystore file
     */
    public void generateKeyStore() {
        try {
            keyStore.load(null,password);

            FileOutputStream outputStream = new FileOutputStream(store);
            keyStore.store(outputStream,password);
            outputStream.close();

        } catch (KeyStoreException e) {
            System.out.println("Error getting keystore object" + e);
        } catch (IOException e) {
            System.out.println("Check ks.load" + e);
        } catch (NoSuchAlgorithmException e) {
            System.out.println("Check ks.load" + e);
        } catch (CertificateException e) {
            System.out.println("Check ks.load" + e);
        }
    }

    /**
     * Function imports a certificate/private key into the keystore
     * @param privateKey Private key of Certificate
     * @param cert Certificate
     * @param location Certificate location
     * @param alias What the certificate is refered to as
     */
    public void KeyStoreImport(PrivateKey privateKey, X509Certificate[] cert,String location,String alias) {

        try {
            is = new FileInputStream(store);
            keyStore.load(is,password);

            Certificate certs = this.buildCertificate(location);

            // Add the certificate
            keyStore.setCertificateEntry(alias, certs);
            if (alias.equals("ROOT")) {
                keyStore.setKeyEntry("PrivateKey",privateKey,password,cert);
            }

            StringWriter s = new StringWriter();
            try (JcaPEMWriter w = new JcaPEMWriter(s)) {
                w.writeObject(privateKey);
            }

            // Save the new keystore contents
            FileOutputStream out = new FileOutputStream(store);
            keyStore.store(out, password);
            out.close();

        } catch (Exception e) {
            System.out.println("Error with importing to keystore\n" + e);
        }

    }

    /**
     * Function builds a certificate from an existing file
     * @param location Location of certificate file
     * @return Certificate
     */
    private Certificate buildCertificate(String location) {
        try {
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            File file = new File(location);
            InputStream certstr = new FileInputStream(file);
            Certificate cert =  cf.generateCertificate(certstr);
            return cert;
        } catch (Exception e ) {

        }
        return null;
    }


}
