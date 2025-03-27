package code.taskmanager.dto;

import code.taskmanager.model.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private TaskStatus estado;
    private Long usuarioAsignadoId;
}
