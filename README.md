
# 📦 Sistema de Gestión de Inventario con AWS S3

## *Arquitectura Empresarial Basada en Microservicios*

## 📋 Descripción del Proyecto

Este sistema es una plataforma empresarial completa para la gestión de inventario, desarrollada con una arquitectura de microservicios altamente escalable.

Permite a empresas administrar de manera eficiente:

* Gestión de productos y categorías
* Movimientos de stock en tiempo real
* Alertas automáticas por inventario crítico
* Autenticación segura mediante JWT
* Notificaciones instantáneas
* Almacenamiento de imágenes en AWS S3 mediante URLs pre-firmadas

El objetivo es ofrecer una solución robusta, modular y lista para entornos de producción.

---

## ⭐ Características Principales

### **Gestión del Inventario**

* CRUD completo de productos
* Movimientos de stock: entradas, salidas y ajustes
* Historial detallado de transacciones
* Categorías personalizables
* Detección automática de stock bajo

### **Infraestructura y Seguridad**

* Autenticación y autorización con JWT
* API Gateway centralizado
* Registro dinámico de microservicios con Eureka
* Caché distribuida con Redis
* Comunicación asíncrona con RabbitMQ

### **Almacenamiento y Tiempo Real**

* Subida de imágenes a AWS S3
* Generación de URLs pre-firmadas (PUT/GET)
* Notificaciones en tiempo real con WebSocket + STOMP
* Dashboard dinámico

### **Casos de Uso**

* PYMES y comercios minoristas
* Centros de distribución y bodegas
* E-commerce con catálogo visual
* Sistemas que requieren alertas de reabastecimiento

---

## 🛠️ Tecnologías Utilizadas

### **Backend**

* Spring Boot 3
* Spring Cloud (Eureka, Gateway, Config Server)
* Spring Security + JWT
* Spring Data JPA (Hibernate)
* Feign Client
* MySQL 8.0
* Redis 6.0
* RabbitMQ 3.9
* AWS S3 + AWS SDK v2
* WebSocket + STOMP

### **Frontend**

* React 18
* Material UI v5
* React Router v6
* Axios
* SockJS / STOMP
* Context API
* JWT Decode

### **Herramientas**

* Maven / Maven Wrapper
* npm
* Lombok
* Git

---

## 🧱 Arquitectura del Sistema

El sistema está compuesto por los siguientes microservicios:

### **🔍 1. microservice-eureka (8761)**

* Service Discovery
* Registro y balanceo de servicios

### **⚙️ 2. microservice-config (8888)**

* Configuración centralizada
* Manejo de entornos (dev, test, prod)

### **🌐 3. microservice-gateway (8080)**

* Único punto de entrada
* Filtros globales de seguridad
* Configuración CORS

### **🔐 4. microservice-auth (8081)**

* Gestión de usuarios
* Generación/validación de tokens
* Notificaciones WebSocket para login/logout

### **☁️ 5. microservice-aws (8082)**

* Integración con AWS S3
* Generación de URLs pre-firmadas
* Manejo de buckets y permisos

### **📦 6. microservice-inventory (8083)**

* CRUD de productos
* Detección automática de stock bajo
* Publicación de eventos a RabbitMQ

### **🔔 7. microservice-notifications (8084)**

* Procesamiento de eventos
* Almacenamiento de notificaciones
* WebSocket de alertas en tiempo real

---

## 🔄 Flujo de Datos

```
Frontend → Gateway → Microservicio → MySQL
                                   ↓
                               RabbitMQ → Notifications
                                   ↓
                               WebSocket → Frontend
```

---

## 🚀 Instalación y Configuración

### **Prerrequisitos**

* Java 17+
* Node.js 16+
* MySQL 8+
* Redis 6+
* RabbitMQ 3.9+
* Cuenta AWS + IAM
* Maven o Maven Wrapper

---

## 📥 1. Clonar Repositorio

```bash
git clone <repository-url>
cd auth-module-initial-aws
```

---

## 🗄️ 2. Configurar MySQL

