import java.util.Scanner;

/**
 * Class gets the DN info provided by the user.
 */
public class UserData {
    private String[] DN = new String[3];

    /**
     * Constructor of class which takes in inputs of user for the
     * DN
     */
    public UserData() {
        Scanner input = new Scanner(System.in);

        System.out.println("Enter organisation common name e.g www.example.com");
        this.DN[0] = "CN=" + input.nextLine();

        System.out.println("Enter organisation name");
        this.DN[1] = "O="+input.nextLine();

        System.out.println("Enter organisation country e.g UK");
        this.DN[2] = "C="+input.nextLine();
    }

    /**
     * Returns the DN as an array
     * @return DN array
     */
    public String[] getDN() {
        return DN;
    }

    /**
     * Returns the DN as a String
     * @return DN as string
     */
    public String getDNToString() {
        String DNString = "";
        for (int i = 0; i < 2; i++) {
            DNString += this.DN[i].replaceAll("[-+.^:,]","") + ",";
        }
        DNString += this.DN[this.DN.length-1];
        return DNString;
    }

    /**
     * Returns the organisation of the DN
     * @return organisation
     */
    public String getOrg() {
        return this.DN[1].substring(2);
    }


}
