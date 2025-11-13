import { FC, useState, useEffect } from "react";

interface Message {
  id: number;
  source: "order" | "store";
  content: string;
  timestamp: string;
  edited?: boolean;
}

const MessageCenter: FC = () => {
  const [activeTab, setActiveTab] = useState<"order" | "store">("order");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      source: "order",
      content: "Your order #1234 has been shipped!",
      timestamp: "2025-05-09 10:30 AM",
    },
    {
      id: 2,
      source: "store",
      content: "New arrivals at Store XYZ!",
      timestamp: "2025-05-09 09:15 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (!["order", "store"].includes(activeTab)) {
      setActiveTab("order");
    }
  }, [activeTab]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeTab === "order" ? msg.source === "order" : msg.source === "store")
  );

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const newMsg: Message = {
      id: messages.length + 1,
      source: activeTab,
      content: newMessage,
      timestamp: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    };
    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const handleDelete = (id: number) => {
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  const handleEdit = (id: number, content: string) => {
    setEditingMessageId(id);
    setEditContent(content);
  };

  const handleSaveEdit = (id: number) => {
    setMessages(
      messages.map((msg) =>
        msg.id === id ? { ...msg, content: editContent, edited: true } : msg
      )
    );
    setEditingMessageId(null);
    setEditContent("");
  };

  const orderMessagesCount = messages.filter(
    (msg) => msg.source === "order"
  ).length;
  const storeMessagesCount = messages.filter(
    (msg) => msg.source === "store"
  ).length;

  const renderMessageItem = (msg: Message) => (
    <div
      key={msg.id}
      className="flex flex-col md:flex-row bg-white border rounded-lg overflow-hidden mb-4 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="w-full md:w-48 h-24 md:h-auto bg-gray-100 flex-shrink-0">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M9 16c-6 6-9-4-9-9"
            />
          </svg>
        </div>
      </div>
      <div className="flex-grow p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-black">
              {msg.source === "order"
                ? "Messages from Orders"
                : "Messages from Stores"}
            </h3>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(msg.id, msg.content)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(msg.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
          {editingMessageId === msg.id ? (
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              <button
                onClick={() => handleSaveEdit(msg.id)}
                className="bg-black text-white px-3 py-1 rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setEditingMessageId(null)}
                className="bg-gray-500 text-white px-3 py-1 rounded-md"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p className="text-black mt-2">{msg.content}</p>
          )}
          <p className="text-sm text-gray-600 mt-1">{msg.timestamp}</p>
          {msg.edited && <p className="text-sm text-gray-500">(Edited)</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      <div className="p-6">
        {/* Tabs with Counts */}
        <div className="flex items-center mb-6 border-b">
          <button
            className={`px-3 py-2 text-black font-medium ${
              activeTab === "order" ? "border-b-2 border-red-600" : ""
            }`}
            onClick={() => setActiveTab("order")}
          >
             Orders ({orderMessagesCount})
          </button>
          <button
            className={`px-3 py-2 text-black font-medium ${
              activeTab === "store" ? "border-b-2 border-red-600" : ""
            }`}
            onClick={() => setActiveTab("store")}
          >
             Stores ({storeMessagesCount})
          </button>
          <div className="flex-grow"></div>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 flex">
            <input
              type="text"
              placeholder={`Search ${
                activeTab === "order" ? "Orders" : "Stores"
              } Messages`}
              className="border border-gray-200 px-4 py-2 flex-grow text-black rounded-l"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-r transition-colors duration-200">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "order" && (
          <div>
            {filteredMessages.length > 0 ? (
              <div className="space-y-4">
                {filteredMessages.map(
                  (msg) => msg.source === "order" && renderMessageItem(msg)
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white rounded-lg p-12 flex-1 min-h-64">
                <div className="w-16 h-16 mb-4 text-gray-400">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">
                  No messages from orders yet. Check back later!
                </p>
              </div>
            )}
          </div>
        )}
        {activeTab === "store" && (
          <div>
            {filteredMessages.length > 0 ? (
              <div className="space-y-4">
                {filteredMessages.map(
                  (msg) => msg.source === "store" && renderMessageItem(msg)
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white rounded-lg p-12 flex-1 min-h-64">
                <div className="w-16 h-16 mb-4 text-gray-400">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">
                  No messages from stores yet. Start exploring!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Send Message Section */}
        <div className="bg-white border rounded-lg p-4 mt-6">
          <h2 className="text-lg font-semibold text-black mb-2">
            Send a Message
          </h2>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleSend}
              className="bg-black text-white px-4 py-2 rounded-md"
            >
              Send
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setNewMessage(newMessage + " 😊")}
              className="text-sm text-gray-600 hover:underline"
            >
              Emoji
            </button>
            <button
              onClick={() =>
                alert("Picture upload functionality to be implemented")
              }
              className="text-sm text-gray-600 hover:underline"
            >
              Pictures
            </button>
            <button
              onClick={() =>
                alert("Document upload functionality to be implemented")
              }
              className="text-sm text-gray-600 hover:underline"
            >
              Documents
            </button>
            <button
              onClick={() =>
                alert("Item selection functionality to be implemented")
              }
              className="text-sm text-gray-600 hover:underline"
            >
              Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;