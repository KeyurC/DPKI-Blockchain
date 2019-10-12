import org.bouncycastle.openssl.jcajce.JcaPEMWriter;

import java.io.*;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

/**
 * https://stackoverflow.com/questions/18889058/programmatically-import-ca-trust-cert-into-existing-keystore-file-without-using
 * Borrowed snippets of this code in order to import certificates into the keystore
 */
public class KeyStore {

    public Boolean verifyCAExists() {
        try {
            FileInputStream is = new FileInputStream("PKIStore");
            java.security.KeyStore keyStore = java.security.KeyStore.getInstance(
                    java.security.KeyStore.getDefaultType()
            );

            keyStore.load(is,"temp1234".toCharArray());
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

    public Key loadCAKEY() {
        try {
            FileInputStream is = new FileInputStream("PKIStore");
            java.security.KeyStore keyStore = java.security.KeyStore.getInstance(
                    java.security.KeyStore.getDefaultType()
            );

            keyStore.load(is,"temp1234".toCharArray());

            Key key = keyStore.getKey("privatekey","temp1234".toCharArray());
            Certificate cert = keyStore.getCertificate("ROOT");

            return key;

        } catch (Exception e) {
            System.out.println(e);
        }
        return null;
    }

    public void generateKeyStore() {
        try {
            java.security.KeyStore ks = java.security.KeyStore.getInstance(java.security.KeyStore.getDefaultType());
            String password = "temp1234";
            ks.load(null,password.toCharArray());

            FileOutputStream outputStream = new FileOutputStream("PKIStore");
            ks.store(outputStream,password.toCharArray());
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

    public KeyStore() {}

    public void KeyStoreImport(PrivateKey privateKey, X509Certificate[] cert,String location,String alias) {

        try {
            FileInputStream is = new FileInputStream("PKIStore");
            java.security.KeyStore keyStore = java.security.KeyStore.getInstance(
                    java.security.KeyStore.getDefaultType()
            );

            keyStore.load(is,"temp1234".toCharArray());

            System.out.println(alias);

            char[] password = "temp1234".toCharArray();

            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            InputStream certstream = fullStream (location);
            Certificate certs =  cf.generateCertificate(certstream);

            File keystoreFile = new File("PKIStore");
            // Load the keystore contents
            FileInputStream in = new FileInputStream(keystoreFile);
            keyStore.load(in, password);
            in.close();

            // Add the certificate
            keyStore.setCertificateEntry(alias, certs);
            if (alias.equals("ROOT")) {
                keyStore.setKeyEntry("PrivateKey",privateKey,password,cert);
            }

            final StringWriter s = new StringWriter();
            try (JcaPEMWriter w = new JcaPEMWriter(s)) {
                w.writeObject(privateKey);
            }

            // Save the new keystore contents
            FileOutputStream out = new FileOutputStream(keystoreFile);
            keyStore.store(out, password);
            out.close();

        } catch (IOException e) {

        } catch (Exception e) {
            System.out.println("this" + e);
        }

    }

    private InputStream fullStream ( String fname ) throws IOException {
        FileInputStream fis = new FileInputStream(fname);
        DataInputStream dis = new DataInputStream(fis);
        byte[] bytes = new byte[dis.available()];
        dis.readFully(bytes);
        ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
        return bais;
    }

}
