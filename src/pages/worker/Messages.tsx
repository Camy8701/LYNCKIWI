// KYSS Vision — Messages Page (US-039)
import { useEffect, useState, useRef } from "react"
import { Helmet } from "react-helmet-async"
import { Send, Loader2, MessageSquare } from "lucide-react"
import WorkerLayout from "@/components/WorkerLayout"
import { useAuth } from "@/contexts/AuthContext"
import { getConversations, getMessages, sendMessage } from "@/lib/kyss"
import type { Conversation, Message } from "@/integrations/supabase/types"

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    getConversations(user.id).then((c) => {
      setConversations(c)
      setLoading(false)
    })
  }, [user])

  useEffect(() => {
    if (!activeConv) return
    getMessages(activeConv.id).then(setMessages)
  }, [activeConv])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!activeConv || !user || !newMsg.trim()) return
    setSending(true)
    await sendMessage(activeConv.id, user.id, newMsg.trim())
    setNewMsg("")
    const updated = await getMessages(activeConv.id)
    setMessages(updated)
    setSending(false)
  }

  return (
    <>
      <Helmet><title>Messages — KYSS Vision</title></Helmet>
      <WorkerLayout>
        <div className="h-[calc(100vh-8rem)] flex gap-4">
          {/* Conversation list */}
          <div className="w-72 shrink-0 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">No conversations yet.</div>
              ) : (
                conversations.map((conv) => (
                  <button key={conv.id} onClick={() => setActiveConv(conv)} className={`w-full text-left px-4 py-3 border-b border-border hover:bg-accent transition-colors ${activeConv?.id === conv.id ? "bg-primary/10" : ""}`}>
                    <p className="text-sm font-medium text-foreground truncate">Conversation</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(conv.updated_at).toLocaleDateString("en-NZ", { day: "numeric", month: "short" })}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
            {!activeConv ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a conversation</p>
                </div>
              </div>
            ) : (
              <>
                <div className="px-5 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">Conversation</p>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
                          {msg.content}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>
                <div className="px-4 py-3 border-t border-border flex gap-2">
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button onClick={handleSend} disabled={sending || !newMsg.trim()} className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-colors">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </WorkerLayout>
    </>
  )
}
