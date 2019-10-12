import org.bouncycastle.openssl.jcajce.JcaPEMWriter;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.security.cert.X509Certificate;

public class cerFileGen {

    public void genFile(X509Certificate[] cert, String name) {
        try {

            PrintWriter writer = new PrintWriter("Certificates/"+name+".cer");
            try (JcaPEMWriter w = new JcaPEMWriter(writer)) {
                w.writeObject(cert[0]);
            }
//            System.out.println(cert[0]);
            writer.close();
        } catch (Exception e) {

        }

    }
}
