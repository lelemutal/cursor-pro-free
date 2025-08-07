# AnimatedActionTable Component

Un componente React moderno y reutilizable que agrega microanimaciones y efectos visuales atractivos a una tabla de acciones.

## 🎨 Características

- ✨ **Microanimaciones suaves** con Framer Motion
- 🎯 **Efectos hover** con escala y rotación
- 🎨 **Diseño moderno** con gradientes y sombras
- 📱 **Responsive** y accesible
- 🔄 **Animaciones de entrada** escalonadas
- 🎪 **Iconos animados** y badges de estado
- 🎭 **Transiciones fluidas** entre estados

## 🚀 Instalación

Asegúrate de tener las dependencias necesarias:

```bash
npm install framer-motion lucide-react
```

## 📖 Uso Básico

```tsx
import AnimatedActionTable from './components/AnimatedActionTable';

const actions = [
  {
    id: '1',
    name: 'Procesar archivos',
    status: 'completed',
    priority: 'high',
    createdAt: '2024-01-15T10:30:00Z',
    description: 'Procesamiento completado'
  }
];

function MyComponent() {
  const handleEdit = (id: string) => {
    console.log('Editar:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Eliminar:', id);
  };

  return (
    <AnimatedActionTable
      actions={actions}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
```

## 🎯 Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `actions` | `ActionItem[]` | ✅ | Array de acciones a mostrar |
| `onEdit` | `(id: string) => void` | ❌ | Callback para editar |
| `onDelete` | `(id: string) => void` | ❌ | Callback para eliminar |
| `onView` | `(id: string) => void` | ❌ | Callback para ver |
| `onDownload` | `(id: string) => void` | ❌ | Callback para descargar |

## 📊 Tipos

```tsx
interface ActionItem {
  id: string;
  name: string;
  status: 'pending' | 'completed' | 'error';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  description?: string;
}
```

## 🎨 Personalización

El componente usa Tailwind CSS para los estilos. Puedes personalizar:

- **Colores**: Modifica las clases de color en las funciones `getStatusColor` y `getPriorityColor`
- **Animaciones**: Ajusta los valores en las props `transition` y `whileHover`
- **Espaciado**: Cambia las clases de padding y margin
- **Sombras**: Modifica las clases `shadow-*`

## 🔧 Integración

1. **Copia el componente** `AnimatedActionTable.tsx` a tu proyecto
2. **Instala las dependencias** si no las tienes
3. **Importa y usa** el componente con tus datos
4. **Personaliza** los estilos según tu diseño

## 🎪 Ejemplos de Animaciones

- **Entrada**: Las filas aparecen con un efecto de deslizamiento
- **Hover**: Las filas se escalan ligeramente al pasar el mouse
- **Botones**: Los iconos rotan y se escalan al hacer hover
- **Badges**: Los estados aparecen con un efecto de escala
- **Avatares**: Los círculos rotan 360° al hacer hover

## 🎯 Casos de Uso

- Tablas de tareas o acciones
- Listas de procesos
- Dashboards administrativos
- Interfaces de gestión
- Cualquier tabla que necesite mejorar la UX

## 🔄 Actualizaciones

Para agregar nuevas funcionalidades:

1. **Nuevos estados**: Agrega casos en `getStatusIcon` y `getStatusColor`
2. **Nuevas prioridades**: Extiende `getPriorityColor`
3. **Nuevas acciones**: Agrega botones en la columna de acciones
4. **Nuevas animaciones**: Modifica las props de `motion.div`

## 📝 Notas

- El componente es completamente TypeScript
- Usa `framer-motion` para las animaciones
- Compatible con React 18+
- Optimizado para rendimiento
- Accesible con ARIA labels