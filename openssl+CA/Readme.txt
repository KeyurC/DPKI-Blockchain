The root CA has to be trusted in order for the rest of the signing CA and certificates to be trusted.
In fedora you simply move the pem file to etc/pki/ca-trust/source/anchors

Link to document, which takes notes on openssl,explains my logic and etc
https://docs.google.com/document/d/1ld9IxK-zXXOAoIGYXFv8A8k_pl_3OiRyEFQPdRidPqQ/edit?usp=sharing

