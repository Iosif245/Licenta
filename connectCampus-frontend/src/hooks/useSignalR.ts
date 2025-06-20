// import { useEffect } from 'react';
// import { signalRService } from '@app/services/signalr';
// import { useAppDispatch } from '@app/store/hooks';
// import { addNotificationAction } from '@app/store/actions/notifications/notifications-actions';
// import { addMessageAction } from '@app/store/actions/chat/chat-actions';

// export const useSignalR = () => {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     const startConnection = async () => {
//       await signalRService.startConnection();
//     };

//     startConnection();

//     const handleNotification = (notification: any) => {
//       dispatch(addNotificationAction(notification));
//     };

//     const handleNewMessage = (message: any) => {
//       dispatch(addMessageAction(message));
//     };

//     signalRService.onReceiveNotification(handleNotification);
//     signalRService.onReceiveNewMessage(handleNewMessage);

//     return () => {
//       signalRService.removeReceiveNotification(handleNotification);
//       signalRService.removeReceiveNewMessage(handleNewMessage);
//       signalRService.stopConnection();
//     };
//   }, [dispatch]);
// };
