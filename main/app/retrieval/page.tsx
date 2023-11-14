import { ChatWindow } from "@/components/ChatWindow";

export default function AgentsPage() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl">
        🤖 Beep Boop Ask Me Anything
      </h1>
    </div>
  );
  return (
    <ChatWindow
      endpoint="api/chat/retrieval"
      emptyStateComponent={InfoCard}
      showIngestForm={true}
      placeholder={
        'What can I help you with?'
      }
      emoji="🤖"
      titleText="Bob the Document-Retrieving Robot"
    ></ChatWindow>
  );
}
