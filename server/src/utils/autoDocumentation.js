export function setupSimpleDocumentation(app) {
  // Lista manual de todas tus rutas (fácil de mantener)
  const allRoutes = [
    // 🔐 Auth Routes
    { method: 'POST', path: '/api/auth/login', description: 'Iniciar sesión' },
    { method: 'POST', path: '/api/auth/register', description: 'Registrar usuario' },
    { method: 'POST', path: '/api/auth/refresh-token', description: 'Refrescar token' },
    { method: 'POST', path: '/api/auth/logout', description: 'Cerrar sesión' },

    // 👨‍💼 Admin Routes
    { method: 'GET', path: '/api/admin/users', description: 'Obtener todos los usuarios' },
    { method: 'GET', path: '/api/admin/users/:id', description: 'Obtener usuario por ID' },
    { method: 'PUT', path: '/api/admin/users/:id', description: 'Actualizar usuario' },
    { method: 'DELETE', path: '/api/admin/users/:id', description: 'Eliminar usuario' },

    // 🍋 Lotes Routes
    { method: 'GET', path: '/api/lotes', description: 'Obtener todos los lotes' },
    { method: 'GET', path: '/api/lotes/:id', description: 'Obtener lote por ID' },
    { method: 'POST', path: '/api/lotes', description: 'Crear nuevo lote' },
    { method: 'PUT', path: '/api/lotes/:id', description: 'Actualizar lote' },
    { method: 'DELETE', path: '/api/lotes/:id', description: 'Eliminar lote' },

    // 📑 Contratos Routes
    { method: 'GET', path: '/api/contratos', description: 'Obtener todos los contratos' },
    { method: 'GET', path: '/api/contratos/:id', description: 'Obtener contrato por ID' },
    { method: 'POST', path: '/api/contratos', description: 'Crear nuevo contrato' },
    { method: 'PUT', path: '/api/contratos/:id', description: 'Actualizar contrato' },

    // 🔍 Análisis Routes
    { method: 'GET', path: '/api/analisis-contratos', description: 'Obtener análisis' },
    { method: 'GET', path: '/api/analisis-contratos/:id', description: 'Obtener análisis por ID' },
    { method: 'POST', path: '/api/analisis-contratos', description: 'Crear análisis' },

    // ⛓️ Blockchain Routes
    { method: 'GET', path: '/api/blockchain', description: 'Obtener datos blockchain' },
    { method: 'POST', path: '/api/blockchain/register', description: 'Registrar en blockchain' },
    { method: 'GET', path: '/api/blockchain/verify/:hash', description: 'Verificar transacción' },

    // 🚚 Transporte Routes
    { method: 'GET', path: '/api/transporte', description: 'Obtener transportes' },
    { method: 'POST', path: '/api/transporte', description: 'Crear transporte' },
    { method: 'PUT', path: '/api/transporte/:id', description: 'Actualizar transporte' },

    // 🔔 Notificaciones Routes
    { method: 'GET', path: '/api/notificaciones', description: 'Obtener notificaciones' },
    { method: 'POST', path: '/api/notificaciones', description: 'Crear notificación' },
    { method: 'PUT', path: '/api/notificaciones/:id/read', description: 'Marcar como leída' },

    // ⚙️ System Routes
    { method: 'GET', path: '/health', description: 'Health check del servidor' },
    { method: 'GET', path: '/api/docs', description: 'Documentación HTML' },
    { method: 'GET', path: '/api/docs/json', description: 'Documentación JSON' }
  ];

  // Endpoint JSON para frontend
  app.get('/api/docs/json', (req, res) => {
    const documentation = {
      title: "🍋 LimonChain API - Documentación",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`,
      totalEndpoints: allRoutes.length,
      endpoints: {
        auth: allRoutes.filter(r => r.path.includes('/api/auth')),
        admin: allRoutes.filter(r => r.path.includes('/api/admin')),
        lotes: allRoutes.filter(r => r.path.includes('/api/lotes')),
        contratos: allRoutes.filter(r => r.path.includes('/api/contratos')),
        analisis: allRoutes.filter(r => r.path.includes('/api/analisis-contratos')),
        blockchain: allRoutes.filter(r => r.path.includes('/api/blockchain')),
        transporte: allRoutes.filter(r => r.path.includes('/api/transporte')),
        notificaciones: allRoutes.filter(r => r.path.includes('/api/notificaciones')),
        system: allRoutes.filter(r => 
          r.path === '/health' || 
          r.path.includes('/api/docs')
        )
      }
    };
    
    res.json(documentation);
  });

  // Endpoint HTML visual
  app.get('/api/docs', (req, res) => {
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>🍋 LimonChain API Docs</title>
        <meta charset="UTF-8">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            .container { 
                max-width: 1200px; 
                margin: 0 auto; 
                background: white;
                border-radius: 15px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 3px solid #f0f0f0;
            }
            .header h1 {
                color: #2c3e50;
                font-size: 3em;
                margin-bottom: 10px;
            }
            .header p {
                color: #7f8c8d;
                font-size: 1.2em;
            }
            .stats {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
                text-align: center;
                border-left: 4px solid #3498db;
            }
            .links {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin: 30px 0;
                flex-wrap: wrap;
            }
            .links a {
                padding: 12px 25px;
                background: #3498db;
                color: white;
                text-decoration: none;
                border-radius: 25px;
                transition: all 0.3s;
                font-weight: 500;
            }
            .links a:hover {
                background: #2980b9;
                transform: translateY(-2px);
            }
            .section {
                margin: 50px 0;
            }
            .section-title {
                color: #2c3e50;
                font-size: 1.8em;
                margin-bottom: 25px;
                padding-bottom: 10px;
                border-bottom: 2px solid #3498db;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .endpoint-grid {
                display: grid;
                gap: 15px;
            }
            .endpoint {
                background: white;
                padding: 20px;
                border-radius: 10px;
                border: 1px solid #e1e8ed;
                display: flex;
                align-items: center;
                gap: 15px;
                transition: all 0.3s;
            }
            .endpoint:hover {
                border-color: #3498db;
                box-shadow: 0 5px 15px rgba(52, 152, 219, 0.1);
                transform: translateX(5px);
            }
            .method {
                padding: 8px 16px;
                border-radius: 6px;
                color: white;
                font-weight: bold;
                font-size: 0.9em;
                min-width: 80px;
                text-align: center;
            }
            .get { background: #27ae60; }
            .post { background: #3498db; }
            .put { background: #f39c12; }
            .delete { background: #e74c3c; }
            .path {
                font-family: 'Courier New', monospace;
                font-size: 1.1em;
                color: #2c3e50;
                font-weight: 500;
                flex: 1;
            }
            .description {
                color: #7f8c8d;
                font-style: italic;
            }
            @media (max-width: 768px) {
                .container { padding: 20px; }
                .endpoint { flex-direction: column; align-items: flex-start; }
                .links { flex-direction: column; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🍋 LimonChain</h1>
                <p>Documentación de la API - Backend Services</p>
            </div>
            
            <div class="stats">
                <h3>📊 Resumen del Sistema</h3>
                <p><strong>${allRoutes.length} endpoints disponibles</strong> | Servidor: ${process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`}</p>
            </div>

            <div class="links">
                <a href="/api/docs/json" target="_blank">📋 JSON Completo</a>
                <a href="/health" target="_blank">❤️ Health Check</a>
                <a href="/api/docs">🔄 Actualizar</a>
            </div>
    `;

    // Agrupar rutas por módulo
    const modules = {
        '🔐 Authentication': allRoutes.filter(r => r.path.includes('/api/auth')),
        '👨‍💼 Administración': allRoutes.filter(r => r.path.includes('/api/admin')),
        '🍋 Gestión de Lotes': allRoutes.filter(r => r.path.includes('/api/lotes')),
        '📑 Contratos': allRoutes.filter(r => r.path.includes('/api/contratos')),
        '🔍 Análisis': allRoutes.filter(r => r.path.includes('/api/analisis-contratos')),
        '⛓️ Blockchain': allRoutes.filter(r => r.path.includes('/api/blockchain')),
        '🚚 Transporte': allRoutes.filter(r => r.path.includes('/api/transporte')),
        '🔔 Notificaciones': allRoutes.filter(r => r.path.includes('/api/notificaciones')),
        '⚙️ Sistema': allRoutes.filter(r => r.path === '/health' || r.path.includes('/api/docs'))
    };

    // Generar HTML para cada módulo
    Object.entries(modules).forEach(([moduleName, moduleRoutes]) => {
        if (moduleRoutes.length > 0) {
            html += `
            <div class="section">
                <h2 class="section-title">${moduleName}</h2>
                <div class="endpoint-grid">
            `;
            
            moduleRoutes.forEach(route => {
                html += `
                <div class="endpoint">
                    <span class="method ${route.method.toLowerCase()}">${route.method}</span>
                    <span class="path">${route.path}</span>
                    <span class="description">${route.description}</span>
                </div>
                `;
            });
            
            html += `
                </div>
            </div>
            `;
        }
    });

    html += `
        </div>
    </body>
    </html>
    `;
    
    res.send(html);
  });

  console.log('✅ Documentación simple configurada:');
  console.log('   📄 Interfaz: /api/docs');
  console.log('   🔗 JSON API: /api/docs/json');
}