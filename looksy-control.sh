#!/bin/bash

# Script de gestión de servicios Looksy
# Uso: ./looksy-control.sh [start|stop|restart|status|logs|update]

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

show_help() {
    echo -e "${BLUE}🔧 Script de gestión de servicios Looksy${NC}"
    echo ""
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo "  start     - Iniciar todos los servicios"
    echo "  stop      - Parar todos los servicios"
    echo "  restart   - Reiniciar todos los servicios"
    echo "  status    - Mostrar estado de los servicios"
    echo "  logs      - Mostrar logs en tiempo real"
    echo "  update    - Actualizar la aplicación"
    echo "  health    - Verificar salud de los servicios"
    echo "  help      - Mostrar esta ayuda"
    echo ""
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        echo -e "${RED}❌ Este script debe ejecutarse como root${NC}"
        echo "Uso: sudo $0 $1"
        exit 1
    fi
}

start_services() {
    echo -e "${YELLOW}🚀 Iniciando servicios Looksy...${NC}"
    systemctl start looksy
    
    if systemctl is-active --quiet looksy-backend && systemctl is-active --quiet looksy-frontend; then
        echo -e "${GREEN}✅ Servicios iniciados correctamente${NC}"
        echo -e "${BLUE}🌐 Backend disponible en: http://localhost:3000${NC}"
        echo -e "${BLUE}🌐 Frontend disponible en: http://localhost:4173${NC}"
    else
        echo -e "${RED}❌ Error al iniciar los servicios${NC}"
        systemctl status looksy-backend looksy-frontend
    fi
}

stop_services() {
    echo -e "${YELLOW}⏹️  Parando servicios Looksy...${NC}"
    systemctl stop looksy
    echo -e "${GREEN}✅ Servicios detenidos${NC}"
}

restart_services() {
    echo -e "${YELLOW}🔄 Reiniciando servicios Looksy...${NC}"
    systemctl restart looksy
    
    sleep 5
    
    if systemctl is-active --quiet looksy-backend && systemctl is-active --quiet looksy-frontend; then
        echo -e "${GREEN}✅ Servicios reiniciados correctamente${NC}"
    else
        echo -e "${RED}❌ Error al reiniciar los servicios${NC}"
        systemctl status looksy-backend looksy-frontend
    fi
}

show_status() {
    echo -e "${BLUE}📊 Estado de los servicios Looksy:${NC}"
    echo ""
    
    echo -e "${YELLOW}🔧 Servicio principal:${NC}"
    systemctl status looksy --no-pager -l
    echo ""
    
    echo -e "${YELLOW}⚙️  Backend:${NC}"
    systemctl status looksy-backend --no-pager -l
    echo ""
    
    echo -e "${YELLOW}🎨 Frontend:${NC}"
    systemctl status looksy-frontend --no-pager -l
    echo ""
    
    # Verificar puertos
    echo -e "${YELLOW}🌐 Puertos en uso:${NC}"
    if command -v ss &> /dev/null; then
        ss -tlnp | grep -E ':3000|:4173' || echo "No hay servicios escuchando en los puertos 3000 o 4173"
    elif command -v netstat &> /dev/null; then
        netstat -tlnp | grep -E ':3000|:4173' || echo "No hay servicios escuchando en los puertos 3000 o 4173"
    fi
}

show_logs() {
    echo -e "${BLUE}📝 Logs de Looksy (Ctrl+C para salir):${NC}"
    journalctl -u looksy-backend -u looksy-frontend -f --since "1 hour ago"
}

