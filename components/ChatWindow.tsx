
import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage, UserRole } from '../types';
import { storage } from '../utils/storage';
import { Send, Paperclip, FileText, CheckCircle2, User as UserIcon, X, Download, MessageSquare, Play, Maximize2 } from 'lucide-react';

const ChatWindow: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | 'global' | null>('global');
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<{name: string, data: string, size: number, type: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadData = () => {
    setMessages(storage.getMessages());
    const allUsers = storage.getUsers().filter(u => u.id !== currentUser.id);
    setContacts(allUsers);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage_update', loadData);
    return () => window.removeEventListener('storage_update', loadData);
  }, [currentUser.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, selectedContact]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 100 * 1024 * 1024) return alert("Fichier trop lourd (Max 100MB)");
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFile({ name: f.name, data: ev.target?.result as string, size: f.size, type: f.type });
      };
      reader.readAsDataURL(f);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim() && !file) return;
    const toId = selectedContact === 'global' ? 'global' : selectedContact?.id;
    if (!toId) return;

    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      fromId: currentUser.id,
      toId,
      text: inputText,
      fileName: file?.name,
      fileData: file?.data,
      fileType: file?.type,
      fileSize: file?.size,
      createdAt: new Date().toISOString()
    };

    const all = storage.getMessages();
    storage.saveMessages([...all, newMessage]);
    setInputText('');
    setFile(null);
  };

  const chatMessages = messages.filter(m => {
    if (selectedContact === 'global') return m.toId === 'global';
    const contactId = selectedContact?.id;
    return (m.fromId === currentUser.id && m.toId === contactId) || 
           (m.fromId === contactId && m.toId === currentUser.id);
  });

  const renderFilePreview = (m: ChatMessage) => {
    if (!m.fileData) return null;

    if (m.fileType?.startsWith('image/')) {
      return (
        <div className="mt-3 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg group relative">
          <img src={m.fileData} alt={m.fileName} className="w-full max-h-64 object-cover" />
          <a href={m.fileData} download={m.fileName} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
             <Download className="text-white" size={32} />
          </a>
        </div>
      );
    }

    if (m.fileType?.startsWith('video/')) {
      return (
        <div className="mt-3 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg bg-black/10">
          <video controls className="w-full max-h-64">
            <source src={m.fileData} type={m.fileType} />
            Votre navigateur ne supporte pas la vidéo.
          </video>
        </div>
      );
    }

    return (
      <div className={`mt-3 p-4 rounded-2xl flex items-center gap-4 ${m.fromId === currentUser.id ? 'bg-white/10' : 'bg-gray-50'}`}>
        <FileText size={24} className={m.fromId === currentUser.id ? 'text-white' : 'text-ivoryOrange'} />
        <div className="flex-grow overflow-hidden">
          <p className="text-xs font-black truncate">{m.fileName}</p>
          <p className="text-[9px] font-bold opacity-60 uppercase">{(m.fileSize! / (1024*1024)).toFixed(2)} MB</p>
        </div>
        <a href={m.fileData} download={m.fileName} className="p-2 hover:bg-black/5 rounded-lg transition-all"><Download size={16}/></a>
      </div>
    );
  };

  return (
    <div className="flex bg-white rounded-[48px] shadow-2xl border border-gray-100 overflow-hidden h-[700px] animate-in slide-in-from-right duration-500">
      <div className="w-80 border-r border-gray-50 flex flex-col">
        <div className="p-8 border-b bg-gray-50/50">
           <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Contacts</h3>
        </div>
        <div className="flex-grow overflow-y-auto">
          <button onClick={() => setSelectedContact('global')} className={`w-full p-6 text-left flex items-center gap-4 border-b border-gray-50 transition-all ${selectedContact === 'global' ? 'bg-ivoryGreen text-white' : 'hover:bg-gray-50'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${selectedContact === 'global' ? 'bg-white/20' : 'bg-ivoryOrange text-white'}`}>@</div>
            <div>
              <p className="font-black text-sm">Général</p>
              <p className={`text-[10px] uppercase font-bold ${selectedContact === 'global' ? 'text-white/60' : 'text-gray-400'}`}>Chat plateforme</p>
            </div>
          </button>
          {contacts.map(u => (
            <button key={u.id} onClick={() => setSelectedContact(u)} className={`w-full p-6 text-left flex items-center gap-4 border-b border-gray-50 transition-all ${selectedContact !== 'global' && selectedContact?.id === u.id ? 'bg-ivoryGreen text-white' : 'hover:bg-gray-50'}`}>
              <img src={u.avatar} className="w-12 h-12 rounded-2xl object-cover" />
              <div>
                <p className="font-black text-sm">{u.firstName} {u.name}</p>
                <p className={`text-[10px] uppercase font-bold ${selectedContact !== 'global' && selectedContact?.id === u.id ? 'text-white/60' : 'text-gray-400'}`}>{u.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow flex flex-col bg-gray-50/30 relative">
        {selectedContact ? (
          <>
            <div className="p-8 bg-white border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedContact === 'global' ? (
                  <div className="w-12 h-12 rounded-2xl bg-ivoryOrange flex items-center justify-center text-white font-black">@</div>
                ) : (
                  <img src={selectedContact.avatar} className="w-12 h-12 rounded-2xl object-cover" />
                )}
                <div>
                  <h4 className="font-black text-gray-900">{selectedContact === 'global' ? 'Discussion Générale' : `${selectedContact.firstName} ${selectedContact.name}`}</h4>
                  <p className="text-[10px] font-bold text-ivoryGreen uppercase tracking-widest">Connecté</p>
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-grow overflow-y-auto p-10 space-y-6">
              {chatMessages.map(m => (
                <div key={m.id} className={`flex ${m.fromId === currentUser.id ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[75%] p-5 rounded-[32px] shadow-sm ${m.fromId === currentUser.id ? 'bg-ivoryGreen text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none border border-gray-100'}`}>
                    {m.toId === 'global' && m.fromId !== currentUser.id && (
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-60 block mb-1">
                        {storage.getUsers().find(u => u.id === m.fromId)?.firstName || 'Utilisateur'}
                      </span>
                    )}
                    {m.text && <p className="font-medium text-sm leading-relaxed">{m.text}</p>}
                    {renderFilePreview(m)}
                    <span className="text-[8px] font-bold opacity-40 block text-right mt-1">{new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-white border-t space-y-4">
              {file && (
                <div className="flex items-center gap-4 bg-ivoryOrange/5 p-3 rounded-2xl border border-ivoryOrange/20 animate-in zoom-in">
                  <FileText className="text-ivoryOrange" />
                  <span className="flex-grow text-xs font-black truncate text-ivoryOrange">{file.name}</span>
                  <button onClick={() => setFile(null)} className="p-1 text-red-400"><X size={16}/></button>
                </div>
              )}
              <div className="flex gap-4">
                <div className="relative flex-grow">
                  <input value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Écrire un message..." className="w-full pl-6 pr-14 py-5 rounded-[32px] bg-gray-50 border-2 border-transparent focus:border-ivoryOrange focus:bg-white outline-none font-bold text-gray-900 transition-all shadow-sm" />
                  <label className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-ivoryOrange transition-all cursor-pointer">
                    <Paperclip size={20} />
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*,application/pdf,.doc,.docx" />
                  </label>
                </div>
                <button onClick={sendMessage} className="p-5 bg-ivoryGreen text-white rounded-[24px] shadow-xl hover:scale-110 active:scale-90 transition-all"><Send size={24} /></button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-300 p-20 text-center">
            <MessageSquare size={80} className="mb-6 opacity-10" />
            <h3 className="text-2xl font-black uppercase tracking-[0.3em]">Communication Directe</h3>
            <p className="font-bold mt-2">Échangez avec les professeurs ou les apprenants.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
