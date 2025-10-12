import plotly.graph_objects as go
import pandas as pd

# Parse the provided data
data = {
    "fases": [
        {"fase": "1. Análisis y Planificación", "duracion": "2 semanas", "actividades": "Análisis competencia, definición requisitos, arquitectura técnica"},
        {"fase": "2. Diseño UX/UI", "duracion": "3 semanas", "actividades": "Wireframes, prototipos, diseño visual, flujos de usuario"},
        {"fase": "3. MVP - Backend", "duracion": "4 semanas", "actividades": "API REST, autenticación, base de datos, integración Supabase"},
        {"fase": "4. MVP - Frontend", "duracion": "3 semanas", "actividades": "Interfaz React, componentes reutilizables, responsive design"},
        {"fase": "5. Integración y Pruebas", "duracion": "2 semanas", "actividades": "Testing, corrección bugs, optimización rendimiento"},
        {"fase": "6. Servicio Concierge", "duracion": "3 semanas", "actividades": "Sistema recogida, workflow procesos, integración n8n"},
        {"fase": "7. Despliegue y Marketing", "duracion": "2 semanas", "actividades": "Configuración hosting, dominio, SSL, estrategia lanzamiento"},
        {"fase": "8. Iteración y Mejoras", "duracion": "Continuo", "actividades": "Feedback usuarios, nuevas funcionalidades, escalabilidad"}
    ]
}

# Process data to create timeline
phases = []
start_week = 0
colors = ['#1FB8CD', '#DB4545', '#2E8B57', '#5D878F', '#D2BA4C', '#B4413C', '#964325', '#944454']

# Create Spanish phase names with numbers, keeping under 15 chars
phase_names = [
    "1.Análisis",
    "2.Diseño UX/UI", 
    "3.Backend MVP",
    "4.Frontend MVP",
    "5.Testing",
    "6.Concierge",
    "7.Deploy",
    "8.Mejoras"
]

for i, fase_data in enumerate(data['fases']):
    duracion = fase_data['duracion']
    actividades = fase_data['actividades']
    
    # Extract duration in weeks
    if 'Continuo' in duracion:
        duration_weeks = 6  # Show as ongoing from week 19 onwards
        duracion_display = "Continuo"
        is_ongoing = True
    else:
        duration_weeks = int(duracion.split()[0])
        duracion_display = f"{duration_weeks} sem"
        is_ongoing = False
    
    end_week = start_week + duration_weeks
    
    phases.append({
        'Phase': phase_names[i],
        'Start': start_week,
        'End': end_week,
        'Duration': duracion_display,
        'Activities': actividades,
        'Color': colors[i % len(colors)],
        'Original': fase_data['fase'],
        'IsOngoing': is_ongoing
    })
    
    if not is_ongoing:
        start_week = end_week

# Create the Gantt chart
fig = go.Figure()

# Add main phase bars
for i, phase in enumerate(phases):
    if phase['IsOngoing']:
        # For ongoing phase, show it extending beyond the timeline
        x_vals = [phase['Start'], 25]  # Extend to week 25
        line_style = dict(color=phase['Color'], width=18, dash='dot')
        hover_text = (f"<b>{phase['Original']}</b><br>"
                     f"Duración: {phase['Duration']}<br>"
                     f"Inicio: Semana {phase['Start']}<br>"
                     f"<b>Actividades:</b><br>{phase['Activities']}<br>"
                     f"<i>Hito:</i> Feedback continuo<extra></extra>")
    else:
        x_vals = [phase['Start'], phase['End']]
        line_style = dict(color=phase['Color'], width=18)
        # Add milestone info for key phases
        milestones = {
            0: "Arquitectura definida",
            1: "Diseño aprobado", 
            2: "API funcional",
            3: "MVP completado",
            4: "Testing finalizado",
            5: "Servicio activo",
            6: "Sitio lanzado"
        }
        milestone = milestones.get(i, "Fase completada")
        
        hover_text = (f"<b>{phase['Original']}</b><br>"
                     f"Duración: {phase['Duration']}<br>"
                     f"Semanas: {phase['Start']}-{phase['End']}<br>"
                     f"<b>Actividades:</b><br>{phase['Activities']}<br>"
                     f"<i>Hito:</i> {milestone}<extra></extra>")
    
    fig.add_trace(go.Scatter(
        x=x_vals,
        y=[i, i],
        mode='lines+markers',
        line=line_style,
        marker=dict(size=10, color=phase['Color']),
        name=phase['Phase'],
        hovertemplate=hover_text,
        showlegend=True
    ))

# Add milestone diamonds for key phases
key_milestones = [1, 3, 4, 6]  # Design, MVP, Testing, Launch
for phase_idx in key_milestones:
    if phase_idx < len(phases):
        phase = phases[phase_idx]
        fig.add_trace(go.Scatter(
            x=[phase['End']],
            y=[phase_idx],
            mode='markers',
            marker=dict(
                size=14, 
                color='gold',
                symbol='diamond',
                line=dict(color=phase['Color'], width=2)
            ),
            name='Hito Clave',
            showlegend=False,
            hovertemplate=f"<b>Hito Clave</b><br>{phase['Original']}<br>Completado: Semana {phase['End']}<extra></extra>"
        ))

# Update layout
fig.update_layout(
    title="Mapa Desarrollo cochestoday.com",
    xaxis_title="Semana Proyecto",
    yaxis_title="Fase Desarrollo",
    yaxis=dict(
        tickmode='array',
        tickvals=list(range(len(phases))),
        ticktext=[phase['Phase'] for phase in phases],
        tickfont=dict(size=11)
    ),
    xaxis=dict(
        showgrid=True,
        gridcolor='lightgray',
        tickmode='linear',
        dtick=2,
        range=[-1, 26]
    ),
    legend=dict(
        orientation='v',
        yanchor='top',
        y=0.98,
        xanchor='left',
        x=1.02,
        font=dict(size=10)
    ),
    hovermode='closest'
)

# Update y-axis to reverse order and add spacing
fig.update_yaxes(autorange='reversed')
fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor='lightgray')

# Save as PNG and SVG
fig.write_image("cochestoday_roadmap.png")
fig.write_image("cochestoday_roadmap.svg", format="svg")

fig.show()