health_check() {
    echo -e "${BLUE}🏥 Verificación de salud de Looksy:${NC}"
    echo ""
    
    # Verificar servicios systemd
    echo -e "${YELLOW}🔍 Verificando servicios systemd...${NC}"
    if systemctl is-active --quiet looksy-backend; then
        echo -e "${GREEN}✅ Backend activo${NC}"
    else
        echo -e "${RED}❌ Backend inactivo${NC}"
    fi
    
    if systemctl is-active --quiet looksy-frontend; then
        echo -e "${GREEN}✅ Frontend activo${NC}"
    else
        echo -e "${RED}❌ Frontend inactivo${NC}"
    fi
    
    # Verificar MongoDB
    echo -e "${YELLOW}🔍 Verificando MongoDB...${NC}"
    if systemctl is-active --quiet mongod; then
        echo -e "${GREEN}✅ MongoDB activo${NC}"
    else
        echo -e "${RED}❌ MongoDB inactivo${NC}"
        echo "Para iniciar MongoDB: sudo systemctl start mongod"
    fi
    
    # Verificar conectividad HTTP
    echo -e "${YELLOW}🔍 Verificando conectividad HTTP...${NC}"
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|404\|401"; then
        echo -e "${GREEN}✅ Backend responde en puerto 3000${NC}"
    else
        echo -e "${RED}❌ Backend no responde en puerto 3000${NC}"
    fi
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:4173 | grep -q "200\|404"; then
        echo -e "${GREEN}✅ Frontend responde en puerto 4173${NC}"
    else
        echo -e "${RED}❌ Frontend no responde en puerto 4173${NC}"
    fi
    
    # Verificar espacio en disco
    echo -e "${YELLOW}🔍 Verificando espacio en disco...${NC}"
    df -h /opt/looksy | tail -1 | awk '{
        if ($5 >= 90) 
            printf "\033[0;31m❌ Espacio en disco crítico: %s usado\033[0m\n", $5
        else if ($5 >= 80) 
            printf "\033[1;33m⚠️  Espacio en disco alto: %s usado\033[0m\n", $5
        else 
            printf "\033[0;32m✅ Espacio en disco OK: %s usado\033[0m\n", $5
    }'
    
    # Verificar memoria
    echo -e "${YELLOW}🔍 Verificando uso de memoria...${NC}"
    free -h | awk '/^Mem/ {
        used_percent = ($3/$2) * 100
        if (used_percent >= 90) 
            printf "\033[0;31m❌ Memoria crítica: %.1f%% usado\033[0m\n", used_percent
        else if (used_percent >= 80) 
            printf "\033[1;33m⚠️  Memoria alta: %.1f%% usado\033[0m\n", used_percent
        else 
            printf "\033[0;32m✅ Memoria OK: %.1f%% usado\033[0m\n", used_percent
    }'
}

update_app() {
    echo -e "${YELLOW}🔄 Actualizando aplicación Looksy...${NC}"
    
    # Verificar que estamos en el directorio correcto
    if [ ! -f "backend-looksy/package.json" ] || [ ! -f "frontend-looksy/package.json" ]; then
        echo -e "${RED}❌ No se encontraron los directorios del proyecto${NC}"
        echo "Ejecuta este script desde el directorio raíz del proyecto Looksy"
        exit 1
    fi
    
    # Parar servicios
    echo -e "${YELLOW}⏹️  Parando servicios...${NC}"
    systemctl stop looksy
    
    # Hacer backup de la configuración
    echo -e "${YELLOW}💾 Haciendo backup de configuración...${NC}"
    cp /opt/looksy/backend-looksy/.env /tmp/looksy-env-backup-$(date +%Y%m%d-%H%M%S)
    
    # Actualizar archivos
    echo -e "${YELLOW}📋 Actualizando archivos...${NC}"
    cp -r backend-looksy /opt/looksy/
    cp -r frontend-looksy /opt/looksy/
    chown -R looksy:looksy /opt/looksy
    
    # Restaurar configuración
    if [ -f "/tmp/looksy-env-backup-$(date +%Y%m%d-*)" ]; then
        cp /tmp/looksy-env-backup-* /opt/looksy/backend-looksy/.env 2>/dev/null || true
    fi
    
    # Reiniciar servicios
    echo -e "${YELLOW}🚀 Reiniciando servicios...${NC}"
    systemctl start looksy
    
    sleep 5
    
    if systemctl is-active --quiet looksy-backend && systemctl is-active --quiet looksy-frontend; then
        echo -e "${GREEN}✅ Actualización completada correctamente${NC}"
    else
        echo -e "${RED}❌ Error durante la actualización${NC}"
        systemctl status looksy-backend looksy-frontend
    fi
}

# Procesamiento de argumentos
case "${1:-help}" in
    "start")
        check_root start
        start_services
        ;;
    "stop")
        check_root stop
        stop_services
        ;;
    "restart")
        check_root restart
        restart_services
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "health")
        health_check
        ;;
    "update")
        check_root update
        update_app
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        echo -e "${RED}❌ Comando desconocido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
