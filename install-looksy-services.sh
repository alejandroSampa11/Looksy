#!/bin/bash

# Script de instalación para Looksy en Rocky Linux
# Ejecutar con permisos de root: sudo ./install-looksy-services.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Instalando servicios de Looksy en Rocky Linux${NC}"

# Verificar que se ejecuta como root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}❌ Este script debe ejecutarse como root${NC}"
   echo "Uso: sudo ./install-looksy-services.sh"
   exit 1
fi

# Crear usuario y grupo para la aplicación
echo -e "${YELLOW}👤 Creando usuario looksy...${NC}"
if ! id "looksy" &>/dev/null; then
    useradd -r -s /bin/false -d /opt/looksy looksy
    echo -e "${GREEN}✅ Usuario looksy creado${NC}"
else
    echo -e "${YELLOW}⚠️  Usuario looksy ya existe${NC}"
fi

# Crear directorio de la aplicación
echo -e "${YELLOW}📁 Creando directorios...${NC}"
mkdir -p /opt/looksy
chown looksy:looksy /opt/looksy

# Verificar que Node.js está instalado
echo -e "${YELLOW}🔍 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Instalando Node.js..."
    
    # Instalar Node.js usando NodeSource repository
    curl -fsSL https://rpm.nodesource.com/setup_lts.x | bash -
    dnf install -y nodejs
    
    echo -e "${GREEN}✅ Node.js instalado${NC}"
else
    echo -e "${GREEN}✅ Node.js ya está instalado: $(node --version)${NC}"
fi

# Verificar que MongoDB está instalado
echo -e "${YELLOW}🔍 Verificando MongoDB...${NC}"
if ! systemctl is-enabled mongod &>/dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB no está configurado como servicio${NC}"
    echo "Por favor, instala y configura MongoDB antes de continuar"
    echo "Guía: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/"
fi

# Copiar archivos del proyecto (asumiendo que están en el directorio actual)
echo -e "${YELLOW}📋 Copiando archivos del proyecto...${NC}"
if [ -d "./backend-looksy" ] && [ -d "./frontend-looksy" ]; then
    cp -r ./backend-looksy /opt/looksy/
    cp -r ./frontend-looksy /opt/looksy/
    chown -R looksy:looksy /opt/looksy
    echo -e "${GREEN}✅ Archivos del proyecto copiados${NC}"
else
    echo -e "${RED}❌ No se encontraron los directorios backend-looksy y frontend-looksy${NC}"
    echo "Asegúrate de ejecutar este script desde el directorio raíz del proyecto"
    exit 1
fi

# Copiar archivos de servicio
echo -e "${YELLOW}🔧 Instalando servicios systemd...${NC}"
cp looksy-backend.service /etc/systemd/system/
cp looksy-frontend.service /etc/systemd/system/
cp looksy.service /etc/systemd/system/

# Recargar systemd
systemctl daemon-reload

# Habilitar servicios
echo -e "${YELLOW}⚡ Habilitando servicios...${NC}"
systemctl enable looksy-backend.service
systemctl enable looksy-frontend.service
systemctl enable looksy.service

echo -e "${GREEN}✅ Servicios habilitados${NC}"

# Configurar firewall (opcional)
echo -e "${YELLOW}🔥 Configurando firewall...${NC}"
if command -v firewall-cmd &> /dev/null; then
    # Abrir puertos para el backend (puerto 3000) y frontend (puerto 4173)
    firewall-cmd --permanent --add-port=3000/tcp
    firewall-cmd --permanent --add-port=4173/tcp
    firewall-cmd --reload
    echo -e "${GREEN}✅ Puertos 3000 y 4173 abiertos en firewall${NC}"
else
    echo -e "${YELLOW}⚠️  firewall-cmd no encontrado, configura manualmente los puertos 3000 y 4173${NC}"
fi

# Crear archivo de configuración de entorno
echo -e "${YELLOW}📝 Creando archivo de configuración...${NC}"
if [ ! -f "/opt/looksy/backend-looksy/.env" ]; then
    cat > /opt/looksy/backend-looksy/.env << EOF
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/looksy
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOF
    chown looksy:looksy /opt/looksy/backend-looksy/.env
    chmod 600 /opt/looksy/backend-looksy/.env
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edita /opt/looksy/backend-looksy/.env con tus configuraciones${NC}"
fi

echo -e "${GREEN}🎉 ¡Instalación completada!${NC}"
echo ""
echo -e "${YELLOW}📋 Comandos útiles:${NC}"
echo "  Iniciar todos los servicios:    sudo systemctl start looksy"
echo "  Parar todos los servicios:     sudo systemctl stop looksy"
echo "  Ver estado:                    sudo systemctl status looksy"
echo "  Ver logs del backend:          sudo journalctl -u looksy-backend -f"
echo "  Ver logs del frontend:         sudo journalctl -u looksy-frontend -f"
echo "  Reiniciar servicios:           sudo systemctl restart looksy"
echo ""
echo -e "${YELLOW}🔧 Antes de iniciar:${NC}"
echo "1. Configura MongoDB y asegúrate de que esté ejecutándose"
echo "2. Edita /opt/looksy/backend-looksy/.env con tus configuraciones"
echo "3. Inicia los servicios: sudo systemctl start looksy"
echo ""
echo -e "${GREEN}🌐 Una vez iniciado, la aplicación estará disponible en:${NC}"
echo "  Backend:  http://localhost:3000"
echo "  Frontend: http://localhost:4173"
