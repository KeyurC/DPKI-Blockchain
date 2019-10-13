package Utility;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

public class Config {
    private static Config config = null;
    private LinkedHashMap<String,String> DN = new LinkedHashMap<>();
    private ArrayList<String> Whois = new ArrayList<>();

    public static Config getInstance() {
        if (config == null) {
            config = new Config();
        }
        return config;
    }

    private Config() {
        try {
            File file = new File("src/main/java/Resources/Config");
            BufferedReader reader = new BufferedReader(new FileReader(file));

            String line;
            boolean DNBool = false;
            boolean WhoisBool = false;

            while ((line = reader.readLine()) != null) {
                if(line.equals("Start DN")) {
                    DNBool = true;
                } else if (line.equals("Start WHOIS")) {
                    WhoisBool = true;
                } else if (line.equals("End")) {
                    if (DNBool) {
                        DNBool = false;
                    } else {
                        WhoisBool = false;
                    }
                } else  if (DNBool) {
                    String[] tmp = split(line);
                    DN.put(tmp[0],tmp[1]);
                } else if (WhoisBool) {
                    Whois.add(line);
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public LinkedHashMap<String,String> getDNMap() {
        return DN;
    }

    public ArrayList<String> getWhois() {
        return Whois;
    }

    private String[] split(String line) {

        String[] str;
        str = line.split(",");
        return str;
    }
}
