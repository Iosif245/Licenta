import { getApi } from '@app/api';
import { IChatGroup, IChatMessage, IMessageRequest, IChatRequest } from '@app/types/chat';

export const getChatGroupsRequest = async (): Promise<{ items: IChatGroup[] }> => {
  const api = getApi();
  const response = await api.get('/api/chat/groups');
  return response.data;
};

export const createOrGetChatGroupRequest = async (request: IChatRequest): Promise<IChatGroup> => {
  const api = getApi();
  const response = await api.post('/api/chat/groups', request);
  return response.data;
};

export const getChatMessagesRequest = async (chatGroupId: string, pageNumber = 1, pageSize = 20): Promise<{ items: IChatMessage[] }> => {
  const api = getApi();
  const response = await api.get(`/api/chat/groups/${chatGroupId}/messages`, {
    params: { pageNumber, pageSize }
  });
  return response.data;
};

export const sendMessageRequest = async (chatGroupId: string, message: string): Promise<IChatMessage> => {
  const api = getApi();
  const response = await api.post(`/api/chat/groups/${chatGroupId}/messages`, {
    message
  } as IMessageRequest);
  return response.data;
};

export const markMessagesAsReadRequest = async (chatGroupId: string): Promise<void> => {
  const api = getApi();
  await api.patch(`/api/chat/groups/${chatGroupId}/mark-read`);
}; 