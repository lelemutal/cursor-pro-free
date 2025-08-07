'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedActionTable from './AnimatedActionTable';

// Datos de ejemplo para la tabla
const sampleActions = [
  {
    id: '1',
    name: 'Procesar archivos',
    status: 'completed' as const,
    priority: 'high' as const,
    createdAt: '2024-01-15T10:30:00Z',
    description: 'Procesamiento de archivos PDF completado'
  },
  {
    id: '2',
    name: 'Generar reporte',
    status: 'pending' as const,
    priority: 'medium' as const,
    createdAt: '2024-01-15T11:00:00Z',
    description: 'Generando reporte mensual de ventas'
  },
  {
    id: '3',
    name: 'Backup de datos',
    status: 'error' as const,
    priority: 'high' as const,
    createdAt: '2024-01-15T09:15:00Z',
    description: 'Error en el proceso de backup'
  },
  {
    id: '4',
    name: 'Actualizar sistema',
    status: 'completed' as const,
    priority: 'low' as const,
    createdAt: '2024-01-14T16:45:00Z',
    description: 'Actualización del sistema completada'
  },
  {
    id: '5',
    name: 'Sincronizar datos',
    status: 'pending' as const,
    priority: 'medium' as const,
    createdAt: '2024-01-15T12:30:00Z',
    description: 'Sincronizando datos con servidor remoto'
  }
];

const AnimatedActionTableExample: React.FC = () => {
  const [actions, setActions] = useState(sampleActions);

  const handleEdit = (id: string) => {
    console.log('Editar acción:', id);
    // Aquí puedes agregar tu lógica de edición
  };

  const handleDelete = (id: string) => {
    console.log('Eliminar acción:', id);
    setActions(actions.filter(action => action.id !== id));
  };

  const handleView = (id: string) => {
    console.log('Ver acción:', id);
    // Aquí puedes agregar tu lógica de visualización
  };

  const handleDownload = (id: string) => {
    console.log('Descargar acción:', id);
    // Aquí puedes agregar tu lógica de descarga
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tabla de Acciones Animada
          </h1>
          <p className="text-gray-600">
            Ejemplo de tabla con microanimaciones y efectos visuales
          </p>
        </motion.div>

        <AnimatedActionTable
          actions={actions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          onDownload={handleDownload}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-white rounded-lg shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Características del Componente
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Animaciones suaves al cargar y al interactuar
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Efectos hover con escala y rotación
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Iconos animados y badges de estado
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
              Transiciones fluidas entre estados
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Diseño responsive y moderno
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedActionTableExample;