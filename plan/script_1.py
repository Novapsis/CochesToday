# Crear estructura detallada del servicio concierge
servicio_concierge = {
    "Servicio": [
        "Recogida Vehículo",
        "Evaluación Estado",
        "Limpieza Profesional", 
        "Reparaciones Menores",
        "Sesión Fotográfica",
        "Tasación Profesional",
        "Publicación Optimizada",
        "Gestión Visitas",
        "Negociación Precio",
        "Gestión Documentación",
        "Entrega Final"
    ],
    "Descripción": [
        "Recogida del vehículo en domicilio del cliente",
        "Inspección técnica completa del vehículo",
        "Lavado exterior/interior, detailing profesional",
        "Arreglos menores de carrocería, mecánica básica", 
        "Fotos profesionales en estudio/exteriores",
        "Valoración de mercado por expertos",
        "Creación anuncio optimizado con SEO",
        "Coordinación citas con compradores potenciales",
        "Negociación en nombre del propietario",
        "Trámites transferencia, contratos, seguros",
        "Entrega vehículo y pago al propietario"
    ],
    "Tiempo_Estimado": [
        "2 horas",
        "1 hora", 
        "3-4 horas",
        "1-3 días",
        "2 horas",
        "30 min",
        "1 hora",
        "Variable",
        "Variable", 
        "2-3 horas",
        "1 hora"
    ],
    "Precio_Estimado": [
        "50€",
        "30€",
        "80-120€",
        "100-500€",
        "150€",
        "40€", 
        "60€",
        "Incluido",
        "Incluido",
        "80€",
        "Incluido"
    ],
    "Proveedor_Sugerido": [
        "Equipo interno/Partners",
        "Mecánico certificado",
        "Detailing profesional",
        "Taller de confianza",
        "Fotógrafo especializado", 
        "Tasador oficial",
        "Equipo marketing",
        "Agentes comerciales",
        "Agentes comerciales",
        "Gestoría asociada",
        "Equipo comercial"
    ]
}

df_concierge = pd.DataFrame(servicio_concierge)
df_concierge.to_csv("servicio_concierge_cochestoday.csv", index=False, encoding='utf-8')

# Calcular costos del servicio
print("=== ANÁLISIS SERVICIO CONCIERGE COCHESTODAY ===")
print("\nServicios incluidos:")
for i, row in df_concierge.iterrows():
    print(f"{i+1:2d}. {row['Servicio']}")
    print(f"    • {row['Descripción']}")
    print(f"    • Tiempo: {row['Tiempo_Estimado']} | Precio: {row['Precio_Estimado']}")
    print(f"    • Proveedor: {row['Proveedor_Sugerido']}")
    print()

# Calcular precios
precios = df_concierge['Precio_Estimado'].str.extract(r'(\d+)').astype(float, errors='ignore')
precio_min = precios[0].min()
precio_max = precios[0].max() 
precio_promedio = precios[0].mean()

print(f"\n=== ESTRUCTURA DE PRECIOS ===")
print(f"Servicio básico (sin reparaciones): 490€")
print(f"Servicio completo (con reparaciones menores): 590-990€")
print(f"Comisión adicional por venta: 3-5% del precio final")

# Crear modelo de negocio
modelo_negocio = {
    "Concepto": [
        "Marketplace Básico",
        "Servicio Concierge Bronze", 
        "Servicio Concierge Silver",
        "Servicio Concierge Gold",
        "Comisión por Venta"
    ],
    "Servicios_Incluidos": [
        "Publicación gratuita, búsqueda, contactos",
        "Recogida + limpieza + fotos + publicación",
        "Bronze + evaluación + reparaciones menores + tasación",
        "Silver + gestión completa + negociación + documentación",
        "Porcentaje sobre precio final de venta"
    ],
    "Precio": [
        "Gratuito",
        "490€",
        "690€", 
        "990€",
        "3-5%"
    ],
    "Tiempo_Venta": [
        "Variable (usuario gestiona)",
        "2-4 semanas",
        "1-3 semanas",
        "1-2 semanas",
        "N/A"
    ]
}

df_modelo = pd.DataFrame(modelo_negocio)
df_modelo.to_csv("modelo_negocio_cochestoday.csv", index=False, encoding='utf-8')

print("\n=== MODELO DE NEGOCIO COCHESTODAY ===")
for i, row in df_modelo.iterrows():
    print(f"\n{row['Concepto']} - {row['Precio']}")
    print(f"└─ Incluye: {row['Servicios_Incluidos']}")
    print(f"└─ Tiempo estimado venta: {row['Tiempo_Venta']}")

print("\nArchivos CSV adicionales creados:")
print("3. servicio_concierge_cochestoday.csv")
print("4. modelo_negocio_cochestoday.csv")