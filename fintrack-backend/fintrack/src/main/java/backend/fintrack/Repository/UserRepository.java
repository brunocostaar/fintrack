package backend.fintrack.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.fintrack.Model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Método mágico do Spring Data JPA!
    // Ele vai automaticamente gerar um: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);

    // Checa se o email já foi cadastrado para não termos usuários clonados
    Boolean existsByEmail(String email);
}
