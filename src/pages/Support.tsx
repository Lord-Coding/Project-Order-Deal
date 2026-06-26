import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Bot, Package, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "../components/BottomNav";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  time: string;
}

const quickQuestions = [
  { icon: Package,       text: "Où est ma commande ?",     query: "Je voudrais savoir où en est ma commande" },
  { icon: HelpCircle,    text: "Problème avec ma commande", query: "J'ai un problème avec ma commande" },
  { icon: MessageCircle, text: "Modifier ma commande",      query: "Je voudrais modifier ma commande" },
];

const botResponses: Record<string, string> = {
  default:   "Bonjour ! Je suis l'assistant Order Deal. Comment puis-je vous aider aujourd'hui ?",
  commande:  "Pour suivre votre commande, rendez-vous dans « Mes Commandes » depuis votre profil. Votre dernière commande #ORD-001 est en préparation !",
  problème:  "Je suis désolé d'apprendre cela. Un conseiller va vous contacter sous peu. Vous pouvez aussi nous appeler au 01 23 45 67 89.",
  modifier:  "Pour modifier une commande en cours, contactez-nous rapidement au 01 23 45 67 89. Les modifications sont possibles avant la préparation.",
  livraison: "Nos délais sont généralement de 20-35 minutes. Vous pouvez suivre votre livreur en temps réel !",
  horaires:  "Nous sommes ouverts du lundi au samedi de 11h à 23h, et le dimanche de 12h à 22h.",
  paiement:  "Nous acceptons carte bancaire, espèces à la livraison et paiement en ligne. Tout est sécurisé !",
};

const getBotResponse = (text: string): string => {
  const t = text.toLowerCase();
  if (t.includes("commande") || t.includes("suivi") || t.includes("où")) return botResponses.commande;
  if (t.includes("problème") || t.includes("erreur") || t.includes("manque")) return botResponses.problème;
  if (t.includes("modifier") || t.includes("changer") || t.includes("annuler")) return botResponses.modifier;
  if (t.includes("livraison") || t.includes("délai") || t.includes("temps")) return botResponses.livraison;
  if (t.includes("horaire") || t.includes("ouvert") || t.includes("fermé")) return botResponses.horaires;
  if (t.includes("payer") || t.includes("paiement") || t.includes("carte")) return botResponses.paiement;
  return "Je comprends votre demande. Un conseiller va prendre le relais pour mieux vous aider sous peu !";
};

const Support = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: botResponses.default,
      sender: "bot",
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    setMessages((prev) => [...prev, { id: Date.now().toString(), text: text.trim(), sender: "user", time: now }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: getBotResponse(text), sender: "bot", time: now },
      ]);
    }, 1100);
  };

  return (
    <div className="support-page min-h-screen bg-background flex flex-col pb-16">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border"
      >
        <div className="w-full max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto flex items-center gap-3 h-14 sm:h-16 px-4 sm:px-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-none">Service Client</p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
              En ligne
            </p>
          </div>
        </div>
      </motion.header>

      {/* Messages area */}
      <main className="flex-1 overflow-y-auto w-full max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-4 space-y-3">
        {/* Quick questions */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Questions fréquentes
            </p>
            <div className="flex flex-col gap-2">
              {quickQuestions.map((q, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.08 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(q.query)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-border bg-card hover:bg-muted/50 hover:border-primary/40 transition-all text-sm font-medium text-left"
                >
                  <q.icon className="w-4 h-4 text-primary shrink-0" />
                  {q.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat messages */}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[82%] sm:max-w-[70%] ${msg.sender === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md shadow-card"
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex justify-start"
            >
              <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-card border border-border shadow-card">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-muted-foreground/60"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.18 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </main>

      {/* Input bar */}
      <div className="sticky bottom-16 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="w-full max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Écrivez votre message…"
              className="flex-1 rounded-2xl bg-muted/60"
            />
            <motion.div whileTap={{ scale: 0.88 }}>
              <Button type="submit" size="icon" disabled={!input.trim()} className="shrink-0 rounded-2xl">
                <Send className="w-4 h-4" />
              </Button>
            </motion.div>
          </form>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Support;
