package com.example.msvc_auth_oauth2.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(columnDefinition = "CHAR(36)")
    private UUID id;

    @NotBlank
    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @NotBlank
    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(length = 20)
    private String phone;

    @Builder.Default
    @Column(nullable = false)
    private Boolean enabled = true;

    @Builder.Default
    @Column(name = "account_non_expired", nullable = false)
    private Boolean accountNonExpired = true;

    @Builder.Default
    @Column(name = "account_non_locked", nullable = false)
    private Boolean accountNonLocked = true;

    @Builder.Default
    @Column(name = "credentials_non_expired", nullable = false)
    private Boolean credentialsNonExpired = true;

    // IMPORTANTE: EAGER fetch para evitar LazyInitializationException
    @JsonManagedReference
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<RoleEntity> roles = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addRole(RoleEntity role) {
        this.roles.add(role);
    }

    public void removeRole(RoleEntity role) {
        this.roles.remove(role);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserEntity)) return false;
        UserEntity user = (UserEntity) o;
        return id != null && id.equals(user.id);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(id);
    }

}