import org.bouncycastle.asn1.x509.AlgorithmIdentifier;
import org.bouncycastle.asn1.x509.Certificate;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.crypto.params.AsymmetricKeyParameter;
import org.bouncycastle.crypto.util.PrivateKeyFactory;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.DefaultDigestAlgorithmIdentifierFinder;
import org.bouncycastle.operator.DefaultSignatureAlgorithmIdentifierFinder;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.operator.bc.BcRSAContentSignerBuilder;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;
import sun.misc.BASE64Encoder;
import sun.security.pkcs10.PKCS10;
import sun.security.provider.X509Factory;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.security.KeyPair;
import java.security.NoSuchProviderException;
import java.security.PrivateKey;
import java.security.cert.CertificateEncodingException;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Date;

/**
 * Signs a CSR using a CA,
 * https://stackoverflow.com/questions/7230330/sign-csr-using-bouncy-castle
 * The stackoverflow I followed to sign a certificate using the PK of a CA
 */
public class CertifcateSigner {
    private PKCS10 pkcs10;
    private KeyPair keyPair;
    private PrivateKey caKey;
    private X509CertificateHolder cert;

    public CertifcateSigner(PKCS10 newPkcs10, KeyPair newKeyPair, PrivateKey newCaKey) {
        this.pkcs10 = newPkcs10;
        this.keyPair = newKeyPair;
        this.caKey = newCaKey;
    }

    public void createCert() {
        try {
            AlgorithmIdentifier sigAlgId = new DefaultSignatureAlgorithmIdentifierFinder()
                    .find("SHA1withRSA");
            AlgorithmIdentifier digAlgId = new DefaultDigestAlgorithmIdentifierFinder()
                    .find(sigAlgId);

            AsymmetricKeyParameter CAPK = PrivateKeyFactory.createKey(caKey
                    .getEncoded());

            SubjectPublicKeyInfo keyInfo = SubjectPublicKeyInfo.getInstance(keyPair
                    .getPublic().getEncoded());
            PKCS10CertificationRequest pk10Holder = new PKCS10CertificationRequest(pkcs10.getEncoded());


            X509v3CertificateBuilder myCertificateGenerator = new X509v3CertificateBuilder(new org.bouncycastle.asn1.x500.X500Name("CN=ROOT"),
                    new BigInteger("1"), new Date(), new Date(), pk10Holder.getSubject(), keyInfo);

            //Keyinfo is the public key of the CSR

            ContentSigner sigGen = new BcRSAContentSignerBuilder(sigAlgId, digAlgId)
                    .build(CAPK);

            cert = myCertificateGenerator.build(sigGen);


        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (OperatorCreationException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    public void printDecoded() {
        try {
            Certificate eeX509CertificateStructure = cert.toASN1Structure();
            CertificateFactory cf = CertificateFactory.getInstance("X.509", "BC");

            InputStream is1 = new ByteArrayInputStream(eeX509CertificateStructure.getEncoded());
            X509Certificate theCert = (X509Certificate) cf.generateCertificate(is1);
            is1.close();
            System.out.println(theCert.toString());
        } catch (NoSuchProviderException| IOException | CertificateException e) {

        }
    }

    public void print() {
        try {
            BASE64Encoder encoder = new BASE64Encoder();
            System.out.println(X509Factory.BEGIN_CERT);
            encoder.encodeBuffer(cert.getEncoded(), System.out);
            System.out.println(X509Factory.END_CERT);

        } catch (IOException e) {

        }
    }
}