**Crear base de datos:**

```sql
CREATE DATABASE inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Actualizar credenciales en:**

* `msvc-auth.yml`
* `msvc-inventory.yml`
* `msvc-notifications.yml`

---

## ⚡ 3. Configurar Redis

```bash
redis-server --port 6379  # inventory
redis-server --port 6380  # auth
```

---

## 📨 4. Configurar RabbitMQ

```bash
rabbitmq-server
rabbitmq-plugins enable rabbitmq_management
```

**Acceso:** [http://localhost:15672](http://localhost:15672)
**User:** guest
**Pass:** guest

---

## ☁️ 5. Configurar AWS S3

### **5.1 Credenciales**

AWS Console → IAM → User → Security Credentials → Create Access Key
⚠️ No subir credenciales al repositorio.

### **5.2 Crear Bucket**

* Nombre: `my-inventory-bucketken`
* Región: `us-east-1`

### **5.3 Configuración CORS**

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["http://localhost:3000"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

---

## 🌎 6. Configuración de Zona Horaria (CRÍTICA)

El microservicio AWS requiere sincronización exacta para generar URLs pre-firmadas.

Archivo:
`microservice-aws/MicroserviceAwsApplication.java`

```java
TimeZone.setDefault(TimeZone.getTimeZone("America/Guayaquil"));
```

**Problemas si no se configura:**

* SignatureDoesNotMatch
* URL expirada

**Recomendación:**

* DEV → America/Guayaquil
* PROD → UTC

---

## 🔐 7. Configurar JWT Secret

**Generar clave:**

```bash
echo -n "clave-muy-segura" | base64
```

**Configurar en `msvc-auth.yml`:**

```yaml
jwt:
  secret:
    key: <CLAVE_BASE64>
  time:
    expiration: 3600000
```

---

## 🟢 8. Iniciar Microservicios (ORDEN OBLIGATORIO)

```bash
# Eureka
cd microservice-eureka
./mvnw spring-boot:run

# Config Server
cd ../microservice-configuration
./mvnw spring-boot:run
```

Esperar 30 segundos.
Luego iniciar los demás servicios en cualquier orden.

---

## 🖥️ 9. Ejecutar Frontend

```bash
cd inventory-frontend
npm install
npm start
```

Acceder a:
➡️ [http://localhost:3000](http://localhost:3000)

---

## 🎯 Uso del Sistema

* Registro e inicio de sesión
* Gestión de inventario
* Carga de imágenes a S3
* Notificaciones en tiempo real
* Dashboard de métricas

---

## 🔍 Verificación Rápida

| Servicio         | URL                                                                            |
| ---------------- | ------------------------------------------------------------------------------ |
| Eureka Dashboard | [http://localhost:8761](http://localhost:8761)                                 |
| API Gateway      | [http://localhost:8080](http://localhost:8080)                                 |
| Health Check     | [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health) |

---

## 🐛 Troubleshooting

| Problema                        | Causa                    | Solución                           |
| ------------------------------- | ------------------------ | ---------------------------------- |
| SignatureDoesNotMatch           | Zona horaria incorrecta  | Configurar America/Guayaquil o UTC |
| WebSocket no conecta            | Auth no está arriba      | Verificar puerto 8081              |
| Servicios no aparecen en Eureka | Config Server no cargó   | Esperar 1 minuto                   |
| Error de BD                     | Credenciales incorrectas | Revisar YAML                       |

---

## 🖼️ Capturas del Sistema

<img width="1919" src="https://github.com/user-attachments/assets/e771daeb-596e-49e2-8f27-a1c90588c45a" />

<img width="1919" src="https://github.com/user-attachments/assets/22c650ba-1141-4170-b149-2d2feee18b5a" />

<img width="1899" src="https://github.com/user-attachments/assets/3eefc3f2-e9dd-4160-b417-74e89bc076c7" />

<img width="1919" src="https://github.com/user-attachments/assets/b481425e-b9ec-49c6-bcab-b235274a7d02" />


