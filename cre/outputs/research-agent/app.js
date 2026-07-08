const state = {
  depth: "fast",
  memories: JSON.parse(localStorage.getItem("atlasMemories") || "[]"),
  latestBrief: ""
};

const chainTemplates = {
  fast: [
    ["Intent parse", "Extract the business question, time horizon, and decision criteria."],
    ["Search map", "Split into market, user pain, competitor, risk, and pricing tracks."],
    ["Synthesis", "Rank patterns by confidence and strategic usefulness."],
    ["Brief", "Compress into decisions, evidence, and next experiments."]
  ],
  deep: [
    ["Intent parse", "Turn the request into hypotheses, exclusions, and evidence standards."],
    ["Query planner", "Generate entity, trend, and counterfactual search chains."],
    ["Source triage", "Score recency, credibility, originality, and disagreement."],
    ["Claim graph", "Link claims to citations and flag weak assumptions."],
    ["Synthesis", "Build a ranked answer with alternatives and risk notes."],
    ["Brief", "Export an executive memo with follow-up questions."]
  ],
  expert: [
    ["Intent parse", "Convert the question into a research contract with acceptance tests."],
    ["Agent routing", "Assign specialist passes for market, technical, legal, and monetization analysis."],
    ["Retrieval", "Run broad discovery, then focused retrieval against the strongest threads."],
    ["Verification", "Cross-check claim clusters and search for contradictory evidence."],
    ["Reasoning trace", "Separate known facts, model inferences, and speculative bets."],
    ["Strategy brief", "Produce recommendations, caveats, and experiments with confidence labels."],
    ["Memory writeback", "Save durable preferences and reusable source heuristics."]
  ]
};

const sourceBank = [
  ["Market reports", "Aggregated pricing, buyer language, and adoption signals from analyst-style summaries.", 92],
  ["Developer forums", "High-friction workflows: citation management, browsing reliability, private data connectors.", 88],
  ["Product changelogs", "Evidence of current feature velocity across AI workbench and agent products.", 84],
  ["Academic papers", "Grounding for retrieval, tool-use, long-context behavior, and evaluation methods.", 90],
  ["Security guidance", "Risk patterns around prompt injection, data retention, and autonomous action boundaries.", 86],
  ["Founder interviews", "Monetization clues from teams selling vertical AI assistants and research copilots.", 79]
];

const defaults = [
  "Prefer concrete source quality over volume.",
  "Flag assumptions separately from verified evidence.",
  "Write briefs in decision-ready language."
];

const $ = (selector) => document.querySelector(selector);

function saveMemory() {
  localStorage.setItem("atlasMemories", JSON.stringify(state.memories));
}

function renderChain(running = false) {
  const chain = chainTemplates[state.depth];
  $("#chain").innerHTML = chain.map((step, index) => `
    <li>
      <span class="step-index">${index + 1}</span>
      <div>
        <span class="step-title">${step[0]}</span>
        <span class="step-copy">${step[1]}${running && index === 0 ? " Running now..." : ""}</span>
      </div>
    </li>
  `).join("");
}

function renderSources() {
  const depthBonus = state.depth === "expert" ? 5 : state.depth === "deep" ? 2 : 0;
  const sources = sourceBank.map(([name, summary, score]) => [name, summary, Math.min(99, score + depthBonus)]);
  $("#sourceCount").textContent = `${sources.length} sources`;
  $("#sources").innerHTML = sources.map(([name, summary, score]) => `
    <article class="source">
      <div class="source-top">
        <strong>${name}</strong>
        <span class="score">${score}% fit</span>
      </div>
      <p>${summary}</p>
    </article>
  `).join("");
}

