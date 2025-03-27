package code.taskmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import code.taskmanager.model.Users;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);

    boolean existsByEmail(String email);
}
