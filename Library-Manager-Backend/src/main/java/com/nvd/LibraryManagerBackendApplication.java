package com.nvd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling

public class LibraryManagerBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibraryManagerBackendApplication.class, args);
    }

}