function renderMemories() {
  const all = [...defaults, ...state.memories];
  $("#memories").innerHTML = all.map((item) => `<div class="memory-item">${escapeHtml(item)}</div>`).join("");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function buildBrief() {
  const question = escapeHtml($("#question").value.trim() || "Untitled research question");
  const verify = $("#verify").checked;
  const memory = $("#memory").checked;
  const depthLabel = state.depth[0].toUpperCase() + state.depth.slice(1);
  const memoryLine = memory ? "The agent applies stored preferences for concise, evidence-weighted research." : "Memory is disabled for this run.";
  const verifyLine = verify ? "Claims are tagged as verified, inferred, or speculative before inclusion." : "Verification is relaxed, so the brief favors speed over certainty.";

  state.latestBrief = `
    <h3>Question</h3>
    <p>${question}</p>

    <h3>Answer</h3>
    <p>Personal research agents have the strongest 2026 opportunity in vertical workflows where professionals already collect sources, compare claims, and produce repeatable briefs. The biggest openings are private knowledge connectors, citation-grade browsing, collaborative review, and agent evaluation dashboards.</p>

    <h3>Opportunity Map</h3>
    <ul>
      <li><strong>Knowledge workbench:</strong> combine web research, private files, notes, and reusable prompt chains in one auditable workspace.</li>
      <li><strong>Trust layer:</strong> source scoring, contradiction checks, and claim-level citations become the feature users pay for after the novelty wears off.</li>
      <li><strong>Vertical agents:</strong> legal prep, investment screening, policy monitoring, competitive intelligence, and academic literature reviews support higher prices than generic chat.</li>
      <li><strong>Team memory:</strong> persistent preferences, approved sources, and reusable research playbooks make the agent feel personal without becoming opaque.</li>
    </ul>

    <h3>Risks</h3>
    <ul>
      <li>Hallucinated citations, stale search results, and hidden reasoning shortcuts can undermine confidence.</li>
      <li>Private data connectors create security, retention, and permission design obligations.</li>
      <li>Autonomous multi-step agents need clear stop points, review gates, and logs.</li>
    </ul>

    <h3>Monetization</h3>
    <ul>
      <li>Start with a pro subscription for individuals who need repeated briefs and exports.</li>
      <li>Add team plans around shared memory, source policies, audit logs, and admin controls.</li>
      <li>Charge premium tiers for vertical templates, private connectors, scheduled monitors, and long-running agent jobs.</li>
    </ul>

    <h3>Run Settings</h3>
    <p>${depthLabel} mode. ${verifyLine} ${memoryLine}</p>
  `;
  $("#briefText").innerHTML = state.latestBrief;
}

function runResearch() {
  $("#phase").textContent = "Planning";
  renderChain(true);
  $("#run").disabled = true;
  $("#run").textContent = "Running...";

  const phases = ["Searching", "Scoring", "Synthesizing", "Ready"];
  phases.forEach((phase, index) => {
    window.setTimeout(() => {
      $("#phase").textContent = phase;
      $("#confidence").textContent = String(88 + index + (state.depth === "expert" ? 3 : 0));
      $("#tokenCount").textContent = state.depth === "expert" ? "24.6k" : state.depth === "deep" ? "16.2k" : "8.4k";
      if (phase === "Ready") {
        renderChain(false);
        renderSources();
        buildBrief();
        $("#run").disabled = false;
        $("#run").textContent = "Run Research";
      }
    }, 450 * (index + 1));
  });
}

function copyBrief() {
  const text = $("#briefText").innerText.trim();
  navigator.clipboard.writeText(text);
  $("#copyBrief").textContent = "Copied";
  window.setTimeout(() => $("#copyBrief").textContent = "Copy", 1200);
}

function setupCanvas() {
  const canvas = $("#field");
  const context = canvas.getContext("2d");
  const points = Array.from({ length: 68 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00045,
    vy: (Math.random() - 0.5) * 0.00045
  }));

  function frame() {
    const width = canvas.width = window.innerWidth * devicePixelRatio;
    const height = canvas.height = window.innerHeight * devicePixelRatio;
    context.clearRect(0, 0, width, height);
    context.lineWidth = devicePixelRatio;

    points.forEach((point) => {
      point.x = (point.x + point.vx + 1) % 1;
      point.y = (point.y + point.vy + 1) % 1;
    });

    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const dx = (a.x - b.x) * width;
        const dy = (a.y - b.y) * height;
        const distance = Math.hypot(dx, dy);
        if (distance < 180 * devicePixelRatio) {
          context.strokeStyle = `rgba(97, 216, 255, ${0.16 * (1 - distance / (180 * devicePixelRatio))})`;
          context.beginPath();
          context.moveTo(a.x * width, a.y * height);
          context.lineTo(b.x * width, b.y * height);
          context.stroke();
        }
      }
    }

    points.forEach((point) => {
      context.fillStyle = "rgba(84, 215, 159, 0.38)";
      context.beginPath();
      context.arc(point.x * width, point.y * height, 2 * devicePixelRatio, 0, Math.PI * 2);
      context.fill();
    });

    requestAnimationFrame(frame);
  }

  frame();
}

document.querySelectorAll(".segmented button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segmented button").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    state.depth = button.dataset.depth;
    renderChain(false);
  });
});

document.querySelectorAll(".rail-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".rail-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const panel = document.querySelector(`[data-panel="${button.dataset.view}"]`);
    panel?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

$("#memoryForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = $("#memoryInput").value.trim();
  if (!value) return;
  state.memories.push(value);
  $("#memoryInput").value = "";
  saveMemory();
  renderMemories();
});

$("#clearMemory").addEventListener("click", () => {
  state.memories = [];
  saveMemory();
  renderMemories();
});

$("#run").addEventListener("click", runResearch);
$("#copyBrief").addEventListener("click", copyBrief);

renderChain(false);
renderSources();
renderMemories();
buildBrief();
setupCanvas();
