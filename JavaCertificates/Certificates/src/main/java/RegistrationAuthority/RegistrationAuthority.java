package RegistrationAuthority;

import Utility.WhoIsQuery;

/**
 * Acts as a subordinate CA and verifies if the details entered
 * are valid.
 */
public class RegistrationAuthority {
    private String[] DN = new String[2];

    /**
     * Constructor of class
     * @param DN DN information in an Array.
     */
    public RegistrationAuthority(String[] DN) {
        this.DN = DN;
    }

    /**
     * Function verifies whether the DN info provided is correct or not.
     * @return true or false depending on if DN is correct or not.
     */
    public boolean verify() {
            WhoIsQuery whois = new WhoIsQuery(DN[0]);
            String[] data = whois.getDomainInfo();

            boolean valid = true;
            for (int i = 0; i < data.length; i++) {
                System.out.println(data[i].substring(data[i].indexOf(":")+2).toLowerCase());
                if (!(data[i].substring(data[i].indexOf(":")+2).toLowerCase().replaceAll("\\s","").equals(DN[i].substring(DN[i].indexOf("=")+1).toLowerCase().replaceAll("\\s","")))) {
                    valid = false;

                }
                System.out.println(valid);
            }

            return valid;
    }


}
