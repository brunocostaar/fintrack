package backend.fintrack.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import backend.fintrack.Model.User;
import backend.fintrack.Service.AuthService;

import java.util.Map;
import java.util.HashMap;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permite o Next.js conversar!
public class AuthController {

    @Autowired
    private AuthService authService;

    // Rota: POST http://localhost:8080/api/auth/register
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody @Valid User user) {
        // Envia para o serviço que vai criptografar a senha e salvar no PostgreSQL
        return ResponseEntity.ok(authService.registerUser(user));
    }

    // Rota: POST http://localhost:8080/api/auth/login
    // Usamos Map<String, String> por simplicidade para não precisarmos criar uma classe DTO só pra isso!
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        // Vai no serviço, checa os dados e nos devolve um Token JWT lindíssimo!
        String token = authService.login(email, password);

        // O Frontend geralmente espera o token num formato JSON ex: { "token": "eyJh..." }
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }
}
