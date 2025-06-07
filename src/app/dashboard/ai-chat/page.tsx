'use client'

import { useState } from 'react'
import { PaperAirplaneIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface Message {
  id: number
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your AI assistant. How can I help you with your local events and creators today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    // TODO: Implement AI response
    // For now, just echo back
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        content: `I received your message: "${input}"`,
        sender: 'ai',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <header className="shadow" style={{ backgroundColor: 'var(--background)' }}>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">AI Chat Assistant</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* AI Panel */}
            <div className="mb-10 rounded-xl p-6 shadow flex flex-col md:flex-row gap-6 items-center" style={{ backgroundColor: 'var(--background)' }}>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-primary mb-2">Blitz AI: Find the Best Local Sponsorships</h2>
                <p className="text-gray-700 mb-2">Let Blitz AI analyze local events, influencers, and organizations for you. Instantly see risk assessment, alignment with your business, and key metrics to help you make the right choice.</p>
                <ul className="text-sm text-gray-700 mb-2 list-disc ml-5">
                  <li>Risk Assessment: <span className="font-semibold">Low, Medium, High</span> (based on verification, engagement, reviews)</li>
                  <li>Alignment: <span className="font-semibold">Community fit, audience match, brand values</span></li>
                  <li>ROI & Impact: <span className="font-semibold">Estimated reach, engagement, and local impact</span></li>
                  <li>AI Pros & Cons: <span className="font-semibold">Quick summary for each listing</span></li>
                  <li>Tax Automation: <span className="font-semibold">Easily track sponsorships for write-offs</span></li>
                </ul>
                <button className="mt-2 rounded px-4 py-2 text-white font-semibold hover:opacity-90" style={{ backgroundColor: 'var(--primary)' }}>Let AI Suggest Opportunities</button>
              </div>
            </div>

            <div className="rounded-lg shadow h-[calc(100vh-16rem)] flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === 'user'
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                      style={{ backgroundColor: message.sender === 'user' ? 'var(--primary)' : undefined }}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 