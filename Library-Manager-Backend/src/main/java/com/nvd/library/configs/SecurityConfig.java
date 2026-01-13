    package com.nvd.library.configs;

    import com.nvd.library.filters.JwtFilter;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.core.annotation.Order;
    import org.springframework.scheduling.annotation.EnableScheduling;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.core.userdetails.UserDetailsService;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
    import org.springframework.web.cors.CorsConfiguration;
    import org.springframework.web.cors.CorsConfigurationSource;
    import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
    import org.springframework.web.multipart.support.StandardServletMultipartResolver;
    import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

    import java.util.List;

    @Configuration
    public class SecurityConfig {

        @Bean
        public JwtFilter jwtFilter() {
            return new JwtFilter();
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                    .csrf(csrf -> csrf.disable())
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers(
                                    "/api/login", "/api/register","/error",
                                    "/api/books", "/api/books/*",
                                    "/api/categories",
                                    "/api/payment/return",
                                    "/vnpay/callback",
                                    "/api/printBook/*/bookId",
                                    "/api/comments",
                                    "/api/comment/*/bookId",
                                    "/api/rating/book/*",
                                    "/api/rating/*/average",
                                    "/api/ratings"
                            ).permitAll()
                            .requestMatchers(
                                    "/api/secure/profile",
                                    "/api/users/*/update",
                                    "/api/secure/change-password",
                                    "/api/borrow/user/*/register",
                                    "/api/borrow/*/cancel",
                                    "/api/borrow/*/userid",
                                    "/api/rating/**",
                                    "/api/comment/**",
                                    "/api/borrow/add",
                                    "/api/payment/create",
                                    "/api/payment/return"

                            ).hasAnyRole("Admin", "Librarian", "Reader")
                            .requestMatchers("/").permitAll()
                            .requestMatchers(
                                     "/api/books/**",
                                     "/api/categories/**",
                                    "/api/users", "/api/users/**",
                                    "/api/readers", "api/reader/**",
                                    "/api/borrows", "/api/borrow/**",
                                    "/api/printBooks", "/api/printBook/**",
                                    "/api/fines", "/api/fine/**",
                                    "/api/payments"
                            ).hasAnyRole("Admin", "Librarian")
                            .requestMatchers(
                                    "/api/fines", "/api/fine/**",
                                    "/api/categories","/api/categories/**",
                                    "/api/users", "/api/users/**",
                                    "/api/readers", "api/reader/**",
                                    "/api/borrows", "/api/borrow/**",
                                    "/api/printBooks", "/api/printBook/**",
                                    "/api/books", "/api/books/**",
                                    "/api/statistics/**",
                                    "/api/comments", "/api/comment/**",
                                    "/api/ratings", "/api/rating/**",
                                    "/api/payments", "/api/payment/**",
                                    "/api/librarians", "/api/librarian/**",
                                    "/api/admins", "/api/admins/**"
                            ).hasAnyRole("Admin")
                            .anyRequest().authenticated()
                    )
                    .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class)
                    .logout(logout -> logout
                            .logoutSuccessUrl("/login")
                            .permitAll()
                    );

            return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration configuration = new CorsConfiguration();
            configuration.setAllowedOrigins(List.of("http://localhost:3000"));
            configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")); // Các phương thức HTTP
            configuration.setAllowedHeaders(List.of("Authorization", "Content-Type")); // Các header được phép
            configuration.setExposedHeaders(List.of("Authorization"));
            configuration.setAllowCredentials(true);

            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", configuration);
            return source;
        }

        @Bean
        public BCryptPasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }



    }