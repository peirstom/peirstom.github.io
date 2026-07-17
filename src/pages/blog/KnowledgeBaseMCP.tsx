import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. The Problem: Context Is Scattered",
    body: [
      <>Every engineer I know has hit the same wall. The information you need to do your job well is <strong>spread across half a dozen systems</strong>. Architecture decisions live in Confluence. Day-to-day notes are in Notion. The actual behaviour of your platform is described in code, scattered across dozens of repositories. Infrastructure is defined in Terraform modules. The deeper a company grows in maturity and team size, the worse this gets. The chain of information becomes longer, the dependencies between systems grow, and no single person holds the whole picture in their head anymore.</>,
      <>This is a knowledge-sharing problem first and a tooling problem second. As tasks become more complex, the cost of <strong>reconstructing context</strong> before you can even start working balloons. You spend the first hour of a task hunting for the one Confluence page, the one Terraform module, the one pipeline definition that explains how the thing actually works.</>,
      <>When you bring AI tools and agents into that workflow, the problem sharpens into focus. <strong>The quality of an agent's output is only ever as good as the context you feed it.</strong> A brilliant model with no context produces confident, plausible, wrong answers. In my experience this is exactly where engineers struggle with AI: not with the prompting, but with assembling the right context to prompt <em>against</em>.</>,
    ],
    highlights: [
      "Information scatter scales with company maturity: more systems, longer chains, more cross-references no individual fully holds.",
      "Confluence, Notion, code repositories, and Terraform modules each hold a different slice of the truth.",
      "AI output is bounded by input context: a strong model with poor context still produces poor results.",
    ],
  },
  {
    title: "2. Why I Built This — and Where Engineering Is Heading",
    body: [
      <>I have a strong opinion about where this profession is going. I believe <strong>the future of engineering lies in fully understanding the business problem and architecting the solution through AI</strong>, rather than hand-developing every requirement line by line. That shift pushes engineers into roles that go well beyond what we knew a few years ago. We increasingly <strong>own our solutions end-to-end</strong>, taking on work that sits between traditional engineering and product ownership, and being accountable for the whole arc from problem to running system.</>,
      <>You can't own something end-to-end if you can only see one slice of it. So my goal was concrete: build a single source of context, a <strong>knowledge-base MCP</strong>, that gives me, and the AI agents I work with, a full overview of everything I need to be effective. Not another dashboard to check, but a layer my agent can query directly, in the flow of work.</>,
      <>The build broke down into three parts, in increasing order of difficulty. <strong>One</strong>: build a functional MCP server. <strong>Two</strong>: gather, clean, structure, and index the context into something the MCP can search. <strong>Three</strong>: deploy it, make it accessible to others, and keep it continuously up to date. The rest of this post walks through each.</>,
    ],
    highlights: [
      "The thesis: engineers architect solutions through AI and own them end-to-end, blending engineering with product ownership.",
      "End-to-end ownership requires end-to-end context, which is what the MCP exists to provide.",
      "Three parts: build the server, build the indexed knowledge base, deploy and keep it fresh.",
    ],
  },
  {
    title: "3. Part One — Building the MCP Server",
    body: [
      <>Building an MCP is arguably the <strong>easiest</strong> part of the whole project. The Model Context Protocol has a clean specification and there are plenty of guides, so I won't belabour it. I built mine in <strong>Python</strong>, a language I'm comfortable in, which means it can run locally during development and deploy unchanged to AWS, Vercel, or wherever you like.</>,
      <>The core is small: you expose a set of <strong>tools</strong> the agent can call. In my case the headline tool is a semantic search over the knowledge base. The MCP SDK handles the protocol plumbing; you focus on the tool logic.</>,
    ],
    code: [
      {
        label: "server.py — a minimal MCP server with one search tool",
        content: `from mcp.server.fastmcp import FastMCP

mcp = FastMCP("engineering-context")

@mcp.tool()
def search_knowledge(query: str, top_k: int = 5) -> list[dict]:
    """Semantic search across pipelines, Terraform modules and docs.

    Returns the most relevant chunks of context for a natural-language
    question, each with its source so the agent can cite where it came from.
    """
    hits = vector_store.similarity_search(query, k=top_k)
    return [
        {"source": h.metadata["source"], "text": h.page_content}
        for h in hits
    ]

if __name__ == "__main__":
    mcp.run()`,
      },
    ],
    highlights: [
      "Python keeps the server portable: run it locally, then deploy the same code to AWS or Vercel.",
      "An MCP server is just a set of tools; here the key tool is a semantic search that returns context plus its source.",
      "Returning the source with every hit lets the agent cite where an answer came from, which builds trust in the output.",
    ],
  },
  {
    title: "4. Part Two — Gathering and Indexing the Context",
    body: [
      <>This is where the real work lives. My knowledge base spans <strong>three domains</strong>, each a different shape of information. <strong>First, the CI/CD pipelines.</strong> I cloned the full pipeline template repository. The README files matter, but the <strong>code is the source of truth</strong>. It's the definitive description of what the pipelines support and how they behave, far more reliable than any prose written about them.</>,
      <><strong>Second, Terraform.</strong> I have over fifty repositories, each representing a single Terraform module with its own purpose, configuration, and structure. This is how mature organisations manage infrastructure as code: a fully automated pipeline composes these modules to describe the desired state of the platform. Indexing them means my agent can reason about real infrastructure instead of guessing. <strong>Third, Confluence</strong>: the documentation and free-text layer, the human-written context around everything else.</>,
      <>To make all of this searchable I wrote straightforward Python to index it into a <strong>vector store</strong>. This is the heart of <strong>Retrieval-Augmented Generation (RAG)</strong>: rather than fine-tuning a model on your data, you store your knowledge as embeddings (numerical vectors that capture meaning), and at query time you retrieve the most semantically similar pieces and hand them to the model as context. The model stays general; the knowledge stays external, current, and swappable.</>,
      <>Two details make or break retrieval quality: <strong>chunking</strong> and <strong>embeddings</strong>. You can't embed a whole repository as one vector; you split documents and code into coherent <strong>chunks</strong> (a function, a section, a module block), embed each chunk, and store it with metadata pointing back to its source. Chunk too large and retrieval gets noisy; too small and you lose context. The embedding model then decides how well "meaning" is captured.</>,
    ],
    code: [
      {
        label: "index.py — chunk, embed, and store the three domains",
        content: `from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,        # tune per domain: code vs prose differ
    chunk_overlap=150,      # overlap keeps context across chunk borders
)

documents = []
for source in ["pipeline-templates", "terraform-modules", "confluence-export"]:
    for path, text in load_files(source):
        for chunk in splitter.split_text(text):
            documents.append({"text": chunk, "source": f"{source}:{path}"})

store = FAISS.from_texts(
    texts=[d["text"] for d in documents],
    embedding=embeddings,                 # see model note below
    metadatas=[{"source": d["source"]} for d in documents],
)
store.save_local("knowledge-base")`,
      },
    ],
    highlights: [
      "Three domains: pipeline templates (code is the source of truth), 50+ single-purpose Terraform modules, and Confluence docs.",
      "RAG keeps knowledge external and current: you re-index instead of re-training when the source changes.",
      "Chunk size and overlap are the levers: too big is noisy, too small loses context. Tune them per domain.",
      "Every chunk carries metadata back to its origin so retrieved context is always traceable.",
    ],
  },
  {
    title: "5. Choosing the Embedding Model",
    body: [
      <>The quality of retrieval depends directly on the embedding model you choose. I started with <strong>open-source LLMs running locally</strong>, and I'd recommend anyone begin there. The reasons are practical: <strong>data privacy and control</strong> (nothing leaves your machine), it's <strong>free</strong>, and with the right configuration it runs entirely on CPU. Hugging Face has a good overview of capable models you can run locally, which is where I'd point anyone starting out.</>,
      <>Ultimately I switched to the <strong>Amazon Titan</strong> embedding model. Not because the open-source options were inadequate, but because I'd decided to deploy the whole thing inside the <strong>AWS ecosystem</strong>, and staying in-ecosystem simplified everything downstream. Titan is not free, but the cost is <strong>extremely low</strong> for this workload. The real driver was curiosity: I wanted to learn <strong>Amazon Bedrock AgentCore</strong>, AWS's managed runtime for deploying and hosting agents and MCP servers, which brings memory, scaling, and access control as built-in features rather than things you assemble yourself.</>,
    ],
    highlights: [
      "Start with local open-source models: private, free, CPU-friendly, and zero lock-in while you iterate.",
      "I moved to Amazon Titan purely to stay within the AWS ecosystem I was deploying into, at very low cost.",
      "The switch was curiosity-driven (learning Bedrock AgentCore), not a technical necessity.",
    ],
  },
  {
    title: "6. Part Three — Deployment and Keeping It Fresh",
    body: [
      <>A knowledge base is only useful if it reflects reality. The hardest part of part three was making the thing <strong>continuously current</strong> without manual effort. I used a <strong>GitLab pipeline that re-indexes every Sunday</strong>. If someone changed an infrastructure repo, a Terraform module, or a pipeline definition during the week, the next run picks it up and the dataset reflects it. No one has to remember to refresh anything.</>,
      <>I deployed the MCP itself on <strong>Bedrock AgentCore</strong>, but ran into a size limitation: the dataset is large and AgentCore caps how much you can bundle with the runtime. The fix was to <strong>decouple the data from the server</strong>. The weekly pipeline pushes the freshly built vector store to <strong>S3</strong>, and the MCP fetches it from there. To avoid re-downloading unnecessarily, I track a <strong>manifest file</strong> with update timestamps. When the MCP spins up or refreshes its connection, it checks the manifest and only pulls new data when something has changed.</>,
      <>Finally, access. To let others connect securely I put an <strong>AWS Cognito user pool</strong> in front of the MCP. Each engineer connects as an identity and authenticates with a <strong>bearer token</strong>, so the knowledge base isn't just mine, it's a shared, authenticated resource the whole team can query.</>,
    ],
    code: [
      {
        label: "manifest.json — timestamp tracking so refreshes only pull changed data",
        content: `{
  "version": "2026-06-08T03:00:00Z",
  "sources": {
    "pipeline-templates":  { "indexed_at": "2026-06-08T03:00:00Z", "chunks": 1840 },
    "terraform-modules":   { "indexed_at": "2026-06-08T03:00:00Z", "chunks": 9120 },
    "confluence-export":   { "indexed_at": "2026-06-08T03:00:00Z", "chunks": 4275 }
  },
  "artifact": "s3://eng-knowledge-base/index/2026-06-08.faiss"
}`,
      },
      {
        label: ".gitlab-ci.yml — weekly scheduled re-index and S3 publish",
        content: `reindex:
  image: python:3.12-slim
  rules:
    - if: '$CI_PIPELINE_SOURCE == "schedule"'   # scheduled every Sunday
  script:
    - pip install -r requirements.txt
    - python index.py                            # rebuild the vector store
    - python write_manifest.py                   # stamp timestamps + chunk counts
    - aws s3 sync ./knowledge-base s3://eng-knowledge-base/index/`,
      },
    ],
    highlights: [
      "A scheduled Sunday GitLab pipeline re-indexes automatically, so the dataset always trails the real repos by at most a week.",
      "Decoupling data to S3 sidesteps the AgentCore bundle-size cap and lets the server stay lightweight.",
      "A manifest with timestamps means the MCP only re-downloads when data actually changed.",
      "AWS Cognito with bearer tokens turns a personal tool into a shared, authenticated team resource.",
    ],
  },
  {
    title: "7. What It Solved",
    body: [
      <>The problem I set out to fix was specific and personal: my AI companion <strong>started every session knowing nothing</strong>. No context about our pipelines, our infrastructure, or the decisions behind them. Just a blank slate, every single time. The MCP closes that gap. Now the agent has <strong>full context from the first message</strong>, drawn live from the systems where the truth actually lives.</>,
      <>The payoff was bigger than I expected. The MCP could surface answers stitched together from <strong>information scattered across completely different systems</strong>, connecting a Terraform module to the pipeline that deploys it to the Confluence page that explains why, and present the connected picture. My workflow improved enormously: the <strong>quality of generated code went up</strong>, <strong>token usage went down</strong> (because context is retrieved precisely instead of pasted wholesale), and along the way I <strong>learned an enormous amount</strong> about RAG, embeddings, and the AWS agent stack.</>,
      <>If there's one takeaway, it's this: as engineering shifts toward architecting solutions through AI, the leverage isn't in better prompts — it's in <strong>better context</strong>. Build the layer that gives your agents the full picture, and everything downstream gets sharper.</>,
    ],
    highlights: [
      "The core win: no more cold-start sessions. The agent has full, current context from the first message.",
      "Connecting scattered systems into one queryable layer is what unlocked the biggest workflow gains.",
      "Higher code quality, lower token usage, and a steep personal learning curve across RAG and the AWS agent stack.",
    ],
  },
];

