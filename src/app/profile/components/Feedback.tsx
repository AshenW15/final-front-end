/* eslint-disable @next/next/no-img-element */
import { FC, useState } from "react";
import { motion } from "framer-motion";

// Tile-style section title
const TileTitle = ({ icon, title }: { icon: string; title: string }) => (
  <div className="mb-4 inline-block bg-yellow-100 text-yellow-800 text-sm font-bold px-4 py-1 rounded-full shadow-sm tracking-tight">
    {icon} {title}
  </div>
);

interface FeedbackItem {
  rating: number;
  comment: string;
  tags: string[];
  date: string;
  image?: string;
}

const CustomerFeedback: FC = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [history, setHistory] = useState<FeedbackItem[]>([
    {
      rating: 5,
      comment: "Great communication and paid on time!",
      tags: ["Polite", "Repeat customer"],
      date: "2025-05-07",
      image: "https://i.pravatar.cc/80?img=1",
    },
    {
      rating: 4,
      comment: "Good experience, but minor delay in providing details.",
      tags: ["Responsive", "Slight delay"],
      date: "2025-04-22",
      image: "https://i.pravatar.cc/80?img=2",
    },
  ]);

  const handleSubmit = () => {
    const newFeedback: FeedbackItem = {
      rating,
      comment,
      tags: tags.split(",").map((t) => t.trim()),
      date: new Date().toISOString().split("T")[0],
      image: image ? URL.createObjectURL(image) : undefined,
    };
    setHistory([newFeedback, ...history]);
    alert("Feedback submitted!");
    setRating(0);
    setComment("");
    setTags("");
    setImage(null);
  };

  const handleRemoveFeedback = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-6 font-poppins space-y-6"
    >
      {/* Customer Profile */}
      <div className="relative overflow-hidden p-6 rounded-2xl border border-gray-200 shadow-lg backdrop-blur-md flex items-center gap-6 transition hover:shadow-xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-white opacity-60 pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col justify-center items-start text-left flex-1">
          <TileTitle icon="👤" title="Customer Profile" />
          <h2 className="text-xl font-bold text-black tracking-tight mt-2">John Doe</h2>
          <p className="text-sm text-gray-500 font-semibold">
            Customer since <span className="font-semibold">2025</span>
          </p>
          <div className="flex items-center gap-3 mt-2">
            <div className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
              Orders: 14
            </div>
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
              <span>4.6</span> ★
            </div>
          </div>
        </div>
        <img
          src="https://i.pravatar.cc/80?img=5"
          alt="Customer"
          className="relative z-10 w-20 h-20 rounded-full border-4 border-gray-200 shadow-md"
        />
      </div>

      {/* Feedback History */}
      <div className="relative overflow-hidden border border-gray-200 rounded-2xl shadow-lg p-6 backdrop-blur-md transition hover:shadow-xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-white opacity-60 pointer-events-none z-0" />
        <div className="relative z-10">
          <TileTitle icon="🗂️" title="Previous Feedback" />
          {history.length === 0 ? (
            <div className="text-center text-gray-500 text-sm italic">No feedback given yet.</div>
          ) : (
            <ul className="space-y-6 mt-2">
              {history.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-start gap-4 p-4 rounded-xl border border-gray-200 hover:bg-white transition-all duration-200"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-sm text-yellow-700 font-medium mb-1">
                      <span className="flex items-center gap-1">🗓️ <span className="text-xs">{item.date}</span></span>
                      <span className="flex items-center gap-1">⭐ <span className="text-sm font-semibold">{item.rating}</span></span>
                    </div>
                    <p className="text-gray-800 text-sm mb-2">💬 {item.comment}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, tagIdx) => (
                        <span key={tagIdx} className="bg-yellow-200 text-yellow-800 text-xs px-2 py-0.5 rounded-full shadow-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt="Feedback"
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-md"
                    />
                  )}
                  <button
                    onClick={() => handleRemoveFeedback(idx)}
                    className="text-red-500 hover:text-red-700 font-semibold text-xs"
                  >
                    🗑️ Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Submit Feedback Form */}
      <div className="relative overflow-hidden border border-gray-200 rounded-2xl shadow-xl p-6 backdrop-blur-md transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-white opacity-60 pointer-events-none z-0" />
        <div className="relative z-10 space-y-6">
          <TileTitle icon="📝" title="Submit New Feedback" />

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">🌟 Rate Your Experience</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-all duration-200 ${
                    star <= rating ? "text-yellow-400 scale-110" : "text-gray-300"
                  } hover:scale-110`}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">💬 Your Comments</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm text-gray-700 shadow-inner placeholder:text-yellow-600 hover:shadow-md transition-all duration-200"
              placeholder="✍️ Share your thoughts about the experience..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              🏷️ Add Tags <span className="text-xs text-yellow-600">(separate with commas)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-sm text-gray-700 shadow-inner placeholder:text-yellow-600 hover:shadow-md transition-all duration-200"
              placeholder='e.g., "Polite, Late, Easy to work with"'
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">📸 Add an Optional Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="block w-full text-sm text-yellow-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-800 hover:file:bg-yellow-200 transition-all duration-200"
            />
            {image && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: <span className="font-medium">{image.name}</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-400 text-white py-3 rounded-xl text-center font-semibold transition-transform transform hover:scale-105 hover:shadow-xl hover:from-yellow-500 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 shadow-md"
          >
            🚀 Send Feedback
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerFeedback;
