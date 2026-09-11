import { useState, useEffect, useRef } from "react";
import { chatApi, type ChatSessionItem, type ChatMessageItem } from "../api/chat.api";
import { apiError } from "../lib/api";
import { Spinner } from "../components/ui/Spinner";
import logoImg from "../assets/Logo.png";

const SUGGESTIONS = [
  {
    icon: "🦐",
    title: "Phân biệt tôm thẻ và tôm sú",
    prompt: "Làm thế nào để phân biệt tôm thẻ chân trắng và tôm sú dựa trên hình thái bên ngoài và chân?",
  },
  {
    icon: "🧪",
    title: "Chỉ số nước lý tưởng",
    prompt: "Các chỉ số pH, độ kiềm, oxy hòa tan và độ mặn lý tưởng nhất để nuôi tôm là bao nhiêu?",
  },
  {
    icon: "⚠️",
    title: "Phòng ngừa bệnh đốm trắng",
    prompt: "Dấu hiệu nhận biết và cách phòng ngừa bệnh đốm trắng (WSSV) trên tôm nuôi như thế nào?",
  },
  {
    icon: "🌊",
    title: "Xử lý khí độc NH3 & NO2",
    prompt: "Cách xử lý khẩn cấp khi ao nuôi tôm bị bùng phát khí độc NH3 và NO2?",
  },
];

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSessionItem[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  );
  const [sessionToDelete, setSessionToDelete] = useState<ChatSessionItem | null>(null);
  const [isDeletingSession, setIsDeletingSession] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cuộn xuống tin nhắn mới nhất
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isSending]);

  // Nạp danh sách các phiên trò chuyện khi mở trang
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoadingSessions(true);
    setError(null);
    try {
      const data = await chatApi.getSessions();
      setSessions(data);
      if (data.length > 0 && !activeSessionId) {
        selectSession(data[0].id);
      }
    } catch (err) {
      setError(apiError(err, "Không thể tải danh sách cuộc trò chuyện."));
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const selectSession = async (sessionId: string) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    setActiveSessionId(sessionId);
    setIsLoadingMessages(true);
    setError(null);
    try {
      const session = await chatApi.getSession(sessionId);
      setMessages(session.messages || []);
    } catch (err) {
      setError(apiError(err, "Không thể tải nội dung tin nhắn."));
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleCreateNewSession = async (initialPrompt?: string) => {
    setError(null);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    try {
      const newSession = await chatApi.createSession();
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setMessages([]);

      if (initialPrompt) {
        await sendMessageToSession(newSession.id, initialPrompt);
      }
    } catch (err) {
      setError(apiError(err, "Không thể tạo cuộc trò chuyện mới."));
    }
  };

  const openDeleteModal = (e: React.MouseEvent, session: ChatSessionItem) => {
    e.stopPropagation();
    setSessionToDelete(session);
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;
    setIsDeletingSession(true);
    try {
      await chatApi.deleteSession(sessionToDelete.id);
      const remaining = sessions.filter((s) => s.id !== sessionToDelete.id);
      setSessions(remaining);

      if (activeSessionId === sessionToDelete.id) {
        if (remaining.length > 0) {
          selectSession(remaining[0].id);
        } else {
          setActiveSessionId(null);
          setMessages([]);
        }
      }
      setSessionToDelete(null);
    } catch (err) {
      setError(apiError(err, "Không thể xóa cuộc trò chuyện."));
    } finally {
      setIsDeletingSession(false);
    }
  };

  const sendMessageToSession = async (sessionId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const tempUserMsg: ChatMessageItem = {
      id: `temp-${Date.now()}`,
      chatSessionId: sessionId,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setInputText("");
    setIsSending(true);
    setError(null);

    try {
      const aiMsg = await chatApi.sendMessage(sessionId, trimmed);
      setMessages((prev) => [...prev, aiMsg]);

      // Cập nhật lại tiêu đề session trong danh sách sidebar nếu là câu hỏi đầu tiên
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === sessionId) {
            return {
              ...s,
              title: s.title === "Cuộc trò chuyện mới" || s.title === "Đoạn chat mới"
                ? (trimmed.length > 30 ? `${trimmed.substring(0, 30)}...` : trimmed)
                : s.title,
              updatedAt: new Date().toISOString(),
            };
          }
          return s;
        }),
      );
    } catch (err) {
      setError(apiError(err, "Lỗi khi gửi tin nhắn đến AI. Vui lòng thử lại."));
    } finally {
      setIsSending(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    if (!activeSessionId) {
      handleCreateNewSession(inputText);
    } else {
      sendMessageToSession(activeSessionId, inputText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render text có hỗ trợ định dạng cơ bản (tiêu đề, in đậm, gạch đầu dòng)
  const renderFormattedMessage = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-base font-bold text-slate-900 mt-2.5 mb-1 text-cyan-800">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-lg font-bold text-slate-900 mt-3 mb-1 text-cyan-900">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 leading-relaxed my-0.5">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line.substring(2)) }} />
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <p key={idx} className="font-semibold text-slate-800 mt-2 mb-0.5">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </p>
        );
      }
      if (line.startsWith("> ")) {
        return (
          <blockquote
            key={idx}
            className="my-2 rounded-r-lg border-l-4 border-cyan-500 bg-cyan-50/60 p-2.5 text-xs text-slate-700 italic"
          >
            {line.replace("> ", "")}
          </blockquote>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="leading-relaxed text-slate-700">
          <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        </p>
      );
    });
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code class='bg-slate-100 text-cyan-700 px-1.5 py-0.5 rounded text-xs font-mono'>$1</code>");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] bg-slate-50 overflow-hidden animate-fade-in">
      {/* Top Banner Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
            title="Đóng / Mở danh sách đoạn chat"
          >
            ☰
          </button>
          <div className="flex items-center gap-2.5">
            <img
              src={logoImg}
              alt="shrimpAI"
              className="h-8 w-8 rounded-full ring-2 ring-cyan-500/20 object-contain"
            />
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Trợ lý AI Thủy sản & Phân tích Tôm
              </h2>
              <p className="text-[11px] text-slate-500">
                Tư vấn giống tôm, bệnh học và kỹ thuật quản lý môi trường ao nuôi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace: Sidebar + Chat Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Backdrop when Sidebar is Open */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar: Chat History */}
        <aside
          className={`${
            sidebarOpen ? "w-72 border-r" : "w-0 border-r-0"
          } max-md:absolute max-md:inset-y-0 max-md:left-0 max-md:z-30 max-md:shadow-2xl md:relative flex flex-col border-slate-200 bg-white transition-all duration-300 shrink-0 overflow-hidden select-none`}
        >
          <div className="w-72 flex flex-col h-full shrink-0">
            {/* New Chat Button */}
            <div className="p-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => handleCreateNewSession()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:from-cyan-700 hover:to-teal-700 transition active:scale-[0.98]"
              >
                <span>➕</span> Đoạn chat mới
              </button>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {isLoadingSessions ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  <Spinner className="h-5 w-5 mx-auto mb-2 text-cyan-500" />
                  Đang tải lịch sử...
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  Chưa có cuộc trò chuyện nào. Bấm nút phía trên để bắt đầu!
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => selectSession(session.id)}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs cursor-pointer transition ${
                      activeSessionId === session.id
                        ? "bg-cyan-50/80 text-cyan-800 font-bold border border-cyan-200/60 shadow-xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1 mr-1">
                      <span className="text-sm shrink-0">💬</span>
                      <span className="truncate">{session.title}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => openDeleteModal(e, session)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                      title="Xóa đoạn chat này"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex flex-1 min-w-0 flex-col overflow-hidden bg-white">
          {/* Error Banner */}
          {error && (
            <div className="mx-4 mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-rose-500 font-bold hover:text-rose-800"
              >
                ✕
              </button>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-3xl mx-auto w-full space-y-4">
              {isLoadingMessages ? (
                <div className="flex h-64 items-center justify-center">
                  <Spinner className="h-7 w-7 text-cyan-600" />
                </div>
              ) : messages.length === 0 ? (
                /* Welcome Hero & Prompt Suggestions */
                <div className="flex flex-col items-center justify-center max-w-xl mx-auto text-center py-10">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-cyan-100 to-sky-100 text-cyan-600 text-3xl shadow-inner mb-4">
                    🦐
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Xin chào! Tôi là Trợ lý AI Thủy sản shrimpAI
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-md">
                    Bạn có thể hỏi tôi bất kỳ điều gì về giống tôm thẻ, tôm sú, tôm càng xanh,
                    chẩn đoán bệnh học, hoặc kỹ thuật quản lý môi trường nước ao nuôi.
                  </p>

                  {/* Suggestions Grid */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                    {SUGGESTIONS.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (!activeSessionId) {
                            handleCreateNewSession(sug.prompt);
                          } else {
                            sendMessageToSession(activeSessionId, sug.prompt);
                          }
                        }}
                        className="group flex flex-col p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-cyan-400 hover:bg-cyan-50/30 hover:shadow-sm transition duration-200"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{sug.icon}</span>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-cyan-800 transition">
                            {sug.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {sug.prompt}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Message Bubbles */
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-100 text-cyan-700 text-lg shadow-xs">
                        🦐
                      </div>
                    )}

                    <div
                      className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed shadow-xs ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-medium"
                          : "bg-slate-50/90 text-slate-800 border border-slate-200/80"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div>{renderFormattedMessage(msg.content)}</div>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-200 text-slate-700 font-bold text-xs shadow-xs">
                        Tôi
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* AI Typing Indicator */}
              {isSending && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-100 text-cyan-700 text-lg">
                    🦐
                  </div>
                  <div className="rounded-2xl border border-cyan-200 bg-cyan-50/50 px-4 py-3 text-xs text-cyan-800 flex items-center gap-2">
                    <Spinner className="h-4 w-4 text-cyan-600" />
                    <span className="font-semibold">shrimpAI đang xử lý câu trả lời...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
            <div className="max-w-3xl mx-auto flex items-end gap-2 rounded-2xl border border-slate-300 bg-slate-50/60 p-2 focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-cyan-500/20 transition shadow-inner">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi về giống tôm, bệnh học hoặc môi trường nước ao nuôi... (Enter để gửi)"
                rows={1}
                className="flex-1 max-h-36 resize-none bg-transparent p-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none leading-relaxed"
                style={{
                  minHeight: "40px",
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputText.trim() || isSending}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm hover:from-cyan-700 hover:to-teal-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                title="Gửi câu hỏi"
              >
                {isSending ? (
                  <Spinner className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-sm">➤</span>
                )}
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-400">
              shrimpAI có thể mắc lỗi. Hãy kiểm tra các thông tin quan trọng.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {sessionToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
          onClick={() => !isDeletingSession && setSessionToDelete(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md rounded-2xl sm:rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Xóa đoạn chat?
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hành động này sẽ xóa <strong className="font-semibold text-slate-900">{sessionToDelete.title}</strong>.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeletingSession}
                onClick={() => setSessionToDelete(null)}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isDeletingSession}
                onClick={confirmDeleteSession}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#e01e37] hover:bg-[#c9182b] px-5 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                {isDeletingSession && <Spinner className="h-3 w-3 text-white" />}
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
