export default function Home() {
  
  return (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">
        Instructions 📝
      </h1>
      <ul>
        <li className="text-l">
          🤝
          <span className="ml-2">
          Here&apos;s your document assistant: Upload, receive quick answers with a whimsical touch 📁✨
          </span>
        </li>
        <li className="text-l">
          ✨
          <span className="ml-2">
          Made with{" "}
            <a href="https://js.langchain.com/" target="_blank">
              LangChain.js
            </a>{" "}
            and the Vercel{" "}
            <a href="https://sdk.vercel.ai/docs" target="_blank">
              AI SDK
            </a>{" "}
            in a{" "}
            <a href="https://nextjs.org/" target="_blank">
              Next.js
            </a>{" "}
            project.
          </span>
        </li>
        <li className="hidden text-l md:block">
          💻
          <span className="ml-2">
          By default, the assistant remembers everything, well... For a fresh start, click <code>Reset</code> and give your assistant a brain reboot! 🧠🔄🤖 
          </span>
        </li>
        <li className="text-l">
          🐙
          <span className="ml-2">
            Supported file extensions: 
          </span>
        </li>
      </ul>
    </div>
  );
}
