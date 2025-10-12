# Crear una estructura del plan de desarrollo para el marketplace de coches
import pandas as pd

# Definir las fases del proyecto
fases_proyecto = {
    "Fase": [
        "1. Análisis y Planificación",
        "2. Diseño UX/UI",
        "3. MVP - Backend",
        "4. MVP - Frontend",
        "5. Integración y Pruebas",
        "6. Servicio Concierge",
        "7. Despliegue y Marketing",
        "8. Iteración y Mejoras"
    ],
    "Duración": [
        "2 semanas",
        "3 semanas", 
        "4 semanas",
        "3 semanas",
        "2 semanas",
        "3 semanas",
        "2 semanas",
        "Continuo"
    ],
    "Actividades Principales": [
        "Análisis competencia, definición requisitos, arquitectura técnica",
        "Wireframes, prototipos, diseño visual, flujos de usuario",
        "API REST, autenticación, base de datos, integración Supabase",
        "Interfaz React, componentes reutilizables, responsive design",
        "Testing, corrección bugs, optimización rendimiento",
        "Sistema recogida, workflow procesos, integración n8n",
        "Configuración hosting, dominio, SSL, estrategia lanzamiento",
        "Feedback usuarios, nuevas funcionalidades, escalabilidad"
    ]
}

# Crear DataFrame y guardarlo como CSV
df_fases = pd.DataFrame(fases_proyecto)
df_fases.to_csv("plan_desarrollo_cochestoday.csv", index=False, encoding='utf-8')

# Definir funcionalidades del MVP
funcionalidades_mvp = {
    "Categoría": [
        "Autenticación", "Autenticación", "Autenticación",
        "Gestión Anuncios", "Gestión Anuncios", "Gestión Anuncios", "Gestión Anuncios",
        "Búsqueda", "Búsqueda", "Búsqueda",
        "Comunicación", "Comunicación",
        "Panel Usuario", "Panel Usuario", "Panel Usuario",
        "Pagos", "Administración"
    ],
    "Funcionalidad": [
        "Registro con email/contraseña",
        "Login/Logout",
        "Recuperación contraseña",
        "Publicar anuncio coche",
        "Subir fotos vehículo",
        "Editar/eliminar anuncios",
        "Estado anuncio (activo/vendido)",
        "Búsqueda por marca/modelo",
        "Filtros precio/año/km",
        "Geolocalización",
        "Sistema mensajería interno",
        "Datos contacto vendedor",
        "Mis anuncios activos",
        "Favoritos",
        "Perfil usuario",
        "Pasarela pagos (opcional)",
        "Panel admin básico"
    ],
    "Prioridad": [
        "Alta", "Alta", "Media",
        "Alta", "Alta", "Alta", "Alta",
        "Alta", "Alta", "Media",
        "Alta", "Alta",
        "Alta", "Media", "Media",
        "Baja", "Media"
    ],
    "Tecnología": [
        "Supabase Auth", "Supabase Auth", "Supabase Auth",
        "Supabase DB", "Supabase Storage", "Supabase DB", "Supabase DB",
        "React + API", "React + API", "Google Maps API",
        "Supabase Realtime", "Supabase DB",
        "React Dashboard", "Supabase DB", "Supabase DB",
        "Stripe", "React Admin"
    ]
}

df_mvp = pd.DataFrame(funcionalidades_mvp)
df_mvp.to_csv("funcionalidades_mvp_cochestoday.csv", index=False, encoding='utf-8')

print("Archivos CSV creados exitosamente:")
print("1. plan_desarrollo_cochestoday.csv")
print("2. funcionalidades_mvp_cochestoday.csv")

# Mostrar resumen de fases
print("\n=== RESUMEN PLAN DE DESARROLLO ===")
for i, row in df_fases.iterrows():
    print(f"\n{row['Fase']} ({row['Duración']})")
    print(f"└─ {row['Actividades Principales']}")

# Mostrar funcionalidades por prioridad
print("\n=== FUNCIONALIDADES MVP POR PRIORIDAD ===")
for prioridad in ["Alta", "Media", "Baja"]:
    funciones_prioridad = df_mvp[df_mvp['Prioridad'] == prioridad]
    print(f"\n{prioridad.upper()} PRIORIDAD ({len(funciones_prioridad)} funcionalidades):")
    for _, func in funciones_prioridad.iterrows():
        print(f"  • {func['Funcionalidad']} ({func['Tecnología']})")