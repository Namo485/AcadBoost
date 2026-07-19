'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Link as LinkIcon, Loader2, Youtube } from 'lucide-react';
import { educhat, type EduChatOutput } from '@/ai/flows/educhat-flow';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  content: string | EduChatOutput;
};

// Chatbot Sevices 

export function EduChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput('');

    try {
      const response = await educhat({ query: input });
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        content: response,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('EduChat error:', error);
      const errorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        sender: 'bot',
        content: {
          answer: 'Sorry, I encountered an unexpected error. Please check the server console for details and try again later.',
          webLinks: [],
          youtubeSearchSuggestions: [],
        }
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const createYoutubeSearchUrl = (query: string) => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg" size="icon">
          <MessageSquare className="h-8 w-8" />
          <span className="sr-only">Open EduChat</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-headline">EduChat</SheetTitle>
          <SheetDescription>
            Your AI-powered learning assistant. Ask me anything!
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 my-4 pr-4">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.sender === 'bot' && (
                   <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">EC</AvatarFallback>
                    </Avatar>
                )}

                <div className={`max-w-xl rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {typeof message.content === 'string' ? (
                    <p>{message.content}</p>
                  ) : (
                    <div className="space-y-4">
                      <p>{message.content.answer}</p>
                      
                      {message.content.webLinks && message.content.webLinks.length > 0 && (
                         <div>
                           <Separator className="my-3 bg-muted-foreground/30" />
                          <h4 className="font-semibold flex items-center gap-2 mb-2"><LinkIcon className="h-4 w-4" /> Web Links</h4>
                          <ul className="space-y-1">
                            {message.content.webLinks.map((link, i) => (
                              <li key={i}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                  {link.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                       {message.content.youtubeSearchSuggestions && message.content.youtubeSearchSuggestions.length > 0 && (
                         <div>
                           <Separator className="my-3 bg-muted-foreground/30" />
                          <h4 className="font-semibold flex items-center gap-2 mb-2"><Youtube className="h-4 w-4" /> YouTube Suggestions</h4>
                          <ul className="space-y-1">
                            {message.content.youtubeSearchSuggestions.map((suggestion, i) => (
                              <li key={i}>
                                <a href={createYoutubeSearchUrl(suggestion)} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                  {suggestion}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                 {message.sender === 'user' && (
                   <Avatar className="h-8 w-8">
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                 <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">EC</AvatarFallback>
                </Avatar>
                <div className="max-w-xl rounded-lg p-3 bg-muted">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="mt-auto">
          <div className="flex w-full space-x-2">
            <Input
              type="text"
              placeholder="Ask about a topic..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
