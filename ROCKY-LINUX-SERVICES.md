# Servicios de Looksy para Rocky Linux

Este directorio contiene los archivos necesarios para ejecutar la aplicación Looksy como servicios systemd en Rocky Linux.

## Archivos incluidos

- `looksy-backend.service` - Servicio para el backend (API)
- `looksy-frontend.service` - Servicio para el frontend (React)
- `looksy.service` - Servicio principal que maneja ambos
- `install-looksy-services.sh` - Script de instalación automática

## Instalación rápida

1. **Copia todos los archivos** del proyecto a tu servidor Rocky Linux
2. **Ejecuta el script de instalación** como root:
   ```bash
   sudo chmod +x install-looksy-services.sh
   sudo ./install-looksy-services.sh
   ```
3. **Configura las variables de entorno** en `/opt/looksy/backend-looksy/.env`
4. **Inicia los servicios**:
   ```bash
   sudo systemctl start looksy
   ```

## Instalación manual

### Prerequisitos

1. **Node.js** (versión LTS recomendada):
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
   sudo dnf install -y nodejs
   ```

2. **MongoDB**:
   ```bash
   sudo dnf install -y mongodb-org
   sudo systemctl enable mongod
   sudo systemctl start mongod
   ```

### Pasos de instalación

1. **Crear usuario del sistema**:
   ```bash
   sudo useradd -r -s /bin/false -d /opt/looksy looksy
   ```

2. **Crear directorio de la aplicación**:
   ```bash
   sudo mkdir -p /opt/looksy
   sudo chown looksy:looksy /opt/looksy
   ```

3. **Copiar archivos del proyecto**:
   ```bash
   sudo cp -r backend-looksy /opt/looksy/
   sudo cp -r frontend-looksy /opt/looksy/
   sudo chown -R looksy:looksy /opt/looksy
   ```

4. **Instalar servicios systemd**:
   ```bash
   sudo cp looksy-backend.service /etc/systemd/system/
   sudo cp looksy-frontend.service /etc/systemd/system/
   sudo cp looksy.service /etc/systemd/system/
   sudo systemctl daemon-reload
   ```

5. **Habilitar servicios**:
   ```bash
   sudo systemctl enable looksy-backend
   sudo systemctl enable looksy-frontend
   sudo systemctl enable looksy
   ```

6. **Configurar variables de entorno**:
   ```bash
   sudo nano /opt/looksy/backend-looksy/.env
   ```
   
   Contenido mínimo:
   ```env
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/looksy
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```

7. **Configurar firewall** (opcional):
   ```bash
   sudo firewall-cmd --permanent --add-port=3000/tcp
   sudo firewall-cmd --permanent --add-port=4173/tcp
   sudo firewall-cmd --reload
   ```

## Gestión de servicios

### Comandos básicos

```bash
# Iniciar todos los servicios
sudo systemctl start looksy

# Parar todos los servicios
sudo systemctl stop looksy

# Reiniciar todos los servicios
sudo systemctl restart looksy

# Ver estado
sudo systemctl status looksy
sudo systemctl status looksy-backend
sudo systemctl status looksy-frontend

# Ver logs en tiempo real
sudo journalctl -u looksy-backend -f
sudo journalctl -u looksy-frontend -f

# Ver logs históricos
sudo journalctl -u looksy-backend --since "1 hour ago"
sudo journalctl -u looksy-frontend --since "1 hour ago"
```

### Servicios individuales

```bash
# Solo backend
sudo systemctl start looksy-backend
sudo systemctl stop looksy-backend
sudo systemctl restart looksy-backend

# Solo frontend
sudo systemctl start looksy-frontend
sudo systemctl stop looksy-frontend
sudo systemctl restart looksy-frontend
```

## Configuración

### Variables de entorno del backend

Edita `/opt/looksy/backend-looksy/.env`:

```env
# Entorno de ejecución
NODE_ENV=production

# Puerto del servidor
PORT=3000

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/looksy

# Clave secreta para JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Otras configuraciones específicas de tu aplicación
# ...
```

### Puertos utilizados

- **Backend**: Puerto 3000 (configurable via PORT en .env)
- **Frontend**: Puerto 4173 (puerto por defecto de vite preview)

## Estructura de archivos en el servidor

```
/opt/looksy/
├── backend-looksy/
│   ├── src/
│   ├── dist/           # Archivos compilados de TypeScript
│   ├── uploads/        # Archivos subidos por usuarios
│   ├── package.json
│   ├── .env           # Variables de entorno
│   └── ...
└── frontend-looksy/
    ├── src/
    ├── dist/          # Build de producción
    ├── package.json
    └── ...
```

## Troubleshooting

### Problemas comunes

1. **Servicios no inician**:
   ```bash
   sudo journalctl -u looksy-backend --since "10 minutes ago"
   sudo journalctl -u looksy-frontend --since "10 minutes ago"
   ```

2. **MongoDB no conecta**:
   ```bash
   sudo systemctl status mongod
   sudo systemctl start mongod
   ```

3. **Permisos incorrectos**:
   ```bash
   sudo chown -R looksy:looksy /opt/looksy
   ```

4. **Node.js no encontrado**:
   ```bash
   which node
   sudo ln -s /usr/bin/node /usr/local/bin/node
   ```

### Verificar configuración

```bash
# Verificar que Node.js está disponible
sudo -u looksy node --version

# Verificar configuración del backend
sudo -u looksy cat /opt/looksy/backend-looksy/.env

# Verificar permisos
ls -la /opt/looksy/
```

## Seguridad

Los servicios están configurados con las siguientes medidas de seguridad:

- Ejecutan con un usuario sin privilegios (`looksy`)
- `NoNewPrivileges=true` - No pueden escalar privilegios
- `PrivateTmp=true` - Directorio temporal aislado
- `ProtectSystem=strict` - Sistema de archivos protegido
- Solo directorios específicos son escribibles

## Actualizaciones

Para actualizar la aplicación:

1. **Parar servicios**:
   ```bash
   sudo systemctl stop looksy
   ```

2. **Actualizar código**:
   ```bash
   # Respaldar configuración
   sudo cp /opt/looksy/backend-looksy/.env /tmp/looksy-env-backup
   
   # Actualizar archivos
   sudo cp -r backend-looksy /opt/looksy/
   sudo cp -r frontend-looksy /opt/looksy/
   sudo chown -R looksy:looksy /opt/looksy
   
   # Restaurar configuración
   sudo cp /tmp/looksy-env-backup /opt/looksy/backend-looksy/.env
   ```

3. **Reiniciar servicios**:
   ```bash
   sudo systemctl start looksy
   ```

## Monitoreo

Para monitorear el estado de la aplicación:

```bash
# Estado general
sudo systemctl status looksy

# Logs en tiempo real
sudo journalctl -u looksy-backend -u looksy-frontend -f

# Uso de recursos
sudo top -u looksy
```
