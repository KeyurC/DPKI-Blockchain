package Utility;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;

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
        Config config = Config.getInstance();
        String[] data = new String[config.getWhois().size()];
        ArrayList<String> whoissearch = config.getWhois();
        try {
            BufferedReader reader = new BufferedReader(new StringReader(domainInfo));
            String line = "";
            int count = 0;


            while ( (line=reader.readLine()) != null ) {
                for (int i =0; i < whoissearch.size(); i++) {
                    if (line.contains(whoissearch.get(i))) {
                        data[count++] = line.substring(line.indexOf(":") + 1);
                    }
                }
            }

            for (int i = 0; i < data.length;i++) {
                System.out.println(data[i]);
            }

            return data;
        } catch (IOException e) {
            System.out.println("Issues with reading domain info" + e);
        }
        return null;
    }
}
