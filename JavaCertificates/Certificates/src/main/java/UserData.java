import java.util.Scanner;

public class UserData {
    //CN=www.test.com,O=Daniel,OU=Nerd,C=DanielLand

    private String[] DN = new String[3];

    public UserData() {
        Scanner input = new Scanner(System.in);

        System.out.println("Enter organisation common name e.g www.example.com");
        this.DN[0] = "CN=" + input.nextLine();

        System.out.println("Enter organisation name");
        this.DN[1] = "O="+input.nextLine();

        System.out.println("Enter organisation country e.g UK");
        this.DN[2] = "C="+input.nextLine();
    }

    public String[] getDN() {
        return DN;
    }

    public String getDNToString() {
        String DNString = "";
        for (int i = 0; i < 2; i++) {
            DNString += this.DN[i] + ",";
        }
        DNString += this.DN[this.DN.length-1];
        return DNString;
    }

    public String getOrg() {
        return this.DN[1].substring(2);
    }


}
