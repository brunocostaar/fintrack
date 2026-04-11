package backend.fintrack.Config;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // 1. Configuramos o "Moedor de Carne" - o algoritmo BCrypt!
    // Toda vez que chamarmos passwordEncoder.encode(senha), ele vai fazer o hash imbatível.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    // 2. Coração do Spring Security: O Filtro de Corrente
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Nas APIs REST (Stateless) não precisamos de CSRF
            .cors(cors -> cors.configure(http)) // Reaproveita o CorsConfiguration que criei antes
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Não usaremos Sessões de Memória, mas apenas Tokens!
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll() // LIBERA O CORS PREFLIGHT DA TELA!
                .requestMatchers("/api/auth/**", "/error").permitAll() // QUALQUER PESSOA entra na rota de Login / Registro e visualiza ERROS DE API!
                .anyRequest().authenticated() // QUALQUER OUTRA ROTA só entra se tiver o Token!
            )
            .addFilterBefore(jwtAuthenticationFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
}
