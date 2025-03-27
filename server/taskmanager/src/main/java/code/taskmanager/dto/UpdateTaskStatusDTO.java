package code.taskmanager.dto;

import code.taskmanager.model.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTaskStatusDTO {
    @NotNull(message = "El nuevo estado no puede ser nulo")
    private TaskStatus nuevoEstado;
}
