package Utility;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Scanner;

/**
 * Class gets the DN info provided by the user.
 */
public class csrData {
    private Config config = Config.getInstance();
    private String[] DNArray = new String[config.getDNMap().size()];

    /**
     * Constructor of class which takes in inputs of user for the
     * DN
     */
    public csrData() {
        Scanner input = new Scanner(System.in);
        LinkedHashMap<String,String> DN = config.getDNMap();
        int i = 0;

        for (Map.Entry<String,String> entry : DN.entrySet()) {
            System.out.println(entry.getValue());
            String tmp = input.nextLine();
            DNArray[i++] = entry.getKey() + "=" + tmp;
        }


    }


    /**
     * Returns the DN as an array
     * @return DN array
     */
    public String[] getDN() {
        return DNArray;
    }

    /**
     * Returns the DN as a String
     * @return DN as string
     */
    public String getDNToString() {
        String DNString = "";
        for (int i = 0; i < DNArray.length-1; i++) {
            DNString += this.DNArray[i].replaceAll("[-+.^:,]","") + ",";
        }
        DNString += this.DNArray[this.DNArray.length-1];
        return DNString;
    }

    /**
     * Returns the organisation of the DN
     * @return organisation
     */
    public String getOrg() {
        return this.DNArray[1].substring(2);
    }


}
