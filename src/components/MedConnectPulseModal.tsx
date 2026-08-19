import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Paperclip,
  Info,
  RotateCcw,
  Bot,
  User,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Apple,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';
import { PulseMessage } from '../types';

interface MedConnectPulseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOffline?: boolean;
}

export const MedConnectPulseModal: React.FC<MedConnectPulseModalProps> = ({
  isOpen,
  onClose,
  isOffline = false,
}) => {
  const [messages, setMessages] = useState<PulseMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load acceptance state & initial messages
  useEffect(() => {
    const accepted = localStorage.getItem('medconnect_pulse_disclaimer_accepted');
    if (!accepted) {
      setShowDisclaimerModal(true);
    } else {
      setHasAcceptedDisclaimer(true);
    }

    const savedChat = localStorage.getItem('medconnect_pulse_history');
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch (e) {
        setMessages(getInitialWelcomeMessages());
      }
    } else {
      setMessages(getInitialWelcomeMessages());
    }
  }, []);

  // Save chat history locally
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('medconnect_pulse_history', JSON.stringify(messages.slice(-20)));
    }
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function getInitialWelcomeMessages(): PulseMessage[] {
    return [
      {
        id: 'msg_welcome',
        sender: 'pulse',
        text: "Hello! I am MedConnect Pulse, your AI health guidance companion. How can I assist you today? You can ask me about medical terms, symptom guidance, prescription explanations, first-aid steps, or upload a lab report/prescription image for instant explanation.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  }

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('medconnect_pulse_disclaimer_accepted', 'true');
    setHasAcceptedDisclaimer(true);
    setShowDisclaimerModal(false);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if ((!textToSend.trim() && !selectedImage) || isLoading) return;

    if (isOffline) {
      const offlineMsg: PulseMessage = {
        id: `msg_${Date.now()}`,
        sender: 'pulse',
        text: 'MedConnect Pulse AI requires an active internet connection to process queries. Please reconnect to the internet and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, offlineMsg]);
      return;
    }

    const userMessage: PulseMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      imageUrl: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    const imagePayload = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const apiHistory = messages.map((m) => ({
        role: m.sender,
        text: m.text,
      }));

      const savedSecretKey = localStorage.getItem('medconnect_custom_api_key') || undefined;

      const res = await fetch('/api/pulse/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          imageBase64: imagePayload,
          history: apiHistory,
          customApiKey: savedSecretKey,
        }),
      });

      const data = await res.json();

      const pulseMessage: PulseMessage = {
        id: `msg_pulse_${Date.now()}`,
        sender: 'pulse',
        text: data.text || 'I apologize, but I could not generate a response. Please rephrase your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, pulseMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'pulse',
          text: 'Sorry, I encountered a temporary network issue connecting to the AI engine. Please check your internet connection and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser version. Please type your message.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Please upload an image smaller than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearHistory = () => {
    if (confirm('Clear current MedConnect Pulse conversation history?')) {
      const init = getInitialWelcomeMessages();
      setMessages(init);
      localStorage.removeItem('medconnect_pulse_history');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      {/* Modal Card */}
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-teal-700 via-teal-600 to-sky-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-teal-200 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg font-display tracking-tight leading-tight">MedConnect Pulse</h3>
                <span className="text-[10px] bg-teal-800/80 text-teal-100 font-semibold px-2 py-0.5 rounded-full border border-teal-400/30">
                  AI Guidance
                </span>
              </div>
              <p className="text-xs text-teal-100 font-medium">Educational Healthcare Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDisclaimerModal(true)}
              className="p-2 rounded-lg hover:bg-white/10 text-teal-100 hover:text-white transition-colors"
              title="Medical Disclaimer & Information"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-lg hover:bg-white/10 text-teal-100 hover:text-white transition-colors"
              title="Clear Chat History"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-teal-100 hover:text-white transition-colors"
              aria-label="Close Pulse AI"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Topics Ribbon */}
        <div className="px-3 py-2 bg-teal-50/80 dark:bg-slate-800/60 border-b border-teal-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-teal-900 dark:text-teal-200 shrink-0 uppercase tracking-wider flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" /> Quick Topics:
          </span>
          <button
            onClick={() => handleSendMessage('Explain how to read blood pressure values and what hypertension means.')}
            className="shrink-0 px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 text-teal-800 dark:text-teal-300 rounded-lg hover:bg-teal-100 transition-colors font-medium flex items-center gap-1"
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" /> Explain Blood Pressure
          </button>
          <button
            onClick={() => handleSendMessage('What is the first-aid response for minor thermal burns?')}
            className="shrink-0 px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 text-teal-800 dark:text-teal-300 rounded-lg hover:bg-teal-100 transition-colors font-medium flex items-center gap-1"
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" /> First Aid Guidance
          </button>
          <button
            onClick={() => handleSendMessage('Explain common terms found on prescription slips like "QDS", "BD", "OD", and "PRN".')}
            className="shrink-0 px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 text-teal-800 dark:text-teal-300 rounded-lg hover:bg-teal-100 transition-colors font-medium flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" /> Prescription Terms
          </button>
          <button
            onClick={() => handleSendMessage('Give me 5 dietary tips to help manage cholesterol levels naturally.')}
            className="shrink-0 px-2.5 py-1 text-xs bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700 text-teal-800 dark:text-teal-300 rounded-lg hover:bg-teal-100 transition-colors font-medium flex items-center gap-1"
          >
            <Apple className="w-3.5 h-3.5 text-emerald-600" /> Nutrition Guidance
          </button>
        </div>

        {/* Chat Stream Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white'
                    : 'bg-teal-600 text-white shadow-sm'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                }`}
              >
                {msg.imageUrl && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                    <img src={msg.imageUrl} alt="Uploaded report preview" className="max-h-48 w-full object-cover" />
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-2 text-right ${
                    msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-2">
                  MedConnect Pulse is thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Selected Image Preview Bar */}
        {selectedImage && (
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                Medical Report / Image Attached
              </span>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-amber-800 hover:text-amber-950 dark:text-amber-300 text-xs font-bold underline"
            >
              Remove
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
              title="Upload lab report or prescription image"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
              title={isListening ? 'Listening...' : 'Voice Input'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening to speech...'
                  : 'Ask MedConnect Pulse or describe your symptom...'
              }
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm px-4 py-2.5 rounded-xl border-none focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading || (!inputPrompt.trim() && !selectedImage)}
              className="p-2.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shrink-0 shadow-sm"
              aria-label="Send query"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-[10px] text-slate-400 font-medium">
              Educational Guidance Only • Non-Diagnostic
            </span>
            <button
              onClick={() => setShowDisclaimerModal(true)}
              className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline font-semibold"
            >
              View Full Disclaimer
            </button>
          </div>
        </div>
      </div>

      {/* Permanent Information & Disclaimer Modal */}
      {showDisclaimerModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display">
                Important Medical Disclaimer
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>MedConnect Pulse</strong> is an AI-powered educational healthcare companion built on Google Gemini technology.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl text-xs space-y-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>MedConnect Pulse provides educational information and general health guidance only.</p>
              </div>
              <div className="flex items-start gap-2">
                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p>MedConnect Pulse does NOT diagnose diseases, prescribe treatments, or guarantee medical outcomes.</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p>For medical emergencies, please tap the SOS button or call 112 / 108 immediately.</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleAcceptDisclaimer}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
