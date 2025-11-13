import { FC } from "react";
import { Share2, Users, Chrome, Mail } from "lucide-react";
import { motion } from "framer-motion";

const InviteFriends: FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold text-black mb-2">Invite Friends</h1>
        <p className="text-gray-500 text-sm font-semibold">
          Expand your reach by inviting friends to your page using multiple methods.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2">
        {[
          {
            icon: <Users className="text-yellow-600 w-6 h-6" />,
            title: "Facebook App",
            description: "Go to your Facebook Page → Tap Options → Invite Friends.",
          },
          {
            icon: <Share2 className="text-yellow-600 w-6 h-6" />,
            title: "Facebook Website",
            description: 'On your Page, click ⋯ and select "Invite Friends".',
          },
          {
            icon: <Mail className="text-yellow-600 w-6 h-6" />,
            title: "Invite Post Reactors",
            description: 'Click reactions under a post and tap "Invite" next to names.',
          },
          {
            icon: <Chrome className="text-yellow-600 w-6 h-6" />,
            title: "Auto Invite (Chrome)",
            description: "Use a browser extension to invite all post likers.",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="p-3 bg-yellow-100 rounded-full mb-3">{item.icon}</div>
            <h2 className="text-lg font-semibold text-yellow-700 mb-1">{item.title}</h2>
            <p className="text-sm text-gray-700">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InviteFriends;
