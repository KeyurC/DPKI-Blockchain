package Utility;

import CertificateAuthority.CertifcateSigner;
import CertificateAuthority.SelfSigner;
import KeyStore.KeyStore;
import RegistrationAuthority.CertificateRequest;
import RegistrationAuthority.RegistrationAuthority;
import sun.security.pkcs10.PKCS10;

import java.io.File;
import java.security.KeyPair;
import java.security.PrivateKey;
import java.util.Scanner;

public class Controller {
    private cerFileGen cf = new cerFileGen();
    private csrData input;
    private KeyStore keyStore = new KeyStore();
    private CertifcateSigner cs;
    private PrivateKey pk;

    public Controller() {
        Scanner in = new Scanner(System.in);
        System.out.println("Select 1 to create a certificate or 2 to verify an existing certificate");

        if (in.nextLine().equals("2")) {
            System.out.println("Enter certificate name");
            System.out.println(keyStore.verifyCertificate(in.nextLine()));
        } else {
            input = new csrData();
            RegistrationAuthority RA = new RegistrationAuthority(input.getDN());
            if (RA.verify()) {
                CertificateRequest csr = new CertificateRequest(input.getDNToString());
                keystore();
                if (!keyStore.verifyCAExists()) {
                  generateCA();
                }
                signCSR(csr.getCsr(),csr.getPair());
                importCert();

            } else {
                System.out.println("Data entered failed verification by the Registration authority");
            }

        }

    }

    public void keystore() {
        File tmp = new File("PKIStore");
        boolean exists = tmp.exists();
        if (!exists) {
            keyStore.generateKeyStore();
        }
    }


    public void generateCA() {
        SelfSigner selfSigner = new SelfSigner();
        PrivateKey pk = selfSigner.getRootPK();
        cf.genFile(selfSigner.getCert(),"cert");
        keyStore.KeyStoreImport(pk,selfSigner.getCert(),"Certificates/cert.cer","ROOT");
    }

    public void signCSR(PKCS10 csr, KeyPair keyPair) {
        pk = (PrivateKey) keyStore.loadCAKEY();
        cs = new CertifcateSigner(csr,keyPair,pk);
        cs.createCert();
        cs.print();

    }

    public void importCert() {
        cf.genFile(cs.getCertChain(),input.getOrg());
        keyStore.KeyStoreImport(pk,cs.getCertChain(),"Certificates/"+ input.getOrg() + ".cer",input.getOrg());
    }
}
