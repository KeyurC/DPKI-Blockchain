package Utility;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import java.security.Security;

/**
 * Set up class which runs all the other classes and methods
 */
public class setUp {
    public static void main(String[] args) {
        Security.addProvider(new BouncyCastleProvider());
        Controller controller = new Controller();

    }
}
