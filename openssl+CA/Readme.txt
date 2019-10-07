The root CA has to be trusted in order for the rest of the signing CA and certificates to be trusted.
In fedora you simply move the pem file to etc/pki/ca-trust/source/anchors

