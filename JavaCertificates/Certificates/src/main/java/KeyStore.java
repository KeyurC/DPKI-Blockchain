import java.io.*;
import java.security.PrivateKey;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

public class KeyStore {

    public KeyStore(PrivateKey privateKey, X509Certificate[] cert) {
        String certfile = "cert.cer";

        try {
            FileInputStream is = new FileInputStream("PKIStore");
            java.security.KeyStore keyStore = java.security.KeyStore.getInstance(
                    java.security.KeyStore.getDefaultType()
            );
            System.out.println("test");
            keyStore.load(is,"password".toCharArray());
            String alias = "ROOT";
            char[] password = "password".toCharArray();

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
