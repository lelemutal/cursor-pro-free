'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface ActionItem {
  id: string;
  name: string;
  status: 'pending' | 'completed' | 'error';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  description?: string;
}

interface AnimatedActionTableProps {
  actions: ActionItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
}

const AnimatedActionTable: React.FC<AnimatedActionTableProps> = ({
  actions,
  onEdit,
  onDelete,
  onView,
  onDownload
}) => {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getStatusIcon = (status: ActionItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: ActionItem['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-lg bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto"
      >
        <table className="w-full">
          <thead>
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200"
            >
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acción
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridad
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </motion.tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {actions.map((action, index) => (
                <motion.tr
                  key={action.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: "#f8fafc"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setHoveredRow(action.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`transition-all duration-200 cursor-pointer ${
                    selectedRow === action.id ? 'bg-blue-50 ring-2 ring-blue-200' : ''
                  }`}
                  onClick={() => setSelectedRow(action.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="flex items-center"
                    >
                      <div className="flex-shrink-0 h-10 w-10">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold"
                        >
                          {action.name.charAt(0).toUpperCase()}
                        </motion.div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {action.name}
                        </div>
                        {action.description && (
                          <div className="text-sm text-gray-500">
                            {action.description}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(action.status)}`}
                    >
                      {getStatusIcon(action.status)}
                      <span className="ml-1 capitalize">{action.status}</span>
                    </motion.div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(action.priority)}`}
                    >
                      {action.priority}
                    </motion.div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      {new Date(action.createdAt).toLocaleDateString()}
                    </motion.div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      className="flex items-center space-x-2"
                    >
                      {onView && (
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(action.id);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      )}
                      {onEdit && (
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(action.id);
                          }}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      )}
                      {onDownload && (
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownload(action.id);
                          }}
                          className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-full transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      )}
                      {onDelete && (
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(action.id);
                          }}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </motion.div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default AnimatedActionTable;