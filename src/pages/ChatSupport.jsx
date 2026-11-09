import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle, PackageSearch, Send, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import "../Styles/ChatSupport.css";

function getAssistantReply(message, products, canViewOrders) {
  const query = message.toLowerCase();

  if (/\b(hi|hello|hey|good morning|good evening)\b/.test(query)) {
    return "Hello! I can help you find styles, check product details, or point you to your orders. What are you looking for?";
  }

  if (/\b(order|track|tracking|delivery status)\b/.test(query)) {
    return canViewOrders
      ? "You can view the latest status and details for your purchases on your orders page."
      : "Please sign in to view your order status and delivery details.";
  }

  if (/\b(delivery|shipping|ship|deliver)\b/.test(query)) {
    return "For delivery updates, open your orders page after signing in. For other delivery questions, our team can help you on WhatsApp.";
  }

  if (/\b(return|refund|cancel|exchange)\b/.test(query)) {
    return "For help with a return, exchange, refund, or cancellation, please check your order details or contact our team on WhatsApp.";
  }

  if (/\b(wholesale|bulk)\b/.test(query)) {
    return "Welcome, wholesale shoppers! Sign in with your wholesaler account to see your order options and minimum order requirements.";
  }

  if (/\b(size|sizing|colour|color|fabric|material)\b/.test(query)) {
    const terms = query.split(/\s+/).filter((term) => term.length > 2);
    const matches = products
      .filter((product) => {
        const searchable = `${product.name} ${product.category} ${product.colors.join(" ")}`.toLowerCase();
        return terms.some((term) => searchable.includes(term));
      })
      .slice(0, 3);

    if (matches.length) {
      return matches
        .map((product) => `${product.name}: sizes ${product.sizes.join(", ")}; colours ${product.colors.join(", ")}.`)
        .join(" ");
    }

    return "You can find available sizes and colours on each product page. Tell me the style you like, and I can help you browse.";
  }

  const terms = query.split(/\s+/).filter((term) => term.length > 2);
  const matches = products
    .filter((product) => {
      const searchable = `${product.name} ${product.category} ${product.colors.join(" ")}`.toLowerCase();
      return terms.some((term) => searchable.includes(term));
    })
    .slice(0, 3);

  if (matches.length) {
    return `Here are a few options: ${matches.map((product) => `${product.name} (₹${product.price.toLocaleString("en-IN")})`).join(", ")}. Browse the collection to see more.`;
  }

  return "I can help with products, sizes, colours, prices, orders, and delivery. Try asking about a style, or browse our collection.";
}

export default function ChatSupport({ user, products = [] }) {
  const canViewOrders = user?.role === "Customer" || user?.role === "Wholesaler";
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: `Hi${user?.name ? `, ${user.name}` : ""}! Welcome to Hyni. Ask me about our collection, sizes, prices, or your orders.`
    }
  ]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const conversationRef = useRef(null);

  useEffect(() => {
    conversationRef.current?.scrollTo({
      top: conversationRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, isTyping]);

  function sendMessage(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isTyping) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), sender: "customer", text }
    ]);
    setDraft("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          sender: "assistant",
          text: getAssistantReply(text, products, canViewOrders)
        }
      ]);
      setIsTyping(false);
    }, 450);
  }

  return (
    <main className="chat-support-page container page-enter">
      <Link to="/" className="chat-support-back">
        <ArrowLeft size={17} /> Back to shopping
      </Link>

      <section className="chat-support-card">
        <div className="chat-support-header">
          <span className="chat-support-avatar">
            <MessageCircle size={25} />
          </span>
          <div>
            <span className="chat-support-eyebrow">HYNI FASHION STUDIO</span>
            <h1>Chat with our assistant</h1>
            <p>Type a message and we’ll help you find what you need.</p>
          </div>
          <span className="chat-support-online"><i /> Here to help</span>
        </div>

        <div className="chat-support-conversation" ref={conversationRef} role="log" aria-live="polite" aria-label="Chat messages">
          {messages.map((message) => (
            <div className={`chat-support-message ${message.sender}`} key={message.id}>
              {message.sender === "assistant" && (
                <span className="chat-support-avatar small"><MessageCircle size={17} /></span>
              )}
              <p>{message.text}</p>
            </div>
          ))}
          {isTyping && (
            <div className="chat-support-message assistant" aria-label="Assistant is typing">
              <span className="chat-support-avatar small"><MessageCircle size={17} /></span>
              <p className="chat-support-typing">Assistant is typing<span>...</span></p>
            </div>
          )}
        </div>

        <form className="chat-support-composer" onSubmit={sendMessage}>
          <label className="sr-only" htmlFor="chat-support-input">Type your message</label>
          <input
            id="chat-support-input"
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type your message..."
            maxLength={500}
            autoComplete="off"
          />
          <button type="submit" disabled={!draft.trim() || isTyping} aria-label="Send message">
            <Send size={17} />
            <span>Send</span>
          </button>
        </form>

        <nav className="chat-support-options" aria-label="Help options">
          {canViewOrders ? (
            <Link to="/orders">
              <PackageSearch size={19} />
              <span>
                <strong>Check my orders</strong>
                <small>Order status, delivery, or cancellations</small>
              </span>
              <ArrowRight size={17} />
            </Link>
          ) : (
            <Link to="/login">
              <PackageSearch size={19} />
              <span>
                <strong>Sign in to check orders</strong>
                <small>View order status and delivery details</small>
              </span>
              <ArrowRight size={17} />
            </Link>
          )}

          <Link to="/products">
            <ShoppingBag size={19} />
            <span>
              <strong>Browse the collection</strong>
              <small>Find your next favourite style</small>
            </span>
            <ArrowRight size={17} />
          </Link>

          <a
            href="https://wa.me/?text=Hi%20Hyni%20Fashion%20Studio%2C%20I%20need%20help."
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={19} />
            <span>
              <strong>Continue on WhatsApp</strong>
              <small>Open a message to Hyni Fashion Studio</small>
            </span>
            <ArrowRight size={17} />
          </a>
        </nav>
      </section>
    </main>
  );
}
