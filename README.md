# Prueba práctica para coordinador de Front End. Duración 4 horas.

## Instrucciones de desarrollo
1. Clonar este repositorio
2. Creacion de Login para ingreso al sistema, se conectará al API https://api-dev.logikoss.com/v1/auth/login con email: test@logikoss.com, password: 12345678
   - Tiene que enviar un header con valor x-app: B2B
   - Validación de correo, del dominio antes mencionado
   - Puntos extra, registro y recuperación de contraseña
3. https://api-dev.logikoss.com/v1/users/me por medio de este endpoint mostrar la información del usuario de bienvenida y mostrar nombre o email en el navbar (token requerido).
4. Barra de búsqueda con autocomplete de los repositorios públicos de GitHub, para eso se toma como base el siguiente endpoint https://api.github.com/search/repositories?q={term}
5. Al seleccionar un repositorio, mostrar un card con los datos relevantes e imagen del owner (más diseño puntos extra).
6. Agregar botón de cierre de sesión en navbar, endpoint https://api-dev.logikoss.com/v1/auth/logout (token requerido)

### Condiciones generales
- El proyecto deberá subirse a un repositorio publico de GitHub del propio aspirante y contener un Readme, con los requisitos e instrucciones de prueba e instalación 
- El proyecto deberá ser desarrollado 100% en Vue basado en Vuetify
- El proyecto deberá ser 100% responsivo
- El tema es libre, pero deberá ser basado en la identidad de https://www.logikoss.com/
- Entre mas UI/UX se aplique al proyecto, se considerarán como puntos extras
- Si se realizan pruebas unitarias serán consideradas como puntos extra
- Notificar el término de la prueba al correo npc@3hbcservicios.com, incluir el link del repositorio.
