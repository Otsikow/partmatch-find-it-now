import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  escalated?: boolean;
}

const PartMatchHelpBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm PartMatch HelpBot. I'm here to help you with questions about posting parts, requesting parts, fees, and how our platform works. What can I help you with today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('partmatch-helpbot', {
        body: {
          message: inputValue,
          userId: user?.id,
          conversationHistory
        }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        escalated: data.escalated
      };

      setMessages(prev => [...prev, botMessage]);

      if (data.escalated) {
        toast({
          title: "Escalated to Support",
          description: "I've notified our support team. You'll hear from them within 24 hours.",
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble right now. Please try again or contact support@partmatch.com for immediate help.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How do I post a part?",
    "How do I request a part?",
    "What are the fees?",
    "Why was my listing rejected?",
    "How do I contact a seller?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[500px] shadow-xl border-2 border-primary/20">
        <CardHeader className="bg-primary text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">PartMatch HelpBot</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-white/90">Get instant help 24/7</p>
        </CardHeader>

        <CardContent className="p-0 h-full flex flex-col">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <Bot className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.escalated && (
                      <div className="mt-2 text-xs opacity-75 flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Escalated to human support
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <User className="h-6 w-6 text-muted-foreground mt-1 flex-shrink-0" />
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <Bot className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Quick questions:</p>
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2 text-xs"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about PartMatch..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Need human help? Type "talk to support"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartMatchHelpBot;