package code.taskmanager;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import code.taskmanager.config.AdminConfig;
import code.taskmanager.model.Users;
import code.taskmanager.model.enums.Role;
import code.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final AdminConfig adminConfig;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("admin@example.com")) {
            Users admin = Users.builder()
                    .nombre("Administrador")
                    .email(adminConfig.getEmail())
                    .password(passwordEncoder.encode(adminConfig.getPassword()))
                    .rol(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }
    }
}
