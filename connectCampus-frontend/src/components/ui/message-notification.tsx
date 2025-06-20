// "use client"

// import { useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { useAppSelector } from "@/hooks/useRedux"
// import { useToast } from "@/hooks/use-toast"

// export function MessageNotification() {
//   const { conversations } = useAppSelector((state) => state.messages)
//   const navigate = useNavigate()
//   const { toast } = useToast()

//   useEffect(() => {
//     // Check for unread messages
//     const unreadConversations = conversations.filter((conv) => conv.unreadCount > 0)

//     // Show notification for new unread messages
//     unreadConversations.forEach((conv) => {
//       toast({
//         title: `New message from ${conv.participants[0].name}`,
//         description: conv.lastMessage.content,
//         action: (
//           <button
//             onClick={() => navigate(`/messages?conversation=${conv.id}`)}
//             className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-medium"
//           >
//             View
//           </button>
//         ),
//       })
//     })
//   }, [conversations, navigate, toast])

//   return null
// }
