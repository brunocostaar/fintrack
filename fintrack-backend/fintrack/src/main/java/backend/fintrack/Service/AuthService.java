package backend.fintrack.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import backend.fintrack.Config.JwtTokenProvider;
import backend.fintrack.Model.User;
import backend.fintrack.Repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // 1. Checar se o user.getEmail() já existe no repository usando aquele
        // existsByEmail() que criei. Se existir, jogue uma Exception!
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public String login(String email, String password) {
        // 1. Vai no Postgres caçar o usuário. Se não existir, erro!
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado"));

        // 2. Confere a Senha (O BCrypt faz a checagem mágica entre o texto limpo e o hash maluco do banco)
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Senha incorreta");
        }

        // 3. Se deu tudo certo, a fábrica imprime a nota de dinheiro (Aka: O Token VIP!)
        return tokenProvider.generateToken(user.getEmail());
    }
}
