/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Package, Calendar, ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/Components/Ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/Components/Ui/tabs';
import { Button } from '@/app/Components/Ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

// Color palette matching AnalyticsPage.tsx
const COLORS = {
  primary: '#FFC107', // Yellow
  secondary: '#FFD54F', // Light yellow
  accent1: '#FF9800', // Orange-yellow
  accent2: '#FF5722', // Coral
  accent3: '#8C52FF', // Purple
  accent4: '#5CE1E6', // Teal
  grey1: '#F9FAFB',
  grey2: '#F3F4F6',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
};

// Background gradient
const BG_GRADIENT = 'linear-gradient(to right bottom, #F9FAFB, #FFF9C4, #FFFFFF)';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

// Conversation interface
interface Conversation {
  user_email: string;
  store_id: number;
  product_id: string;
  id: number;
  customer: string;
  item: string;
  itemId: string;
  lastMessage: string;
  message_count: number;
  timestamp: string;
  status: 'active' | 'archived';
  messages: { sender: 'customer' | 'seller'; text: string; timestamp: string }[];
}

// Mock data for conversations
const initialConversations: Conversation[] = [];

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [storeConversations, setStoreConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const shopName = 'Storevia';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const searchParams = useSearchParams();
  const shopIdSlug = searchParams.get('shopId');
  const [shopId, setShopId] = useState<number | null>(null);

  // Fetch both product and store messages
  // const fetchAllMessages = useCallback(async () => {
  //   const formData = new FormData();
  //   formData.append('shopId', shopIdSlug || '');

  //   try {
  //     const response = await fetch(`${baseUrl}/fetch_messages_for_stores.php`, {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     setShopId(result.storeId);

  //     // To Products
  //     const newConversations: Conversation[] = (result.messages || []).map(
  //       (
  //         entry: {
  //           user_email: string;
  //           messages: string;
  //           first_message_time: string;
  //           last_message_time: string;
  //           message_count: number;
  //           product_name: string;
  //           product_id: string;
  //         },
  //         index: number
  //       ) => {
  //         const messageArray = entry.messages
  //           .split(', ')
  //           .filter(Boolean)
  //           .map((msg, i, arr) => ({
  //             sender: 'customer' as const,
  //             text: msg.trim(),
  //             timestamp:
  //               i === 0
  //                 ? entry.first_message_time
  //                 : i === arr.length - 1
  //                 ? entry.last_message_time
  //                 : entry.first_message_time,
  //           }))
  //           .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  //         return {
  //           user_email: entry.user_email,
  //           store_id: Number(result.storeId ?? 0),
  //           product_id: entry.product_id,
  //           id: index + 1,
  //           customer: entry.user_email,
  //           item: entry.product_name ?? 'Unknown Item',
  //           itemId: entry.product_id,
  //           lastMessage: messageArray.length > 0 ? messageArray[messageArray.length - 1].text : '',
  //           timestamp: entry.last_message_time,
  //           status: 'active' as const,
  //           messages: messageArray,
  //           message_count: entry.message_count,
  //         };
  //       }
  //     );

  //     setConversations(newConversations);

  //     // To Store
  //     const newStoreConversations: Conversation[] = (result.messagesFromStore || []).map(
  //       (
  //         entry: {
  //           user_email: string;
  //           messages: string;
  //           first_message_time: string;
  //           last_message_time: string;
  //           message_count: number;
  //           send_from: string;
  //         },
  //         index: number
  //       ) => {
  //         const messageArray = entry.messages
  //           .split(', ')
  //           .filter(Boolean)
  //           .map((msg, i, arr) => ({
  //             sender: 'customer' as const,
  //             text: msg.trim(),
  //             timestamp:
  //               i === 0
  //                 ? entry.first_message_time
  //                 : i === arr.length - 1
  //                 ? entry.last_message_time
  //                 : entry.first_message_time,
  //           }))
  //           .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  //         return {
  //           user_email: entry.user_email,
  //           store_id: Number(result.storeId ?? 0),
  //           product_id: '',
  //           id: 10000 + index,
  //           customer: entry.user_email,
  //           item: 'To Store',
  //           itemId: '',
  //           lastMessage: messageArray.length > 0 ? messageArray[messageArray.length - 1].text : '',
  //           timestamp: entry.last_message_time,
  //           status: 'active' as const,
  //           messages: messageArray,
  //           message_count: entry.message_count,
  //         };
  //       }
  //     );

  //     setStoreConversations(newStoreConversations);

  //   } catch (error) {
  //     console.error('Error fetching message data:', error);
  //   }
  // }, [shopIdSlug]);

  const fetchAllMessages = useCallback(async () => {
    const formData = new FormData();
    formData.append('shopId', shopIdSlug || '');

    try {
      const response = await fetch(`${baseUrl}/fetch_messages_for_stores.php`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setShopId(result.storeId);

      // ---- To Products ----
      const newConversations: Conversation[] = (result.messages || []).map(
        (
          entry: {
            user_email: string;
            messages?: string | null;
            first_message_time: string;
            last_message_time: string;
            message_count: number;
            product_name: string;
            product_id: string;
          },
          index: number
        ) => {
          const messageArray = (entry.messages ? entry.messages.split(', ') : [])
            .filter(Boolean)
            .map((msg, i, arr) => ({
              sender: 'customer' as const,
              text: msg.trim(),
              timestamp:
                i === 0
                  ? entry.first_message_time
                  : i === arr.length - 1
                  ? entry.last_message_time
                  : entry.first_message_time,
            }))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

          return {
            user_email: entry.user_email,
            store_id: Number(result.storeId ?? 0),
            product_id: entry.product_id,
            id: index + 1,
            customer: entry.user_email,
            item: entry.product_name ?? 'Unknown Item',
            itemId: entry.product_id,
            lastMessage: messageArray.length > 0 ? messageArray[messageArray.length - 1].text : '',
            timestamp: entry.last_message_time,
            status: 'active' as const,
            messages: messageArray,
            message_count: entry.message_count ?? 0,
          };
        }
      );

      setConversations(newConversations);

      // ---- To Store ----
      const newStoreConversations: Conversation[] = (result.messagesFromStore || []).map(
        (
          entry: {
            user_email: string;
            messages?: string | null;
            first_message_time: string;
            last_message_time: string;
            message_count: number;
            send_from: string;
          },
          index: number
        ) => {
          const messageArray = (entry.messages ? entry.messages.split(', ') : [])
            .filter(Boolean)
            .map((msg, i, arr) => ({
              sender: 'customer' as const,
              text: msg.trim(),
              timestamp:
                i === 0
                  ? entry.first_message_time
                  : i === arr.length - 1
                  ? entry.last_message_time
                  : entry.first_message_time,
            }))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

          return {
            user_email: entry.user_email,
            store_id: Number(result.storeId ?? 0),
            product_id: '',
            id: 10000 + index,
            customer: entry.user_email,
            item: 'To Store',
            itemId: '',
            lastMessage: messageArray.length > 0 ? messageArray[messageArray.length - 1].text : '',
            timestamp: entry.last_message_time,
            status: 'active' as const,
            messages: messageArray,
            message_count: entry.message_count ?? 0,
          };
        }
      );

      setStoreConversations(newStoreConversations);
    } catch (error) {
      console.error('Error fetching message data:', error);
    }
  }, [shopIdSlug]);

  useEffect(() => {
    fetchAllMessages();
    const interval = setInterval(fetchAllMessages, 120000); // 2 min
    return () => clearInterval(interval);
  }, [fetchAllMessages]);

  // const saveMessageToItem = async (
  //   message: string,
  //   productId: string,
  //   name: string,
  //   shop_Id: number
  // ) => {
  //   const formData = new FormData();
  //   formData.append('product_id', productId || '0');
  //   formData.append('user_email', name);
  //   formData.append('store_id', shop_Id.toString());
  //   formData.append('message', message);

  //   try {
  //     const response = await fetch(`${baseUrl}/saveReplyMessages.php`, {
  //       method: 'POST',
  //       body: formData,
  //     });
  //     const result = await response.json();
  //     console.log(result);
  //   } catch (e) {
  //     console.error('Error Save Message data:', e);
  //   }
  // };

  // //Save Reply Messages to Store

  // const saveMessageToStore = async (message: string, name: string, shop_Id: number) => {
  //   const formData = new FormData();
  //   formData.append('user_email', name);
  //   formData.append('store_id', shop_Id.toString());
  //   formData.append('message', message);
  //   // formData.append('from', 'store'); // Indicate it's a store message
  //   formData.append('product_id', '0');

  //   // console.log('Saving message to store:', { message, name, shop_Id, productId: '0' });

  //   try {
  //     const response = await fetch(`${baseUrl}/saveReplyMessages.php`, {
  //       method: 'POST',
  //       body: formData,
  //     });
  //     const result = await response.json();
  //     console.log(result);
  //   } catch (e) {
  //     console.error('Error Save Message data:', e);
  //   }
  // };

  const saveMessageToStore = async (message: string, name: string, shop_Id: number) => {
    const formData = new FormData();
    formData.append('user_email', name);
    formData.append('store_id', shop_Id.toString());
    formData.append('message', message);
    formData.append('from', 'viewStore'); // Important for PHP validation
    formData.append('product_id', '0');

    try {
      const response = await fetch(`${baseUrl}/saveReplyMessages.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);
    } catch (e) {
      console.error('Error Save Message data:', e);
    }
  };

  const saveMessageToItem = async (
    message: string,
    productId: string,
    name: string,
    shop_Id: number
  ) => {
    const formData = new FormData();
    formData.append('product_id', productId || '0');
    formData.append('user_email', name);
    formData.append('store_id', shop_Id.toString());
    formData.append('message', message);
    formData.append('from', 'item'); // Important for PHP validation

    try {
      const response = await fetch(`${baseUrl}/saveReplyMessages.php`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log(result);
    } catch (e) {
      console.error('Error Save Message data:', e);
    }
  };

  // const fetchReplyMessages = useCallback(
  //   async (productId: string, name: string, shop_Id: number) => {
  //     const formData = new FormData();
  //     formData.append('product_id', productId || '0');
  //     formData.append('user_email', name);
  //     formData.append('store_id', shop_Id.toString());

  //     try {
  //       const response = await fetch(`${baseUrl}/getSellerReplies.php`, {
  //         method: 'POST',
  //         body: formData,
  //       });

  //       const replies = await response.json();
  //       console.log('Replies:', replies);

  //       setConversations((prevConversations) =>
  //         prevConversations
  //           .map((conv) => {
  //             if (conv.itemId === productId && conv.customer.trim() === name.trim()) {
  //               const newMessages = replies.filter(
  //                 (reply: { text: string; timestamp: string; sender?: string }) =>
  //                   !conv.messages.some(
  //                     (msg) => msg.text === reply.text && msg.timestamp === reply.timestamp
  //                   )
  //               );

  //               const updatedMessages = [
  //                 ...conv.messages,
  //                 ...newMessages.map(
  //                   (reply: { text: string; timestamp: string; sender?: string }) => ({
  //                     sender: 'seller' as const,
  //                     text: reply.text,
  //                     timestamp: reply.timestamp,
  //                   })
  //                 ),
  //               ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  //               return {
  //                 ...conv,
  //                 messages: updatedMessages,
  //                 lastMessage: updatedMessages[0]?.text || conv.lastMessage,
  //                 timestamp: updatedMessages[0]?.timestamp || conv.timestamp,
  //               };
  //             }
  //             return conv;
  //           })
  //           .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  //       );
  //     } catch (e) {
  //       console.error('Error fetching reply messages:', e);
  //     }
  //   },
  //   [baseUrl]
  // );


const fetchReplyMessages = useCallback(
  async (
    productId: string,
    userEmail: string,
    shopId: number,
    type: 'product' | 'store' = 'product'
  ) => {
    const formData = new FormData();
    formData.append('store_id', shopId.toString());

    if (type === 'product') {
      formData.append('product_id', productId || '0');
      formData.append('user_email', userEmail);
    } else {
      formData.append('product_id', '0'); // store messages don’t have productId
      formData.append('from', 'store'); // indicate store conversation
      if (userEmail) formData.append('user_email', userEmail); // optional for store
    }

    try {
      const response = await fetch(`${baseUrl}/getSellerReplies.php`, {
        method: 'POST',
        body: formData,
      });

      const replies = await response.json();
      console.log('Replies:', replies);

      const updateFunc = type === 'product' ? setConversations : setStoreConversations;

      updateFunc((prevConversations) =>
        prevConversations
          .map((conv) => {
            // Match conversation
            const match =
              type === 'product'
                ? conv.itemId === productId && conv.customer.trim() === userEmail.trim()
                : true; // for store, update all store conversations

            if (!match) return conv;

            // Filter out messages already present
            const newMessages = replies.filter(
              (reply: { text: string; timestamp: string; sender?: string }) =>
                !conv.messages.some(
                  (msg) => msg.text === reply.text && msg.timestamp === reply.timestamp
                )
            );

            // Merge and sort messages
            const updatedMessages = [...conv.messages, ...newMessages.map((reply: { text: any; timestamp: any; }) => ({
              sender: 'seller' as const,
              text: reply.text,
              timestamp: reply.timestamp,
            }))].sort(
              (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );

            return {
              ...conv,
              messages: updatedMessages,
              lastMessage: updatedMessages[updatedMessages.length - 1]?.text || conv.lastMessage,
              timestamp: updatedMessages[updatedMessages.length - 1]?.timestamp || conv.timestamp,
            };
          })
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      );
    } catch (e) {
      console.error('Error fetching reply messages:', e);
    }
  },
  [baseUrl]
);


  // const handleSendMessage = async (
  //   conversationId: number,
  //   customerName: string,
  //   productId: string
  // ) => {
  //   if (newMessage.trim() && !isLoading) {
  //     setIsLoading(true);
  //     const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  //     const newMsg = { sender: 'seller' as const, text: newMessage, timestamp };

  //     try {
  //       // Optimistically update UI first
  //       setConversations((prevConversations) =>
  //         prevConversations
  //           .map((conv) =>
  //             conv.id === conversationId
  //               ? {
  //                   ...conv,
  //                   messages: [...conv.messages, newMsg].sort(
  //                     (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  //                   ),
  //                   lastMessage: newMessage,
  //                   timestamp,
  //                 }
  //               : conv
  //           )
  //           .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  //       );

  //       // Save to backend
  //       await saveMessage(newMessage.trim(), productId, customerName, Number(shopId ?? 0));
  //       setNewMessage('');
  //     } catch (error) {
  //       console.error('Error sending message:', error);
  //       // Revert optimistic update on error
  //       setConversations((prevConversations) =>
  //         prevConversations.map((conv) =>
  //           conv.id === conversationId
  //             ? {
  //                 ...conv,
  //                 messages: conv.messages.filter(
  //                   (msg) =>
  //                     !(
  //                       msg.sender === 'seller' &&
  //                       msg.text === newMessage &&
  //                       msg.timestamp === timestamp
  //                     )
  //                 ),
  //               }
  //             : conv
  //         )
  //       );
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  // };

  const handleSendMessage = async (
    conversationId: number,
    customerName: string,
    productId: string,
    type: 'product' | 'store'
  ) => {
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const newMsg = { sender: 'seller' as const, text: newMessage, timestamp };

    try {
      if (type === 'product') {
        // Optimistic UI update for product conversations
        setConversations((prevConversations) =>
          prevConversations
            .map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    messages: [...conv.messages, newMsg].sort(
                      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    ),
                    lastMessage: newMessage,
                    timestamp,
                  }
                : conv
            )
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        );

        console.log('Sending product message:', newMessage);

        // Send to backend for product messages
        await saveMessageToItem(newMessage.trim(), productId, customerName, Number(shopId ?? 0));
      } else {
        // Optimistic UI update for store conversations
        setStoreConversations((prevConversations) =>
          prevConversations
            .map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    messages: [...conv.messages, newMsg].sort(
                      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                    ),
                    lastMessage: newMessage,
                    timestamp,
                  }
                : conv
            )
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        );

        // Send to backend for store messages
        await saveMessageToStore(newMessage.trim(), customerName, Number(shopId ?? 0));
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);

      // Revert optimistic update on error
      if (type === 'product') {
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.filter(
                    (msg) =>
                      !(
                        msg.sender === 'seller' &&
                        msg.text === newMessage &&
                        msg.timestamp === timestamp
                      )
                  ),
                }
              : conv
          )
        );
      } else {
        setStoreConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.filter(
                    (msg) =>
                      !(
                        msg.sender === 'seller' &&
                        msg.text === newMessage &&
                        msg.timestamp === timestamp
                      )
                  ),
                }
              : conv
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, conversationId: number) => {
    if (e.key === 'Enter' && newMessage.trim()) {
      const conversation = conversations.find((conv) => conv.id === conversationId);
      if (conversation) {
        handleSendMessage(conversation.id, conversation.customer, conversation.itemId, 'product');
      }
    }
  };

  const filterConversationsByDate = (convs: Conversation[]) => {
    if (!dateRange.start || !dateRange.end) return convs;
    return convs.filter((conv) => {
      const convDate = new Date(conv.timestamp).setHours(0, 0, 0, 0);
      const startDate = new Date(dateRange.start).setHours(0, 0, 0, 0);
      const endDate = new Date(dateRange.end).setHours(23, 59, 59, 59);
      return convDate >= startDate && convDate <= endDate;
    });
  };



useEffect(() => {
  let interval: NodeJS.Timeout;

  if (selectedConversation !== null && shopId) {
    // Only check conversations to get type once
    const conv =
      conversations.find((c) => c.id === selectedConversation) ||
      storeConversations.find((c) => c.id === selectedConversation);

    if (conv) {
      const type = conv.itemId ? 'product' : 'store';

      // Fetch immediately
      fetchReplyMessages(conv.itemId, conv.customer, Number(shopId), type);
    }
  }

}, [selectedConversation, shopId]);






  // Tabs: change to "to-products" and "to-store"
  const [activeTab, setActiveTab] = useState<'to-products' | 'to-store'>('to-products');

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex relative overflow-hidden font-poppins"
      style={{ background: BG_GRADIENT }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Decorative Background Elements */}
      <motion.div
        className="absolute top-0 left-0 w-40 h-40 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: COLORS.primary }}
        animate={{
          x: ['-5%', '5%', '-5%'],
          y: ['-5%', '5%', '-5%'],
        }}
        transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-52 h-52 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: COLORS.secondary }}
        animate={{
          x: ['5%', '-5%', '5%'],
          y: ['5%', '-5%', '5%'],
        }}
        transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: COLORS.accent1 }}
        animate={{
          x: ['10%', '-10%', '10%'],
          y: ['10%', '-10%', '10%'],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
      />

      {/* Main Content */}
      <motion.div variants={fadeIn} className="flex-1 p-6 lg:p-8 z-10 w-full">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-8"
          variants={itemVariants}
        >
          <motion.div className="flex items-center">
            <motion.div
              className="w-12 h-12 bg-gradient-to-br from-primary to-accent1 flex items-center justify-center rounded-xl mr-4 shadow-lg"
              whileHover={{ scale: 1.05 }}
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})`,
              }}
            >
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h18a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zm9 4l9 5-9 5-9-5z"
                />
              </svg>
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                <span className="text-yellow-500">{shopName} Inbox</span>
              </h1>
              <p className="text-gray-500">Manage your customer conversations</p>
            </div>
          </motion.div>
          <motion.div className="flex items-center space-x-4 mt-4 md:mt-0" variants={itemVariants}>
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="w-36"
              />
              <span className="text-gray-500">to</span>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="w-36"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Conversation List */}
          <motion.div
            className="md:col-span-1 bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
            variants={itemVariants}
          >
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as 'to-products' | 'to-store')}
              className="mb-4"
            >
              <TabsList className="bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="to-products"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'to-products'
                      ? 'bg-yellow-400 text-white'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  To Products
                </TabsTrigger>
                <TabsTrigger
                  value="to-store"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'to-store'
                      ? 'bg-yellow-400 text-white'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  To Store
                </TabsTrigger>
              </TabsList>
              <TabsContent value="to-products">
                <ConversationList
                  conversations={filterConversationsByDate(
                    conversations.filter((conv) => conv.status === 'active')
                  )}
                  setSelectedConversation={setSelectedConversation}
                  selectedConversation={selectedConversation}
                />
              </TabsContent>
              <TabsContent value="to-store">
                <ConversationList
                  conversations={filterConversationsByDate(
                    storeConversations.filter((conv) => conv.status === 'active')
                  )}
                  setSelectedConversation={setSelectedConversation}
                  selectedConversation={selectedConversation}
                />
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Conversation View */}
          <motion.div
            className="md:col-span-2 bg-white p-6 rounded-xl shadow hover:shadow-md transition-all duration-300"
            variants={itemVariants}
          >
            {selectedConversation !== null ? (
              (() => {
                const currentConversation =
                  activeTab === 'to-products'
                    ? conversations.find((conv) => conv.id === selectedConversation)
                    : storeConversations.find((conv) => conv.id === selectedConversation);

                if (!currentConversation) {
                  // if the ID doesn’t match anything yet
                  return (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Conversation not found
                    </div>
                  );
                }

                return (
                  <ConversationView
                    conversation={currentConversation}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    handleSendMessage={(customerName: string) => {
                      handleSendMessage(
                        currentConversation.id,
                        customerName,
                        currentConversation.itemId,
                        activeTab === 'to-products' ? 'product' : 'store'
                      );
                    }}
                    handleKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      handleKeyPress(e, selectedConversation)
                    }
                    setSelectedConversation={(conv: Conversation | null) =>
                      setSelectedConversation(conv ? conv.id : null)
                    }
                    isLoading={isLoading}
                  />
                );
              })()
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to view messages
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ConversationList({
  conversations,
  setSelectedConversation,
  selectedConversation,
}: {
  conversations: Conversation[];
  setSelectedConversation: (id: number | null) => void;
  selectedConversation: number | null;
}) {
  return (
    <ScrollArea className="h-[600px]">
      {conversations.length === 0 ? (
        <div className="text-gray-500 text-center py-4">No conversations found</div>
      ) : (
        conversations.map((conv) => (
          <motion.div
            key={conv.id}
            className={`p-4 mb-2 rounded-lg cursor-pointer transition-colors ${
              selectedConversation === conv.id ? 'bg-yellow-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedConversation(conv.id)}
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{ backgroundColor: `${COLORS.primary}20`, color: COLORS.primary }}
                >
                  <MessageCircle className="h-5 w-5" />
                </motion.div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{conv.customer}</h4>
                  <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">{conv.timestamp}</div>
            </div>
            <div className="flex items-center mt-2">
              <Package className="h-4 w-4 mr-1" style={{ color: COLORS.accent1 }} />
              <span className="text-xs text-gray-600 mr-10">{conv.item}</span>
              <h5 className="text-xs font-bold text-white bg-blue-500 px-2 py-0.5 rounded-full">
                {conv.message_count}
              </h5>
            </div>
          </motion.div>
        ))
      )}
    </ScrollArea>
  );
}

function ConversationView({
  conversation,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleKeyPress,
  setSelectedConversation,
  isLoading,
}: {
  conversation: Conversation;
  newMessage: string;
  setNewMessage: (text: string) => void;
  handleSendMessage: (customerName: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setSelectedConversation: (conversation: Conversation | null) => void;
  isLoading: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleLocalKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && newMessage.trim()) {
      handleSendMessage(conversation.customer);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <motion.button
            onClick={() => setSelectedConversation(null)}
            className="mr-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </motion.button>
          <h3 className="text-lg font-semibold text-gray-900">{conversation.customer}</h3>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Package className="h-4 w-4 mr-1" style={{ color: COLORS.accent1 }} />
          <span>
            {conversation.item} {conversation.itemId}
          </span>
        </div>
      </div>
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-4 p-2">
          {conversation.messages
            .slice()
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((msg, idx) => (
              <motion.div
                key={`${msg.timestamp}-${idx}`}
                className={`flex ${msg.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <div
                  className={`max-w-xs lg:max-w-md p-3 rounded-2xl shadow-sm ${
                    msg.sender === 'seller'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-br-md'
                      : 'bg-gray-100 text-gray-900 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p
                      className={`text-xs ${
                        msg.sender === 'seller' ? 'text-gray-700' : 'text-gray-500'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                    {msg.sender === 'seller' && (
                      <span className="text-xs text-gray-700 ml-2">✓</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="flex items-center space-x-2">
        <Input
          value={newMessage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
          onKeyPress={handleLocalKeyPress}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
        />
        <motion.button
          onClick={() => handleSendMessage(conversation.customer)}
          className={`px-4 py-2 rounded-lg text-white ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent1})` }}
          whileHover={!isLoading ? { scale: 1.05 } : {}}
          whileTap={!isLoading ? { scale: 0.95 } : {}}
          disabled={isLoading || !newMessage.trim()}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Send className="h-5 w-5" />
            </motion.div>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
