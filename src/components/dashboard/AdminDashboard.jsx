import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Datos de ejemplo para los gráficos
const datosRentas = [
  { name: 'Lun', rentas: 30 },
  { name: 'Mar', rentas: 45 },
  { name: 'Mié', rentas: 35 },
  { name: 'Jue', rentas: 60 },
  { name: 'Vie', rentas: 75 },
  { name: 'Sáb', rentas: 90 },
  { name: 'Dom', rentas: 80 }
];

const datosSuscripciones = [
  { name: 'Ene', activas: 400 },
  { name: 'Feb', activas: 480 },
  { name: 'Mar', activas: 550 },
  { name: 'Abr', activas: 690 },
  { name: 'May', activas: 780 },
  { name: 'Jun', activas: 892 }
];

const datosModelos = [
  { name: 'Lupa', uso: 110 },
  { name: 'Mar', uso: 65 },
  { name: 'Mardelo', uso: 105 },
  { name: 'Abril', uso: 145 },
  { name: 'Nerro', uso: 98 },
  { name: 'Juna', uso: 50 }
];

// Datos para el gráfico de dona de vehículos (115 disponibles / 150 totales)
const datosVehiculos = [
  { name: 'Disponibles', value: 115 },
  { name: 'En uso / Mantenimiento', value: 35 }
];
const COLORES_VEHICULOS = ['#3b82f6', '#e5e7eb'];

const operacionesRecientes = [
  { id: 1, fecha: '27-09-2021', tipo: 'Suscripción', usuario: 'Elena M.', estado: 'Completado', monto: '$230.00' },
  { id: 2, fecha: '27-09-2021', tipo: 'Suscripción', usuario: 'Elena M.', estado: 'Completado', monto: '$100.00' },
  { id: 3, fecha: '16-09-2021', tipo: 'Renta', usuario: 'Elena M.', estado: 'Completado', monto: '$70.00' },
  { id: 4, fecha: '15-09-2021', tipo: 'Registro Vehículo', usuario: 'Elena M.', estado: 'Procesando', monto: '$50.00' },
  { id: 5, fecha: '14-09-2021', tipo: 'Suscripción', usuario: 'Elena M. Luva', estado: 'Completado', monto: '$100.00' },
];

export default function AdminDashboard({ nombre = 'Administrador' }) {
  return (
    <div className="admin-dashboard-container">
      {/* Encabezado */}
      <div className="admin-dashboard-header">
        <h2 className="admin-welcome-title">
          Bienvenido, <span className="admin-welcome-name">{nombre}</span> <span className="admin-subtitle">/ Panel de Control</span>
        </h2>
      </div>

      {/* Grid de 4 tarjetas de estadísticas principales */}
      <div className="admin-stats-grid">
        
        {/* Tarjeta 1: Total Rentas */}
        <div className="admin-stat-card">
          <div className="stat-card-info">
            <span className="stat-card-title">Total Rentas</span>
            <span className="stat-card-value">1,248</span>
            <span className="stat-card-badge positive">Este Mes</span>
          </div>
          <div className="stat-card-chart">
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={datosRentas} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip show={false} />
                <Area type="monotone" dataKey="rentas" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRentas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tarjeta 2: Suscripciones Activas */}
        <div className="admin-stat-card">
          <div className="stat-card-info">
            <span className="stat-card-title">Suscripciones Activas</span>
            <span className="stat-card-value">892</span>
            <span className="stat-card-badge neutral">+12% vs mes anterior</span>
          </div>
          <div className="stat-card-chart">
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={datosSuscripciones} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Tooltip show={false} />
                <Bar dataKey="activas" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tarjeta 3: Vehículos Disponibles */}
        <div className="admin-stat-card donut-card">
          <div className="stat-card-info">
            <span className="stat-card-title">Vehículos Disponibles</span>
            <span className="stat-card-value">115/150</span>
            <span className="stat-card-badge positive">76.6% operativo</span>
          </div>
          <div className="stat-card-chart donut-chart-container">
            <ResponsiveContainer width="100%" height={90}>
              <PieChart>
                <Pie
                  data={datosVehiculos}
                  cx="50%"
                  cy="50%"
                  innerRadius={22}
                  outerRadius={32}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {datosVehiculos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORES_VEHICULOS[index % COLORES_VEHICULOS.length]} />
                  ))}
                </Pie>
                <Tooltip show={false} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tarjeta 4: Usuarios Registrados */}
        <div className="admin-stat-card">
          <div className="stat-card-info">
            <span className="stat-card-title">Usuarios Registrados</span>
            <span className="stat-card-value">3,675</span>
            <span className="stat-card-badge positive">Crecimiento ↑ 37%</span>
          </div>
          <div className="stat-card-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stat-card-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0 1 10.089 20c-2.3 0-4.47-.532-6.4-1.478l-.122-.056A3.75 3.75 0 0 1 4.905 13.5h7.915a4.89 4.89 0 0 1 3.77 1.958ZM15.002 8.492a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 2.25a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
          </div>
        </div>

      </div>

      {/* Sección Inferior: Resumen de Operaciones + Gráfico de Modelos */}
      <div className="admin-bottom-grid">
        
        {/* Tabla: Resumen de Operaciones Recientes */}
        <div className="admin-card table-card">
          <h3 className="card-title">Resumen de Operaciones Recientes</h3>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Usuario</th>
                  <th>Estado</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {operacionesRecientes.map((op) => (
                  <tr key={op.id}>
                    <td>{op.fecha}</td>
                    <td>{op.tipo}</td>
                    <td>{op.usuario}</td>
                    <td>
                      <span className={`status-badge ${op.estado.toLowerCase()}`}>
                        {op.estado}
                      </span>
                    </td>
                    <td>{op.monto}</td>
                    <td>
                      <button className="admin-table-action-btn">Ver</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráfico: Uso de Vehículos por Modelo */}
        <div className="admin-card chart-card">
          <h3 className="card-title">Uso de Vehículos por Modelo</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={datosModelos} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }} />
                <Bar dataKey="uso" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
