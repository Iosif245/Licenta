// "use client"
// import { useAppSelector, useAppDispatch } from "@/hooks/useRedux"
// import { removeNotification } from "@/store/actions/uiActions"
// import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react"
// import { cn } from "@/lib/utils"

// export function Notifications() {
//   const dispatch = useAppDispatch()
//   const { notifications } = useAppSelector((state) => state.ui)

//   const getIcon = (type: string) => {
//     switch (type) {
//       case "success":
//         return <CheckCircle className="h-4 w-4" />
//       case "error":
//         return <XCircle className="h-4 w-4" />
//       case "warning":
//         return <AlertCircle className="h-4 w-4" />
//       case "info":
//       default:
//         return <Info className="h-4 w-4" />
//     }
//   }

//   const getColor = (type: string) => {
//     switch (type) {
//       case "success":
//         return "bg-green-100 text-green-800 border-green-200"
//       case "error":
//         return "bg-red-100 text-red-800 border-red-200"
//       case "warning":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200"
//       case "info":
//       default:
//         return "bg-blue-100 text-blue-800 border-blue-200"
//     }
//   }

//   return (
//     <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
//       {notifications.map((notification) => (
//         <div
//           key={notification.id}
//           className={cn("flex items-center gap-2 rounded-md border px-4 py-3 shadow-sm", getColor(notification.type))}
//         >
//           {getIcon(notification.type)}
//           <p className="text-sm">{notification.message}</p>
//           <button
//             className="ml-auto rounded-full p-1 hover:bg-black/10"
//             onClick={() => dispatch(removeNotification(notification.id))}
//           >
//             <X className="h-3 w-3" />
//             <span className="sr-only">Close</span>
//           </button>
//         </div>
//       ))}
//     </div>
//   )
// }
