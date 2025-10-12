import plotly.graph_objects as go
import plotly.express as px
import numpy as np

# Since mermaid.ink is not accessible, I'll create an architecture diagram using Plotly
# This will be a network-style diagram showing the components and their connections

# Define the components and their positions
components = {
    # Frontend Layer (top)
    'React.js UI': (1, 4, '#B3E5EC'),
    'Dashboard': (2, 4, '#B3E5EC'), 
    'Components': (3, 4, '#B3E5EC'),
    
    # Backend Layer (middle-top)
    'PostgreSQL': (0.5, 3, '#FFCDD2'),
    'JWT Auth': (1.5, 3, '#FFCDD2'),
    'Storage': (2.5, 3, '#FFCDD2'),
    'Realtime': (3.5, 3, '#FFCDD2'),
    
    # Automation Layer (middle)
    'n8n Workflows': (1, 2, '#A5D6A7'),
    'Integrations': (2, 2, '#A5D6A7'),
    'Notifications': (3, 2, '#A5D6A7'),
    
    # External Services (middle-bottom)
    'Google Maps': (0.5, 1, '#FFEB8A'),
    'Stripe': (1.5, 1, '#FFEB8A'),
    'Email Service': (2.5, 1, '#FFEB8A'),
    
    # Hosting (bottom)
    'Hostinger VPS': (1.5, 0, '#9FA8B0'),
    'Coolify': (2.5, 0, '#9FA8B0')
}

# Define connections between components
connections = [
    # Frontend internal
    ('React.js UI', 'Dashboard'),
    ('React.js UI', 'Components'),
    ('Dashboard', 'Components'),
    
    # Frontend to Backend
    ('React.js UI', 'JWT Auth'),
    ('Dashboard', 'PostgreSQL'),
    ('React.js UI', 'Storage'),
    ('Dashboard', 'Realtime'),
    
    # Backend internal
    ('JWT Auth', 'PostgreSQL'),
    ('Storage', 'PostgreSQL'),
    ('Realtime', 'PostgreSQL'),
    
    # Backend to Automation
    ('PostgreSQL', 'n8n Workflows'),
    ('Realtime', 'Notifications'),
    ('JWT Auth', 'Integrations'),
    
    # Automation internal
    ('n8n Workflows', 'Integrations'),
    ('n8n Workflows', 'Notifications'),
    
    # External connections
    ('React.js UI', 'Google Maps'),
    ('Dashboard', 'Stripe'),
    ('Notifications', 'Email Service'),
    ('Integrations', 'Google Maps'),
    ('Integrations', 'Stripe'),
    ('Integrations', 'Email Service'),
    
    # Hosting connections
    ('React.js UI', 'Hostinger VPS'),
    ('PostgreSQL', 'Hostinger VPS'),
    ('n8n Workflows', 'Hostinger VPS'),
    ('Hostinger VPS', 'Coolify')
]

# Create the figure
fig = go.Figure()

# Add connections as lines
for start, end in connections:
    x_start, y_start, _ = components[start]
    x_end, y_end, _ = components[end]
    
    # Determine line style based on connection type
    if 'VPS' in start or 'VPS' in end:
        line_style = dict(color='gray', width=1, dash='dot')
    else:
        line_style = dict(color='gray', width=2)
    
    fig.add_trace(go.Scatter(
        x=[x_start, x_end],
        y=[y_start, y_end],
        mode='lines',
        line=line_style,
        hoverinfo='skip',
        showlegend=False
    ))

# Add component nodes
for name, (x, y, color) in components.items():
    fig.add_trace(go.Scatter(
        x=[x],
        y=[y],
        mode='markers+text',
        marker=dict(
            size=40,
            color=color,
            line=dict(width=2, color='white')
        ),
        text=name,
        textposition='middle center',
        textfont=dict(size=10, color='black'),
        hovertemplate=f'<b>{name}</b><extra></extra>',
        showlegend=False
    ))

# Add layer labels
layer_labels = [
    ('Frontend Layer', 2, 4.3, '#1FB8CD'),
    ('Backend Layer', 2, 3.3, '#DB4545'),
    ('Automation Layer', 2, 2.3, '#2E8B57'),
    ('External Services', 1.5, 1.3, '#D2BA4C'),
    ('Hosting Layer', 2, 0.3, '#5D878F')
]

for label, x, y, color in layer_labels:
    fig.add_annotation(
        x=x, y=y,
        text=f"<b>{label}</b>",
        showarrow=False,
        font=dict(size=14, color=color),
        bgcolor='rgba(255,255,255,0.8)',
        bordercolor=color,
        borderwidth=1
    )

# Update layout
fig.update_layout(
    title='Cochestoday.com Architecture',
    xaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[-0.5, 4]
    ),
    yaxis=dict(
        showgrid=False,
        showticklabels=False,
        zeroline=False,
        range=[-0.5, 4.5]
    ),
    plot_bgcolor='white',
    showlegend=False
)

# Save the chart
fig.write_image('architecture_flowchart.png')
fig.write_image('architecture_flowchart.svg', format='svg')

print("Architecture diagram created successfully using Plotly!")