const KnowledgeBaseMCP = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">Writing · AI · MCP</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Building a Knowledge-Base MCP for Engineering Context</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            An AI agent is only as good as the context you give it, yet in any mature company that context is scattered across
            Confluence, Notion, dozens of code repositories, and Terraform modules. Here's how I built a knowledge-base MCP that
            indexes all of it into a vector store, deploys on AWS Bedrock AgentCore, and refreshes itself automatically, so my
            agent never starts from zero again.
          </p>
        </div>

        <div className="space-y-12 text-lg leading-relaxed text-muted-foreground">
          {sections.map((section) => (
            <section key={section.title} className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
              {section.body.map((paragraph, idx) => (
                <p key={idx} className="font-light">
                  {paragraph}
                </p>
              ))}
              {section.code?.map((snippet) => (
                <figure key={snippet.label} className="space-y-2">
                  <figcaption className="font-sans text-xs uppercase tracking-wide text-muted-foreground">
                    {snippet.label}
                  </figcaption>
                  <pre className="bg-muted rounded-xl p-5 border border-border/60 overflow-x-auto text-sm">
                    <code className="font-mono text-foreground">{snippet.content}</code>
                  </pre>
                </figure>
              ))}
              <div className="bg-muted rounded-xl p-5 border border-border/60">
                <p className="font-semibold text-sm uppercase tracking-wide text-foreground mb-3">Field Notes</p>
                <ul className="list-disc list-inside space-y-2 text-sm font-light">
                  {section.highlights.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 flex justify-between items-center border-t border-border pt-8">
          <Link to="/" className="font-sans text-sm text-primary underline hover:text-primary/80">
            ← Back to homepage
          </Link>
          <a href="mailto:peirstom@gmail.com" className="font-sans text-sm text-foreground hover:text-primary transition-colors">
            Talk context engineering →
          </a>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseMCP;
