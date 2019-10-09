import java.io.IOException;
import java.io.PrintWriter;

public class cerFileGen {

    public void genFile() {
        try {
            PrintWriter writer = new PrintWriter("cert.cer");
            writer.println("-----BEGIN CERTIFICATE-----\n" +
                    "MIICmjCCAYKgAwIBAgIENQILuTANBgkqhkiG9w0BAQUFADAPMQ0wCwYDVQQDEwRST09UMB4XDTE5\n" +
                    "MTAwOTEzMDEzMloXDTIwMTAwODEzMDEzMlowDzENMAsGA1UEAxMEUk9PVDCCASIwDQYJKoZIhvcN\n" +
                    "AQEBBQADggEPADCCAQoCggEBAJkckYfG1f8kqX3fNt3vnJgYmnIpobhqd0T/1s8OmMpzuS5HjCRG\n" +
                    "z9C9uYxbZ7jsUsT07Re5zcDTtbw6z0RiLQg+MWJ5AwzZM4JM0ZUKktwQSV+0PPZ8wcxIwGfL2IUX\n" +
                    "dM+Y8B9cGn43e8jrPTQMhvAmJsybwmIXI87zzsw2hSP9VFQZebdef9Do8Q5hJcsk+wVoCYqROHyV\n" +
                    "bf1UtCnJsSnqsGjBL/EaMz5izlOG81n/rqZlaCcmz2FatITeTzxeotnG7Z8lbCqY1J6ZZh5ahhOF\n" +
                    "QIIb2paxEo6BCXdf/dAF9NBf9/6hE1L9j/T1RK1VAsNKdVtlGX9yF1q8bivRd88CAwEAATANBgkq\n" +
                    "hkiG9w0BAQUFAAOCAQEAd+KdxVDc9Ijg5cI3MovYJK/PfBX70b++9Eya/BkScFEZHLe8+/hIGh/l\n" +
                    "d5RPyUCpmYQf2MaSb4mjRWHFxcyUBfoO8R2iETZOWGMSrA17gbeRJtOOKOHOX3tyXVIvJKi4EGqp\n" +
                    "NB7JETqECgqOz2e8JKXaV3sSk2yJ6sdllIsQWamion2qbqzEokMtWyC99Ol+vDYrbdiTw495hBG6\n" +
                    "xyrqRO7jGZOfb+Ou1ZZrMzLqsu2mA914c3zMW76DVGVJJ+cD1z366j6bAxEoHvxoneyYJ5pxDnm7\n" +
                    "tziso8WeWtlD9MN7xo7nO4YBw8o3scP2dfulC2+Z/LhBk9tTMKYQcIPlJQ==\n" +
                    "-----END CERTIFICATE-----");
            writer.close();
        } catch (IOException e) {

        }

    }
}
