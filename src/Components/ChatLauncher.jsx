import { MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "../Styles/ChatLauncher.css";

export default function ChatLauncher() {
  const { pathname } = useLocation();

  if (pathname === "/chat") return null;

  return (
    <Link
      className="chat-launcher"
      to="/chat"
      aria-label="Open Hyni chat support"
    >
      <MessageCircle size={23} strokeWidth={2} aria-hidden="true" />
      <span>Chat with us</span>
    </Link>
  );
}
