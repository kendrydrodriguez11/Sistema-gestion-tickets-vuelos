package com.example.msvc_auth_oauth2.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "roles")
public class RoleEntity {

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    // ✅ CAMBIO: De @NotBlank a @NotNull (los enums no pueden usar @NotBlank)
    @NotNull(message = "El nombre del rol es requerido")
    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false, length = 20)
    private UserRole name;

    @Column(length = 200)
    private String description;

    // IMPORTANTE: Cambiar a JsonBackReference para evitar ciclos
    @JsonBackReference
    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<UserEntity> users = new HashSet<>();
}