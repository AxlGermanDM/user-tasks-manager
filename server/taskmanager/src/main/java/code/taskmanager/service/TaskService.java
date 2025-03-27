package code.taskmanager.service;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import code.taskmanager.dto.CreateTaskDTO;
import code.taskmanager.dto.TaskDTO;
import code.taskmanager.dto.UpdateTaskStatusDTO;
import code.taskmanager.exception.InvalidStatusTransitionException;
import code.taskmanager.exception.ResourceNotFoundException;
import code.taskmanager.exception.UnauthorizedAccessException;
import code.taskmanager.model.Tasks;
import code.taskmanager.model.Users;
import code.taskmanager.model.enums.Role;
import code.taskmanager.model.enums.TaskStatus;
import code.taskmanager.repository.TaskRepository;
import code.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    private static final String USUARIO_NO_ENCONTRADO = "Usuario no encontrado";

    public List<Tasks> getTasksForCurrentUser(Users currentUser) {
        if (currentUser.getRol() == Role.ADMIN) {
            return taskRepository.findAll();
        }
        return taskRepository.findByUsuarioAsignado(currentUser);
    }

    @Transactional
    public TaskDTO createTask(CreateTaskDTO createTaskDTO) {
        Users userA = userRepository.findById(createTaskDTO.getUsuarioAsignadoId())
                .orElseThrow(() -> new ResourceNotFoundException(USUARIO_NO_ENCONTRADO));

        Tasks task = Tasks.builder()
                .titulo(createTaskDTO.getTitulo())
                .descripcion(createTaskDTO.getDescripcion())
                .estado(createTaskDTO.getEstado())
                .usuarioAsignado(userA)
                .build();

        task = taskRepository.save(task);
        return mapToDTO(task);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public List<TaskDTO> getAllTask() {
        Users currentUser = getCurrentUser();

        if (currentUser.getRol() == Role.ADMIN) {
            return taskRepository.findAll().stream()
                    .map(this::mapToDTO)
                    .toList();
        } else {
            return taskRepository.findByUsuarioAsignado(currentUser).stream()
                    .map(this::mapToDTO)
                    .toList();
        }
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getTaskByUser(Long userId) {
        Users currentUser = getCurrentUser();
        Users requestedUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(USUARIO_NO_ENCONTRADO));

        if (currentUser.getRol() != Role.ADMIN && !currentUser.getId().equals(requestedUser.getId())) {
            throw new UnauthorizedAccessException("No tienes permiso para ver las tareas de este usuario");
        }

        return taskRepository.findByUsuarioAsignado(requestedUser).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional
    @PreAuthorize("hasRole('ADMIN') or @tareaService.isOwner(#id, authentication.name)")
    public TaskDTO updateTaskStatus(Long taskId, UpdateTaskStatusDTO updateTaskStatusDTO) {
        Tasks task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Tarea no encontrada"));

        Users currentUser = getCurrentUser();
        if (currentUser.getRol() != Role.ADMIN && !task.getUsuarioAsignado().getId().equals(currentUser.getId())) {
            throw new UnauthorizedAccessException("No tienes permiso para actualizar esta tarea");
        }

        validateStatusTransition(task.getEstado(), updateTaskStatusDTO.getNuevoEstado());

        task.setEstado(updateTaskStatusDTO.getNuevoEstado());
        task = taskRepository.save(task);
        return mapToDTO(task);
    }

    public boolean isOwner(Long taskId, String username) {
        return taskRepository.existsByIdAndUsuarioAsignadoEmail(taskId, username);
    }

    private void validateStatusTransition(TaskStatus currentStatus, TaskStatus newStatus) {
        if (currentStatus == TaskStatus.PENDIENTE && newStatus == TaskStatus.COMPLETADA) {
            throw new InvalidStatusTransitionException("No se puede cambiar de PENDIENTE directamente a COMPLETADA");
        }

        if (currentStatus == TaskStatus.COMPLETADA && newStatus != TaskStatus.COMPLETADA) {
            throw new InvalidStatusTransitionException("No se puede cambiar el estado de una tarea COMPLETADA");
        }

        if (currentStatus == TaskStatus.EN_PROGRESO && newStatus == TaskStatus.PENDIENTE) {
            throw new InvalidStatusTransitionException("No se puede retroceder de EN_PROGRESO a PENDIENTE");
        }
    }

    private TaskDTO mapToDTO(Tasks task) {
        return TaskDTO.builder()
                .id(task.getId())
                .titulo(task.getTitulo())
                .descripcion(task.getDescripcion())
                .estado(task.getEstado())
                .usuarioAsignadoId(task.getUsuarioAsignado().getId())
                .build();
    }

    private Users getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(USUARIO_NO_ENCONTRADO));
    }

}
