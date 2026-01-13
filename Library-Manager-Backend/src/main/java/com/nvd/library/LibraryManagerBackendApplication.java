package com.nvd.library;

import com.nvd.library.configs.VNPayConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
//@EnableConfigurationProperties(VNPayConfig.class)
public class LibraryManagerBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(LibraryManagerBackendApplication.class, args);
    }

}