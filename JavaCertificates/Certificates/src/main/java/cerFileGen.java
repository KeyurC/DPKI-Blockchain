import org.bouncycastle.openssl.jcajce.JcaPEMWriter;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.security.cert.X509Certificate;

/**
 * Generates a cer file for a certificate
 */
public class cerFileGen {

    /**
     * Generates a cer file for certificate
     * @param cert X509 Certificate
     * @param name certificate name
     */
    public void genFile(X509Certificate[] cert, String name) {
        try {

            PrintWriter writer = new PrintWriter("Certificates/"+name+".cer");
            try (JcaPEMWriter w = new JcaPEMWriter(writer)) {
                w.writeObject(cert[0]);
            }
            writer.close();
        } catch (Exception e) {
            System.out.println("Error with cer file\n" + e);
        }

    }
}
