package com.ingecys.intranet_v2;

import com.ingecys.intranet_v2.entity.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println(encoder.encode("******"));
    }

}