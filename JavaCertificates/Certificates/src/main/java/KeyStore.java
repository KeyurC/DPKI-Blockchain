import org.bouncycastle.openssl.jcajce.JcaPEMWriter;
import sun.misc.BASE64Encoder;
import sun.security.provider.X509Factory;

import java.io.*;
import java.security.Key;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

public class KeyStore {

    public void loadCAKEY() {
        try {

            ByteArrayOutputStream outStream = new ByteArrayOutputStream();
            PrintStream printStream = new PrintStream(outStream);

            FileInputStream is = new FileInputStream("PKIStore");
            java.security.KeyStore keyStore = java.security.KeyStore.getInstance(
                    java.security.KeyStore.getDefaultType()
            );
            System.out.println("test");
            keyStore.load(is,"Ironclad6!*".toCharArray());

            Key key = (PrivateKey) keyStore.getKey("privatekey","Ironclad6!*".toCharArray());
            Certificate cert = keyStore.getCertificate("ROOT");
            PublicKey publicKey = cert.getPublicKey();

            BASE64Encoder encoder = new BASE64Encoder();
            System.out.println(X509Factory.BEGIN_CERT);
            encoder.encodeBuffer(cert.getEncoded(), System.out);
            System.out.println(X509Factory.END_CERT);

            final StringWriter s = new StringWriter();
            try (JcaPEMWriter w = new JcaPEMWriter(s)) {
                w.writeObject(key);
            }
            System.out.println(s);


        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public KeyStore() {}

    public void KeyStoreImport(PrivateKey privateKey, X509Certificate[] cert) {
        String certfile = "cert.cer";

        try {
            FileInputStream is = new FileInputStream("PKIStore");
            java.security.KeyStore keyStore = java.security.KeyStore.getInstance(
                    java.security.KeyStore.getDefaultType()
            );
            System.out.println("test");
            keyStore.load(is,"Ironclad6!*".toCharArray());
            String alias = "ROOT";
            char[] password = "Ironclad6!*".toCharArray();

            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            InputStream certstream = fullStream (certfile);
            Certificate certs =  cf.generateCertificate(certstream);

            ///
            File keystoreFile = new File("PKIStore");
            // Load the keystore contents
            FileInputStream in = new FileInputStream(keystoreFile);
            keyStore.load(in, password);
            in.close();

            // Add the certificate
            keyStore.setCertificateEntry(alias, certs);
            keyStore.setKeyEntry("PrivateKey",privateKey,password,cert);

            final StringWriter s = new StringWriter();
            try (JcaPEMWriter w = new JcaPEMWriter(s)) {
                w.writeObject(privateKey);
            }
            System.out.println(s);

            // Save the new keystore contents
            FileOutputStream out = new FileOutputStream(keystoreFile);
            keyStore.store(out, password);
            out.close();

        } catch (Exception e) {
            System.out.println(e);
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
