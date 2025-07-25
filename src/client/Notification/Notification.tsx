import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";
import { 
  CheckCircle, 
  XCircle, 
  Info, 
  AlertTriangle, 
  X, 
  Loader2 
} from "lucide-react";

type NotificationType = "success" | "error" | "info" | "warning" | "loading";

type Notification = {
  id: number;
  message: string;
  type: NotificationType;
  duration?: number;
  persistent?: boolean;
  progress?: number;
};

type NotificationContextType = {
  notify: (
    message: string, 
    type?: NotificationType, 
    options?: { duration?: number; persistent?: boolean }
  ) => number;
  updateNotification: (id: number, updates: Partial<Notification>) => void;
  removeNotification: (id: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }
  return context;
};

const NotificationIcon = ({ type, className = "" }: { type: NotificationType; className?: string }) => {
  const iconProps = { className: `${className} flex-shrink-0` };
  
  switch (type) {
    case "success":
      return <CheckCircle {...iconProps} />;
    case "error":
      return <XCircle {...iconProps} />;
    case "warning":
      return <AlertTriangle {...iconProps} />;
    case "loading":
      return <Loader2 {...iconProps} className={`${iconProps.className} animate-spin`} />;
    default:
      return <Info {...iconProps} />;
  }
};

const NotificationItem = ({ 
  notification, 
  onRemove 
}: { 
  notification: Notification; 
  onRemove: (id: number) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (notification.persistent || notification.type === "loading") return;

    const duration = notification.duration || 4000;
    const interval = 50;
    const decrement = (interval / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(progressTimer);
          handleRemove();
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, [notification]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const getNotificationStyles = () => {
    const baseStyles = "relative overflow-hidden backdrop-blur-sm border";
    
    switch (notification.type) {
      case "success":
        return `${baseStyles} bg-emerald-500/90 border-emerald-400 text-white shadow-emerald-500/25`;
      case "error":
        return `${baseStyles} bg-red-500/90 border-red-400 text-white shadow-red-500/25`;
      case "warning":
        return `${baseStyles} bg-amber-500/90 border-amber-400 text-white shadow-amber-500/25`;
      case "loading":
        return `${baseStyles} bg-blue-500/90 border-blue-400 text-white shadow-blue-500/25`;
      default:
        return `${baseStyles} bg-slate-800/90 border-slate-600 text-white shadow-slate-500/25`;
    }
  };

  return (
    <div
      className={`
        ${getNotificationStyles()}
        px-4 py-3 rounded-lg shadow-lg
        transform transition-all duration-300 ease-out
        ${isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
        min-w-80 max-w-md
      `}
    >
      {!notification.persistent && notification.type !== "loading" && (
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
          <div 
            className="h-full bg-white/40 transition-all duration-50 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-start gap-3">
        <NotificationIcon 
          type={notification.type} 
          className="w-5 h-5 mt-0.5" 
        />
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-5">
            {notification.message}
          </p>
        </div>

        {(notification.persistent || notification.type === "loading") && (
          <button
            onClick={handleRemove}
            className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((
    message: string, 
    type: NotificationType = "info",
    options: { duration?: number; persistent?: boolean } = {}
  ) => {
    const id = Date.now() + Math.random();
    const newNotification: Notification = { 
      id, 
      message, 
      type,
      duration: options.duration,
      persistent: options.persistent
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const updateNotification = useCallback((id: number, updates: Partial<Notification>) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, ...updates } : n)
    );
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  

  return (
    <NotificationContext.Provider value={{ 
      notify, 
      updateNotification, 
      removeNotification, 
    }}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
        <div className="pointer-events-auto space-y-3">
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRemove={removeNotification}
            />
          ))}
        </div>

      </div>
    </NotificationContext.Provider>
  );
};
export default NotificationProvider;




















// import {
//   createContext,
//   useContext,
//   useState,
//   type ReactNode,
//   useCallback,
//   useEffect,
// } from "react";
// import {
//   CheckCircle,
//   XCircle,
//   Info,
//   AlertTriangle,
//   X,
//   Loader2,
// } from "lucide-react";

// type NotificationType = "success" | "error" | "info" | "warning" | "loading";

// type Notification = {
//   id: number;
//   message: string;
//   type: NotificationType;
//   duration?: number;
//   persistent?: boolean;
//   progress?: number;
// };

// type NotificationContextType = {
//   notify: (
//     message: string,
//     type?: NotificationType,
//     options?: { duration?: number; persistent?: boolean }
//   ) => number;
//   updateNotification: (id: number, updates: Partial<Notification>) => void;
//   removeNotification: (id: number) => void;
// };

// const NotificationContext = createContext<NotificationContextType | undefined>(
//   undefined
// );

// // eslint-disable-next-line react-refresh/only-export-components
// export const useNotification = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error("useNotification must be used inside NotificationProvider");
//   }
//   return context;
// };

// const NotificationIcon = ({
//   type,
//   className = "",
// }: {
//   type: NotificationType;
//   className?: string;
// }) => {
//   const iconProps = { className: `${className} flex-shrink-0` };

//   switch (type) {
//     case "success":
//       return <CheckCircle {...iconProps} />;
//     case "error":
//       return <XCircle {...iconProps} />;
//     case "warning":
//       return <AlertTriangle {...iconProps} />;
//     case "loading":
//       return (
//         <Loader2 {...iconProps} className={`${iconProps.className} animate-spin`} />
//       );
//     default:
//       return <Info {...iconProps} />;
//   }
// };

// const NotificationItem = ({
//   notification,
//   onRemove,
// }: {
//   notification: Notification;
//   onRemove: (id: number) => void;
// }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [progress, setProgress] = useState(100);

//   useEffect(() => {
//     const timer = setTimeout(() => setIsVisible(true), 10);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (notification.persistent || notification.type === "loading") return;

//     const duration = notification.duration || 4000;
//     const interval = 50;
//     const decrement = (interval / duration) * 100;

//     const progressTimer = setInterval(() => {
//       setProgress((prev) => {
//         if (prev <= 0) {
//           clearInterval(progressTimer);
//           handleRemove();
//           return 0;
//         }
//         return prev - decrement;
//       });
//     }, interval);

//     return () => clearInterval(progressTimer);
//   }, [notification]);

//   const handleRemove = () => {
//     setIsVisible(false);
//     setTimeout(() => onRemove(notification.id), 300);
//   };

//   const getNotificationStyles = () => {
//     const baseStyles = "relative overflow-hidden backdrop-blur-sm border";

//     switch (notification.type) {
//       case "success":
//         return `${baseStyles} bg-emerald-500/90 border-emerald-400 text-white shadow-emerald-500/25`;
//       case "error":
//         return `${baseStyles} bg-red-500/90 border-red-400 text-white shadow-red-500/25`;
//       case "warning":
//         return `${baseStyles} bg-amber-500/90 border-amber-400 text-white shadow-amber-500/25`;
//       case "loading":
//         return `${baseStyles} bg-blue-500/90 border-blue-400 text-white shadow-blue-500/25`;
//       default:
//         return `${baseStyles} bg-slate-800/90 border-slate-600 text-white shadow-slate-500/25`;
//     }
//   };

//   return (
//     <div
//       className={`
//         ${getNotificationStyles()}
//         px-4 py-3 rounded-lg shadow-lg
//         transform transition-all duration-300 ease-out
//         ${isVisible ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"}
//         min-w-80 max-w-md
//       `}
//     >
//       {!notification.persistent && notification.type !== "loading" && (
//         <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
//           <div
//             className="h-full bg-white/40 transition-all duration-50 ease-linear"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//       )}

//       <div className="flex items-start gap-3">
//         <NotificationIcon type={notification.type} className="w-5 h-5 mt-0.5" />

//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-medium leading-5">{notification.message}</p>
//         </div>

//         {(notification.persistent || notification.type === "loading") && (
//           <button
//             onClick={handleRemove}
//             className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
//             aria-label="Close notification"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export const NotificationProvider = ({ children }: { children: ReactNode }) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);

//   const notify = useCallback(
//     (
//       message: string,
//       type: NotificationType = "info",
//       options: { duration?: number; persistent?: boolean } = {}
//     ) => {
//       const id = Date.now() + Math.random();
//       const newNotification: Notification = {
//         id,
//         message,
//         type,
//         duration: options.duration,
//         persistent: options.persistent,
//       };

//       setNotifications((prev) => [...prev, newNotification]);
//       return id;
//     },
//     []
//   );

//   const updateNotification = useCallback((id: number, updates: Partial<Notification>) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
//     );
//   }, []);

//   const removeNotification = useCallback((id: number) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//   }, []);

//   return (
//     <NotificationContext.Provider value={{ notify, updateNotification, removeNotification }}>
//       {children}

//       {/* Notification Container */}
//       <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
//         <div className="pointer-events-auto space-y-3">
//           {notifications.map((notification) => (
//             <NotificationItem
//               key={notification.id}
//               notification={notification}
//               onRemove={removeNotification}
//             />
//           ))}
//         </div>
//       </div>
//     </NotificationContext.Provider>
//   );
// };

// export default NotificationProvider;
