import org.apache.commons.net.whois.WhoisClient;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import javax.management.Query;
import java.io.BufferedReader;
import java.io.StringReader;
import java.net.URI;
import java.net.URL;

public class RegistrationAuthority {
    private String[] DN = new String[2];

    public RegistrationAuthority(String[] DN) {
        this.DN = DN;
    }

    public boolean verify() {
        String[] data = new String[3];
        try {
            String url = "https://www.whois.com/whois/"+DN[0].substring(3);
            System.out.println(url);
            Document doc = Jsoup.connect("https://www.whois.com/whois/"+DN[0].substring(3)).get();
            Element rawdata = doc.getElementById("registrarData");
//            System.out.println("Data: "+ rawdata.toString());

            BufferedReader reader = new BufferedReader(new StringReader(rawdata.toString()));
            String line = "";
            int count = 0;
            while ( (line=reader.readLine()) != null ) {
//                System.out.println(count + " " + line);
                if (line.contains("Registrant Organization") ||
                        line.contains("Registrant Country") ||
                        line.contains("Domain Name")) {
                    data[count++] = line.substring(line.indexOf(":")+1);
                }
            }

            boolean valid = false;
            for (int i = 0; i < data.length; i++) {
//                System.out.println(data[i].substring(data[i].indexOf(":")+2));
//                System.out.println(DN[i].substring(DN[i].indexOf("=")+1));
                if (data[i].substring(data[i].indexOf(":")+2).toLowerCase().equals(DN[i].substring(DN[i].indexOf("=")+1).toLowerCase())) {
                    valid = true;

                } else {
                    valid = false;
                }
                System.out.println(valid);
            }



            return valid;
        } catch (Exception e) {

        }
        return false;
    }


}
