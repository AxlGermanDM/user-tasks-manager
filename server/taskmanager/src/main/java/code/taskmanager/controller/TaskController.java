package code.taskmanager.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;

import code.taskmanager.dto.CreateTaskDTO;
import code.taskmanager.dto.TaskDTO;
import code.taskmanager.dto.UpdateTaskStatusDTO;
import code.taskmanager.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tareas")
@RequiredArgsConstructor
@Tag(name = "Tareas", description = "Operaciones relacionadas con tareas")
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear una nueva tarea", security = @SecurityRequirement(name = "basicAuth"))
    public TaskDTO createTask(@Valid @RequestBody CreateTaskDTO createTaskDTO) {
        return taskService.createTask(createTaskDTO);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Obtener todas las tareas", security = @SecurityRequirement(name = "basicAuth"))
    public List<TaskDTO> getAllTask() {
        return taskService.getAllTask();
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Obtener tareas por usuario", security = @SecurityRequirement(name = "basicAuth"))
    public List<TaskDTO> getTaskByUser(@PathVariable Long userId) {
        return taskService.getTaskByUser(userId);
    }

    @PatchMapping("/{id}/estado")
    @Operation(summary = "Actualizar estado de una tarea", security = @SecurityRequirement(name = "basicAuth"))
    public TaskDTO updateTaskStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskStatusDTO updateTaskStatusDTO) {
        return taskService.updateTaskStatus(id, updateTaskStatusDTO);
    }
}
