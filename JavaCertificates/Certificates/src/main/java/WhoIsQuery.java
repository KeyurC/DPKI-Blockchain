import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

/**
 * Class queries the whois website and
 * extracts the domain information
 */
public class WhoIsQuery {
    private String domainInfo = "";

    /**
     * Establishes a connection to the whois website and extracts
     * the data from it.
     * @param domain Domain which is being inspected
     */
    public WhoIsQuery(String domain) {
        try {
            String url = "https://www.whois.com/whois/"+domain.substring(3);
            System.out.println(url);
            Document doc = Jsoup.connect(url).get();
            Element raw = doc.getElementById("registrarData");
            domainInfo = raw.toString();
        } catch (IOException e) {
            System.out.println("Issues retrieving document" + e);
        }

    }

    /**
     * Returns the domain information
     * @return domain info
     */
    public String[] getDomainInfo() {
        String[] data = new String[3];
        try {
            BufferedReader reader = new BufferedReader(new StringReader(domainInfo));
            String line = "";
            int count = 0;


            while ( (line=reader.readLine()) != null ) {
                if (line.contains("Registrant Organization") |
                        line.contains("Registrant Country") |
                        line.contains("Domain Name")) {

                    data[count++] = line.substring(line.indexOf(":") + 1);
                }
            }


            return data;
        } catch (IOException e) {
            System.out.println("Issues with reading domain info" + e);
        }
        return null;
    }
}
