package code.taskmanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import code.taskmanager.model.Tasks;
import code.taskmanager.model.Users;

public interface TaskRepository extends JpaRepository<Tasks, Long> {
    List<Tasks> findByUsuarioAsignado(Users user);

    boolean existsByIdAndUsuarioAsignadoEmail(Long id, String email);
}
