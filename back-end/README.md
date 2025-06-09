# 🎮 LevelUp Generic CRUD API

API REST en **Node.js** y **Express** para gestionar entidades con operaciones CRUD, autenticación JWT y funcionalidades adicionales como paginación, localización, envío de emails y documentación con Swagger.

---

## 🚀 Características principales

- ✅ CRUD completo para entidades JSON con esquema flexible  
- 📄 Paginación, filtrado y ordenación  
- 🆔 IDs únicos con UUID  
- 💾 Almacenamiento simple en archivos JSON  
- 📚 Documentación interactiva con Swagger UI  
- 🔐 Autenticación con JWT para proteger rutas  
- 🗂️ Gestión de temáticas y localizaciones (países, comunidades, provincias)  
- 📧 Envío de correos a través de endpoint específico  

---

📚 Documentación interactiva
Consulta la documentación completa y prueba los endpoints en:

👉 http://localhost:3000/api-docs

---

## 🔐 Autenticación

Todos los endpoints requieren incluir un **JWT** válido en el header:

### Endpoints de autenticación

| Método | Endpoint     | Descripción               |
| ------ | ------------ | ------------------------- |
| POST   | /auth/signup | Registrar nuevo usuario   |
| POST   | /auth/signin | Login y obtención de JWT  |


**Entidades**
| Método | Endpoint                | Descripción                                           |
| ------ | ----------------------- | ----------------------------------------------------- |
| GET    | /api/entities           | Obtener todas las entidades                           |
| POST   | /api/entities           | Crear una nueva entidad                               |
| GET    | /api/entities/{id}      | Obtener entidad por ID                                |
| PUT    | /api/entities/{id}      | Actualizar entidad existente                          |
| DELETE | /api/entities/{id}      | Eliminar entidad                                      |
| GET    | /api/paginated-entities | Obtener entidades paginadas con filtrado y ordenación |


**Temáticas**
| Método | Endpoint       | Descripción                 |
| ------ | -------------- | --------------------------- |
| GET    | /api/tematicas | Obtener todas las temáticas |


**Localización**
| Método | Endpoint                          | Descripción                               |
| ------ | --------------------------------- | ----------------------------------------- |
| GET    | /location/countries               | Obtener todos los países                  |
| GET    | /location/communities             | Obtener todas las comunidades autónomas   |
| GET    | /location/provinces/{communityId} | Obtener provincias por comunidad autónoma |

**Email**
| Método | Endpoint    | Descripción                 |
| ------ | ----------- | --------------------------- |
| POST   | /email/send | Enviar correo de invitación |

