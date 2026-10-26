// Copy for the website assistant (src/components/chat-widget.tsx).
export const assistantContent = {
  launcher: "Ask Genesis Mesh",
  title: "Genesis Mesh assistant",
  subtitle: "Answers from this site and the docs",
  welcome:
    "Hi! I answer questions about Genesis Mesh: how it works, the SDKs, the gateway, the MCP server, and the documentation. I can also pass a message to the team.",
  suggestions: ["What is Genesis Mesh?", "How do I get started?", "Which SDK should I use?", "Contact the team"],
  placeholder: "Ask about Genesis Mesh…",
  send: "Send",
  close: "Close the assistant",
  reset: "Start a new conversation",
  resetConfirm: "Press again to clear the conversation",
  thinking: "Thinking",
  still: "Still working on it…",
  privacy:
    "AI answers can be wrong: check the linked docs. Messages are processed by Azure OpenAI and are not stored by this site unless you send an inquiry.",
  errors: {
    busy: "Too many messages right now. Please wait a few minutes and try again.",
    offline: "You seem to be offline. Check your connection and try again.",
    other: "Something went wrong on our side. Please try again in a moment.",
    retry: "Try again",
  },
  summary: {
    title: "Your inquiry",
    fields: { topic: "Topic", message: "Message", name: "Name", email: "Email", organization: "Organization" },
    confirm: "Confirm and send",
    change: "Change something",
    changeText: "Please change ",
    note: "Nothing is sent until you confirm. The team replies to the email above.",
    sent: "Sent to the Genesis Mesh team",
    sentReply: "Thank you, your inquiry is on its way to the Genesis Mesh team. They will reply by email. Anything else about Genesis Mesh?",
    expired: "That summary has expired. Tell me to show it again and I will prepare a new one.",
  },
} as const;
