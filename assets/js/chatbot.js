/* ===========================================
   PIXEL — Colart's AI Assistant
   Static, client-side conversation engine.
   No backend, no LLM API, no CRM — everything here is rule-based
   (branching questions + templated recommendations), and every
   number/claim it makes is either arithmetic on the visitor's own
   answers or wording we wrote — nothing is invented.
   Ends every real conversation with a WhatsApp handoff carrying a
   structured summary, since that's the only "CRM" this static site has.
=========================================== */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "96170649423";

  /* ---------- Knowledge base (direct-question fallback) ---------- */
  var FAQ_DATA = [
    {
      q: "What is Colart Digital Marketing Agency?",
      a: "Colart is a full-service creative and digital marketing agency based in Lebanon, working with businesses across Lebanon, the GCC, and beyond. We bring branding, content, social media, and digital marketing together under one roof so brands can grow with a consistent, professional presence.",
      keywords: ["what is colart", "who is colart", "about colart", "who are you", "what do you do", "tell me about"]
    },
    {
      q: "What services does Colart offer?",
      a: "Colart offers five core services under one roof: Brand Identity, Social Media Management, Digital Marketing, Media Production, and Website Development. Each can be handled individually or combined into a full-service package, depending on what your business needs to grow.",
      keywords: ["what service", "do you offer", "offerings", "brand identity", "social media management", "digital marketing", "media production", "website development", "what can you do", "manage instagram", "manage social"]
    },
    {
      q: "What types of businesses do you work with?",
      a: "We work with restaurants and cafés, retail and product brands, service-based businesses, and individual entrepreneurs building something from the ground up. If your business needs a stronger, more professional presence, Colart can help.",
      keywords: ["type of business", "kind of business", "clients", "industries", "restaurants", "retail", "who do you work with"]
    },
    {
      q: "Does Colart work with businesses outside Lebanon?",
      a: "Yes. While Colart is based in Lebanon, we work remotely with clients across the GCC and beyond. Most of our process, strategy calls, content reviews, and campaign management happens online, so location isn't a barrier to working together.",
      keywords: ["outside lebanon", "gcc", "international", "remote", "abroad", "other countries", "work internationally"]
    },
    {
      q: "How do I get started with Colart?",
      a: "Reach out through our Contact page or WhatsApp with a bit about your business and what you need. We'll follow up to understand your goals, then walk you through a proposal and next steps tailored to your project.",
      keywords: ["get started", "start a project", "begin", "how to start", "onboarding", "how do i start"]
    },
    {
      q: "Do you offer one-time projects or ongoing retainers?",
      a: "Both. Some services, like a logo or a website, are natural one-time projects. Others, like social media management or digital marketing, work best as an ongoing monthly retainer so your brand stays active and consistent.",
      keywords: ["one-time", "one time", "retainer", "monthly", "ongoing", "subscription", "project or retainer"]
    },
    {
      q: "How long does a typical project take?",
      a: "Timelines vary by service. A brand identity project might take a few weeks, while an ongoing social media or marketing retainer runs monthly. We'll give you a clear timeline as part of your proposal.",
      keywords: ["how long", "timeline", "turnaround", "duration", "how much time", "how fast"]
    },
    {
      q: "How much do your services cost?",
      a: "Colart projects are tailored to the scope and objectives, so I don't want to give you an inaccurate number. Tell me a bit about what you're looking to achieve and I can help figure out the right scope, then connect you with the team for a real proposal.",
      keywords: ["price", "cost", "pricing", "how much", "rates", "budget", "fees", "quote", "expensive", "charge"]
    },
    {
      q: "What's your payment structure?",
      a: "Payment terms are agreed on a per-project basis and outlined before work begins, typically structured around a deposit followed by milestone or monthly payments. Full details are shared as part of our Terms of Service once a project starts.",
      keywords: ["payment", "deposit", "installment", "pay", "payment structure", "milestone"]
    },
    {
      q: "What happens if a project is delayed?",
      a: "Delays can happen on either side of a project. Our Terms of Service outline how delays are handled so both Colart and the client know what to expect and how timelines are adjusted fairly.",
      keywords: ["delay", "delayed", "late", "postponed"]
    },
    {
      q: "Can Colart pause or decline a project?",
      a: "Yes, under certain circumstances outlined in our Terms of Service, such as non-payment or a project falling outside our scope of services. We always aim to communicate clearly with clients before any project is paused or ended.",
      keywords: ["pause project", "decline project", "cancel", "refuse", "stop project", "reject"]
    },
    {
      q: "Can I see examples of your past work?",
      a: "Yes. Visit our Our Work page for real client projects across branding, social media, and campaigns, or check Reviews to hear directly from businesses we've worked with.",
      keywords: ["portfolio", "past work", "examples", "see your work", "case stud", "samples", "your work"]
    },
    {
      q: "Do you have client testimonials?",
      a: "Yes. Visit our Reviews page to read testimonials from businesses we've worked with across branding, social media, and digital marketing.",
      keywords: ["testimonial", "reviews", "feedback", "references", "what clients say"]
    },
    {
      q: "How can I contact Colart?",
      a: "You can reach us by email at info@colartdigitalmarketingagency.com, by phone or WhatsApp, or through the contact form on our Contact page.",
      keywords: ["contact", "email address", "phone number", "reach you", "get in touch", "call you"]
    },
    {
      q: "Competitor comparison",
      a: "It depends on what you're looking for. If you tell me your priorities, I can help you think through what to evaluate — strategy, creative, performance, industry experience, regional reach, and reporting — rather than just taking my word for it.",
      keywords: ["better than", "vs ", "versus", "compare you to", "other agenc", "competitor"]
    },
    {
      q: "Existing client",
      a: "Happy to help. For anything specific to your account or an active project, the fastest route is our team directly on WhatsApp or email — I don't have access to private client or project data from here.",
      keywords: ["already a client", "existing client", "current client", "my project status", "my account"]
    }
  ];

  var STARTER_ACTIONS = [
    { label: "🚀 Grow my business", value: "goal:growth" },
    { label: "📈 Get more leads", value: "goal:leads" },
    { label: "📱 Improve my social media", value: "goal:social" },
    { label: "🔍 Analyze my business", value: "goal:audit" },
    { label: "🎨 Build my brand", value: "goal:brand" },
    { label: "💰 Get a proposal", value: "goal:proposal" }
  ];

  var GREETING = "Hey 👋 I'm Pixel, Colart's AI Assistant. Tell me what you're trying to achieve and I'll help you find your biggest opportunities — or just ask me a direct question.";
  var GREETING_REPLY = "Hey again! Pick one of these to get started, or tell me what's on your mind:";
  var HELP_REPLY = "Of course — tap “Chat with an Agent on WhatsApp” below and I'll pass along everything we've covered so far so our team can pick up right where we left off.";
  var FALLBACK = "I want to make sure I point you the right way. Are you mainly trying to get more customers, improve your brand, or improve your digital presence? Or pick an option below:";

  var GREETING_WORDS = ["hi", "hello", "hey", "hiya", "yo", "morning", "evening", "afternoon", "marhaba", "salam", "greetings"];
  var HELP_PHRASES = ["help", "assist", "assistance", "talk to someone", "talk to an agent", "talk to a human", "speak to someone", "speak to an agent", "real person", "human agent", "representative", "support", "send me a proposal", "call me", "book a meeting", "urgent", "large project", "work with colart"];
  var GOAL_SIGNAL_WORDS = ["grow", "growth", "more customers", "more clients", "more leads", "more sales", "marketing help", "need marketing", "brand", "rebrand", "social media help", "struggling", "not enough customers", "not working"];

  /* ---------- Discovery question banks (shared across goals) ---------- */
  var INDUSTRY_OPTIONS = [
    { label: "Restaurant / Café", value: "Restaurant / Café" },
    { label: "Retail / E-commerce", value: "Retail / E-commerce" },
    { label: "Service Business", value: "Service Business" },
    { label: "Other", value: "Other" }
  ];
  var MARKET_OPTIONS = [
    { label: "Lebanon only", value: "Lebanon only" },
    { label: "Lebanon + GCC", value: "Lebanon + GCC" },
    { label: "GCC / International", value: "GCC / International" }
  ];
  var CURRENT_MARKETING_OPTIONS = [
    { label: "Nothing yet", value: "Nothing yet" },
    { label: "Some social media", value: "Some social media" },
    { label: "Running paid ads", value: "Running paid ads" },
    { label: "Full marketing team", value: "Full marketing team" }
  ];
  var BUDGET_OPTIONS = [
    { label: "Not sure yet", value: "Not sure yet" },
    { label: "Under $500/mo", value: "Under $500" },
    { label: "$500–1,500/mo", value: "$500-1500" },
    { label: "$1,500+/mo", value: "$1500+" }
  ];
  var TIMELINE_OPTIONS = [
    { label: "Just exploring", value: "Just exploring" },
    { label: "Within a month", value: "Within a month" },
    { label: "ASAP / urgent", value: "ASAP" }
  ];

  var CHALLENGE_OPTIONS = {
    growth: [
      { label: "More customers / awareness", value: "brand_awareness" },
      { label: "More leads / inquiries", value: "more_leads" },
      { label: "More online sales", value: "more_sales" },
      { label: "Stronger brand presence", value: "weak_brand" }
    ],
    leads: [
      { label: "Not enough traffic", value: "brand_awareness" },
      { label: "Traffic but low conversion", value: "poor_website" },
      { label: "No consistent lead system", value: "more_leads" },
      { label: "Not sure where leads should come from", value: "more_leads" }
    ],
    social: [
      { label: "Low engagement", value: "weak_social" },
      { label: "Inconsistent posting", value: "weak_social" },
      { label: "No clear strategy", value: "weak_social" },
      { label: "Not enough followers", value: "weak_social" }
    ],
    brand: [
      { label: "No clear identity yet", value: "weak_brand" },
      { label: "Inconsistent look across channels", value: "weak_brand" },
      { label: "Brand feels outdated", value: "weak_brand" },
      { label: "Just starting out, need everything", value: "new_business" }
    ]
  };

  var PROPOSAL_OPTIONS = [
    { label: "Branding", value: "weak_brand" },
    { label: "Social Media", value: "weak_social" },
    { label: "Digital Marketing / Ads", value: "more_leads" },
    { label: "Website", value: "poor_website" },
    { label: "Not sure yet / multiple", value: "new_business" }
  ];

  /* ---------- Problem → recommendation templates ---------- */
  var PROBLEM_TEMPLATES = {
    brand_awareness: {
      whatISee: "It sounds like the core challenge right now is that not enough of the right people know you exist yet.",
      priorities: [
        { title: "Clarify the offer", text: "Make what you do and who it's for immediately understandable, on the site and on social." },
        { title: "Build a content system", text: "Create content designed around awareness and trust, not just one-off posts." },
        { title: "Add targeted acquisition", text: "Use paid campaigns to put that content in front of the right audience, not just anyone." }
      ],
      services: ["Branding", "Content", "Social Media"],
      howColart: "Colart could combine brand positioning, content, and social media management around that system so awareness translates into real recall.",
      shortLine: "Brand awareness — the offer and message could be sharper."
    },
    more_leads: {
      whatISee: "The pattern I'd expect here is that you're either not generating enough qualified inquiries, or the ones you get aren't consistent.",
      priorities: [
        { title: "Build a lead system", text: "Set up a repeatable path from ad or post to inquiry, not one-off campaigns." },
        { title: "Add a dedicated landing page", text: "Send traffic somewhere built specifically to convert, not just your homepage." },
        { title: "Run targeted performance campaigns", text: "Reach people actively looking for what you offer, with a clear next step." }
      ],
      services: ["Performance Marketing", "Landing Pages", "CRO"],
      howColart: "Colart could combine performance marketing, a dedicated landing page, and conversion optimization so leads become predictable instead of occasional.",
      shortLine: "Lead generation — traffic exists, the system to capture it may not."
    },
    more_sales: {
      whatISee: "This usually comes down to either not enough qualified traffic reaching your offer, or too much drop-off once people get there.",
      priorities: [
        { title: "Tighten the conversion path", text: "Reduce friction between someone seeing your offer and completing a purchase." },
        { title: "Run performance campaigns", text: "Put targeted spend behind the offers most likely to convert." },
        { title: "Build a funnel strategy", text: "Map the journey from first touch to purchase so nothing relies on guesswork." }
      ],
      services: ["Performance Marketing", "Conversion Optimization", "Funnel Strategy"],
      howColart: "Colart could combine performance marketing, conversion work, and funnel strategy so more of your existing traffic actually converts.",
      shortLine: "Sales conversion — the path from interest to purchase has room to tighten."
    },
    weak_brand: {
      whatISee: "It sounds like the visual identity and positioning aren't yet doing the work of making the business feel established and trustworthy.",
      priorities: [
        { title: "Build a clear brand strategy", text: "Define the positioning and message so everything else has something to align to." },
        { title: "Design a proper visual identity", text: "Logo, colors, and system that stay consistent everywhere the brand shows up." },
        { title: "Apply it consistently", text: "Carry that identity across the website, social, and any printed or digital material." }
      ],
      services: ["Brand Strategy", "Visual Identity"],
      howColart: "Colart could combine brand strategy and visual identity work so the business looks and feels as credible as the work itself deserves.",
      shortLine: "Brand identity — the visual system could be clearer and more consistent."
    },
    weak_social: {
      whatISee: "The usual cause here isn't posting more — it's not having a system behind what gets posted and why.",
      priorities: [
        { title: "Build a content strategy", text: "Plan content around what your audience actually cares about, not just filling a calendar." },
        { title: "Production, not just posting", text: "Consistent, on-brand content produced on a real schedule." },
        { title: "Track what's working", text: "Double down on the formats and topics driving actual engagement." }
      ],
      services: ["Social Strategy", "Content Production"],
      howColart: "Colart could combine social strategy and content production so your presence feels consistent and intentional, not sporadic.",
      shortLine: "Social presence — a strategy behind the posting would help most."
    },
    poor_website: {
      whatISee: "It sounds like the website itself may be the leak — traffic arrives but doesn't convert the way it should.",
      priorities: [
        { title: "Clarify the primary CTA", text: "Make the one action you want visitors to take obvious immediately." },
        { title: "Improve the conversion path", text: "Reduce steps and friction between arriving and taking action." },
        { title: "Strengthen trust signals", text: "Reviews, results, and clear information that reassure a new visitor." }
      ],
      services: ["Website Development", "UX / CRO"],
      howColart: "Colart could rebuild or optimize the site with conversion specifically in mind, not just a redesign for its own sake.",
      shortLine: "Website conversion — the path to action could be clearer."
    },
    new_business: {
      whatISee: "Starting from scratch is actually the easiest position to build correctly — there's no inconsistent history to untangle first.",
      priorities: [
        { title: "Start with brand foundations", text: "Positioning and identity first, so every following decision has something to build on." },
        { title: "Launch with a real website", text: "A professional home online from day one, not an afterthought." },
        { title: "Plan a launch campaign", text: "Introduce the business with intention instead of a quiet start." }
      ],
      services: ["Branding", "Website Development", "Launch Campaign"],
      howColart: "Colart could combine branding, a website, and a launch campaign so the business starts strong rather than catching up later.",
      shortLine: "New business — the opportunity is building the foundation right from the start."
    }
  };

  var WHAT_I_SEE_OVERRIDES = {
    "Traffic but low conversion": "It sounds like people are finding you, but the website itself may not be closing the gap between interest and action.",
    "Brand feels outdated": "It sounds like the brand once worked but hasn't kept pace — a refresh could make a real difference without starting over.",
    "Not enough followers": "Follower count usually isn't the real problem — it's typically a symptom of not having a content system behind the account yet."
  };

  /* ---------- Lead scoring (spec's 100-point model, computed client-side) ---------- */
  function computeLeadScore(state) {
    var score = 0;
    if (state.goal) score += 10;
    if (state.currentMarketing && state.currentMarketing !== "Nothing yet") score += 5;
    if (state.budget && state.budget !== "Not sure yet") score += 10;
    if (state.budget === "$1500+") score += 20;
    if (state.servicesCount && state.servicesCount > 1) score += 15;
    if (state.timeline === "ASAP" || state.timeline === "Within a month") score += 20;
    if (state.market === "GCC / International" || state.market === "Lebanon + GCC") score += 10;
    if (state.requestedProposal) score += 10;
    if (state.requestedTeam) score += 10;
    return Math.min(score, 100);
  }
  function classifyLead(score) {
    if (score >= 81) return "High-value";
    if (score >= 61) return "Qualified";
    if (score >= 31) return "Potential";
    return "Explorer";
  }

  function trackEvent(name, params) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", name, params || {});
    } catch (e) { /* analytics should never break the widget */ }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var widget = document.getElementById("chatbotWidget");
    if (!widget) return;

    var launcher = document.getElementById("chatbotLauncher");
    var panel = document.getElementById("chatbotPanel");
    var closeBtn = document.getElementById("chatbotClose");
    var messagesEl = document.getElementById("chatbotMessages");
    var quickRepliesEl = document.getElementById("chatbotQuickReplies");
    var form = document.getElementById("chatbotForm");
    var input = document.getElementById("chatbotInput");
    var agentBtn = document.getElementById("chatbotAgentBtn");

    var greeted = false;
    var state = {
      mode: "idle", // idle | discovery | audit | lead_name | lead_contact
      step: null,
      goal: null,
      industry: null,
      market: null,
      problemKey: null,
      challengeLabel: null,
      currentMarketing: null,
      budget: null,
      timeline: null,
      auditAnswers: {},
      servicesCount: 0,
      requestedProposal: false,
      requestedTeam: false,
      leadName: null,
      leadContact: null,
      log: [] // human-readable trail for the WhatsApp summary
    };

    function scrollToBottom() { messagesEl.scrollTop = messagesEl.scrollHeight; }

    function addMessage(text, sender) {
      var bubble = document.createElement("div");
      bubble.className = "chatbot-msg chatbot-msg-" + sender;
      bubble.textContent = text;
      messagesEl.appendChild(bubble);
      scrollToBottom();
    }

    function addTypingIndicator() {
      var el = document.createElement("div");
      el.className = "chatbot-msg chatbot-msg-bot chatbot-typing";
      el.id = "chatbotTyping";
      el.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(el);
      scrollToBottom();
    }
    function removeTypingIndicator() {
      var el = document.getElementById("chatbotTyping");
      if (el) el.remove();
    }

    function say(text, quickReplies, delay) {
      addTypingIndicator();
      window.setTimeout(function () {
        removeTypingIndicator();
        addMessage(text, "bot");
        renderQuickReplies(quickReplies || []);
      }, delay || 500);
    }

    function renderQuickReplies(list) {
      quickRepliesEl.innerHTML = "";
      if (!list || !list.length) { quickRepliesEl.style.display = "none"; return; }
      quickRepliesEl.style.display = "flex";
      list.forEach(function (opt) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chatbot-chip";
        chip.textContent = opt.label;
        chip.addEventListener("click", function () { handleChipClick(opt); });
        quickRepliesEl.appendChild(chip);
      });
    }

    /* ---------- FAQ matching (direct-question fallback) ---------- */
    function findFAQAnswer(text) {
      var input = text.toLowerCase();
      var best = null, bestScore = 0;
      FAQ_DATA.forEach(function (item) {
        var score = 0;
        item.keywords.forEach(function (kw) { if (input.indexOf(kw) !== -1) score += kw.split(" ").length; });
        if (score > bestScore) { bestScore = score; best = item; }
      });
      return bestScore > 0 ? best : null;
    }
    function containsWord(input, word) {
      if (word.indexOf(" ") !== -1) return input.indexOf(word) !== -1;
      return new RegExp("\\b" + word + "\\b", "i").test(input);
    }
    // Collapses runs of repeated letters ("hiii" / "heyy" / "hellooo") down to one,
    // so casual typing still matches the canonical word ("hi" / "hey" / "helo").
    function normalizeWord(w) { return w.replace(/(.)\1+/g, "$1"); }
    function isGreeting(text) {
      var words = text.toLowerCase().trim().split(/[^a-z]+/).filter(Boolean);
      if (!words.length || words.length > 4) return false;
      var normalizedGreetings = GREETING_WORDS.map(normalizeWord);
      return words.some(function (w) { return normalizedGreetings.indexOf(normalizeWord(w)) !== -1; });
    }
    function isHelpRequest(text) {
      var input = text.toLowerCase();
      return HELP_PHRASES.some(function (w) { return containsWord(input, w); });
    }
    function looksLikeGoalStatement(text) {
      var input = text.toLowerCase();
      return GOAL_SIGNAL_WORDS.some(function (w) { return input.indexOf(w) !== -1; });
    }

    /* ---------- Discovery engine ---------- */
    function startDiscovery(goal) {
      state.mode = "discovery";
      state.goal = goal;
      state.log.push("Goal: " + goalLabel(goal));
      trackEvent("quick_action_clicked", { goal: goal });
      if (goal === "proposal") {
        say("Happy to get that moving. What's the main thing you need help with?", PROPOSAL_OPTIONS.map(function (o) { return { label: o.label, value: "problem:" + o.value }; }));
        state.step = "proposal_service";
        return;
      }
      if (goal === "audit") {
        startAudit();
        return;
      }
      state.step = "industry";
      say("Got it. What kind of business is this?", INDUSTRY_OPTIONS.map(function (o) { return { label: o.label, value: "industry:" + o.value }; }));
    }

    function goalLabel(goal) {
      var found = STARTER_ACTIONS.find(function (a) { return a.value === "goal:" + goal; });
      return found ? found.label.replace(/^[^ ]+ /, "") : goal;
    }

    function handleChipClick(opt) {
      addMessage(opt.label, "user");
      var parts = opt.value.split(":");
      var kind = parts[0], value = parts.slice(1).join(":");

      if (kind === "goal") { startDiscovery(value); return; }

      if (kind === "industry") {
        state.industry = value; state.log.push("Industry: " + value);
        state.step = "market";
        say("And where are you currently selling or operating?", MARKET_OPTIONS.map(function (o) { return { label: o.label, value: "market:" + o.value }; }));
        return;
      }
      if (kind === "market") {
        state.market = value; state.log.push("Market: " + value);
        state.step = "challenge";
        var challenges = CHALLENGE_OPTIONS[state.goal] || CHALLENGE_OPTIONS.growth;
        say("What matters most right now?", challenges.map(function (o) { return { label: o.label, value: "challenge:" + o.value }; }));
        return;
      }
      if (kind === "challenge") {
        state.problemKey = value;
        state.step = "currentMarketing";
        say("Do you currently have any marketing running?", CURRENT_MARKETING_OPTIONS.map(function (o) { return { label: o.label, value: "marketing:" + o.value }; }));
        return;
      }
      if (kind === "marketing") {
        state.currentMarketing = value; state.log.push("Current marketing: " + value);
        state.step = "budget";
        say("Roughly what's the monthly marketing budget you're working with?", BUDGET_OPTIONS.map(function (o) { return { label: o.label, value: "budget:" + o.value }; }));
        return;
      }
      if (kind === "budget") {
        state.budget = value; state.log.push("Budget: " + value);
        state.step = "timeline";
        say("How soon are you looking to start?", TIMELINE_OPTIONS.map(function (o) { return { label: o.label, value: "timeline:" + o.value }; }));
        return;
      }
      if (kind === "timeline") {
        state.timeline = value; state.log.push("Timeline: " + value);
        presentStrategy(state.problemKey, null);
        return;
      }
      if (kind === "problem") {
        // "Get a proposal" fast path — skip straight to a short strategy + lead capture.
        state.problemKey = value;
        presentStrategy(value, null, true);
        return;
      }
      if (kind === "audit") { handleAuditAnswer(parts[1], value); return; }
      if (kind === "cta") { handleCTA(value); return; }
    }

    /* ---------- "Analyze my business" self-assessment ---------- */
    var AUDIT_QUESTIONS = [
      { key: "cta", q: "Let's do a quick self-assessment instead of guessing — no crawling, just a few honest answers. Does your website have a clear call-to-action visible without scrolling?", dim: "Website", weakKey: "poor_website" },
      { key: "trust", q: "Do you have customer reviews or testimonials visible on your site or profiles?", dim: "Brand", weakKey: "weak_brand" },
      { key: "social", q: "Is your social media updated at least weekly?", dim: "Social", weakKey: "weak_social" },
      { key: "ads", q: "Are you currently running any paid ads?", dim: "Acquisition", weakKey: "more_leads" }
    ];
    var YES_NO_UNSURE = [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
      { label: "Not sure", value: "Not sure" }
    ];

    function startAudit() {
      state.mode = "audit";
      state.step = 0;
      trackEvent("audit_started", {});
      askAuditQuestion(0);
    }
    function askAuditQuestion(i) {
      var qDef = AUDIT_QUESTIONS[i];
      say(qDef.q, YES_NO_UNSURE.map(function (o) { return { label: o.label, value: "audit:" + qDef.key + ":" + o.value }; }));
    }
    function handleAuditAnswer(key, value) {
      state.auditAnswers[key] = value;
      var idx = AUDIT_QUESTIONS.findIndex(function (q) { return q.key === key; });
      if (idx < AUDIT_QUESTIONS.length - 1) { askAuditQuestion(idx + 1); return; }
      finishAudit();
    }
    function finishAudit() {
      trackEvent("audit_completed", {});
      var lines = ["PIXEL QUICK AUDIT (self-assessment)", ""];
      var weakOnes = [];
      AUDIT_QUESTIONS.forEach(function (qDef) {
        var answer = state.auditAnswers[qDef.key];
        var rating = answer === "Yes" ? "Strong" : answer === "No" ? "Opportunity" : "Moderate";
        lines.push(qDef.dim.toUpperCase() + ": " + rating);
        if (answer !== "Yes") weakOnes.push(qDef.weakKey);
      });
      lines.push("");
      if (!weakOnes.length) {
        lines.push("You're covering the fundamentals well — the opportunity now is scaling what's working with paid acquisition and, if relevant, new markets.");
        addMessage(lines.join("\n"), "bot");
        state.problemKey = "more_sales";
        window.setTimeout(function () { presentStrategy("more_sales", null); }, 700);
        return;
      }
      lines.push("TOP OPPORTUNITIES");
      var uniqueWeak = weakOnes.filter(function (v, i) { return weakOnes.indexOf(v) === i; }).slice(0, 3);
      uniqueWeak.forEach(function (key, i) {
        lines.push((i + 1) + " — " + PROBLEM_TEMPLATES[key].shortLine);
      });
      addMessage(lines.join("\n"), "bot");
      state.problemKey = uniqueWeak[0];
      window.setTimeout(function () { presentStrategy(uniqueWeak[0], null); }, 700);
    }

    /* ---------- Strategic response ---------- */
    function presentStrategy(problemKey, whatISeeOverride, fastPath) {
      var tmpl = PROBLEM_TEMPLATES[problemKey] || PROBLEM_TEMPLATES.new_business;
      state.servicesCount = tmpl.services.length;
      state.log.push("Recommended: " + tmpl.services.join(" + "));

      if (fastPath) {
        addMessage("Got it — that maps well to " + tmpl.services.join(", ") + ". Want me to connect you with the Colart team so they can put together a real proposal?", "bot");
        renderQuickReplies([
          { label: "Yes, connect me", value: "cta:yes" },
          { label: "Not right now", value: "cta:no" }
        ]);
        return;
      }

      var whatISee = whatISeeOverride || WHAT_I_SEE_OVERRIDES[state.challengeLabel] || tmpl.whatISee;
      var lines = [];
      lines.push("What I see");
      lines.push(whatISee);
      lines.push("");
      lines.push("What I'd prioritize");
      tmpl.priorities.forEach(function (p, i) {
        lines.push((i + 1) + " — " + p.title);
        lines.push(p.text);
      });
      lines.push("");
      lines.push("How Colart could help");
      lines.push(tmpl.howColart);
      addTypingIndicator();
      window.setTimeout(function () {
        removeTypingIndicator();
        addMessage(lines.join("\n"), "bot");
        renderQuickReplies([
          { label: "Build my 90-day strategy", value: "cta:strategy" },
          { label: "Connect me with the team", value: "cta:yes" },
          { label: "Not right now", value: "cta:no" }
        ]);
      }, 600);
    }

    function present90DayPlan(problemKey) {
      var tmpl = PROBLEM_TEMPLATES[problemKey] || PROBLEM_TEMPLATES.new_business;
      var lines = [
        "90-DAY DIRECTION",
        "",
        "Month 1 — Foundation: positioning, tracking, content system, and " + tmpl.services[0].toLowerCase() + " groundwork.",
        "Month 2 — Acquisition: campaigns, content distribution, and lead generation built on that foundation.",
        "Month 3 — Optimization: performance review, creative testing, and scaling what's working.",
        "",
        "The Colart team would tailor this to your industry and budget once we talk specifics."
      ];
      addMessage(lines.join("\n"), "bot");
      renderQuickReplies([
        { label: "Connect me with the team", value: "cta:yes" },
        { label: "Not right now", value: "cta:no" }
      ]);
    }

    function handleCTA(value) {
      if (value === "strategy") {
        trackEvent("strategy_generated", { problem: state.problemKey });
        present90DayPlan(state.problemKey);
        return;
      }
      if (value === "yes") {
        state.requestedTeam = true;
        state.mode = "lead_name";
        say("Great — what's your name?", []);
        return;
      }
      if (value === "no") {
        state.mode = "idle";
        say("No problem — I'm here whenever you want to pick this back up. Anything else I can help with?", STARTER_ACTIONS);
        return;
      }
    }

    /* ---------- Lead capture + WhatsApp handoff ---------- */
    function finalizeLead() {
      var score = computeLeadScore(state);
      var tier = classifyLead(score);
      trackEvent("lead_completed", { lead_score: score, lead_status: tier.toLowerCase() });

      var lines = [];
      lines.push("Hi Colart! I was chatting with Pixel on your website and I'd like to talk to your team.");
      lines.push("");
      lines.push("PIXEL LEAD SUMMARY");
      if (state.leadName) lines.push("Name: " + state.leadName);
      if (state.leadContact) lines.push("Best way to reach me: " + state.leadContact);
      if (state.industry) lines.push("Business type: " + state.industry);
      if (state.market) lines.push("Market: " + state.market);
      if (state.goal) lines.push("Goal: " + goalLabel(state.goal));
      if (state.currentMarketing) lines.push("Current marketing: " + state.currentMarketing);
      if (state.budget) lines.push("Budget: " + state.budget);
      if (state.timeline) lines.push("Timeline: " + state.timeline);
      if (state.problemKey && PROBLEM_TEMPLATES[state.problemKey]) {
        lines.push("Recommended: " + PROBLEM_TEMPLATES[state.problemKey].services.join(" + "));
      }
      lines.push("Lead score: " + score + "/100 (" + tier + ")");
      lines.push("");
      lines.push("Could someone from the team follow up?");

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      trackEvent("whatsapp_clicked", { lead_score: score });
      window.open(url, "_blank", "noopener");

      say("Perfect — I've put together a summary and opened WhatsApp so you can send it straight to our team. Talk soon!", []);
      state.mode = "idle";
    }

    function handleLeadTextStep(text) {
      if (state.mode === "lead_name") {
        state.leadName = text;
        state.mode = "lead_contact";
        say("Thanks, " + text + "! Best way to reach you — WhatsApp number or email?", []);
        return;
      }
      if (state.mode === "lead_contact") {
        state.leadContact = text;
        finalizeLead();
        return;
      }
    }

    /* ---------- Free-text routing ---------- */
    function handleUserQuestion(text) {
      text = text.trim();
      if (!text) return;
      addMessage(text, "user");

      if (state.mode === "lead_name" || state.mode === "lead_contact") {
        handleLeadTextStep(text);
        return;
      }

      trackEvent("message_sent", {});

      if (isGreeting(text)) { say(GREETING_REPLY, STARTER_ACTIONS); return; }
      if (isHelpRequest(text)) { say(HELP_REPLY, []); return; }

      var faqMatch = findFAQAnswer(text);
      if (faqMatch) {
        say(faqMatch.a, state.mode === "discovery" ? [] : STARTER_ACTIONS);
        return;
      }

      if (state.mode === "idle" && looksLikeGoalStatement(text)) {
        startDiscovery("growth");
        return;
      }

      say(FALLBACK, STARTER_ACTIONS);
    }

    /* ---------- Panel open/close ---------- */
    function openPanel() {
      widget.classList.add("is-open");
      launcher.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      trackEvent("pixel_opened", {});
      if (!greeted) {
        greeted = true;
        trackEvent("conversation_started", {});
        say(GREETING, STARTER_ACTIONS, 300);
      }
      window.setTimeout(function () { input.focus(); }, 300);
    }
    function closePanel() {
      widget.classList.remove("is-open");
      launcher.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
    }

    launcher.addEventListener("click", function () {
      widget.classList.contains("is-open") ? closePanel() : openPanel();
    });
    closeBtn.addEventListener("click", closePanel);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && widget.classList.contains("is-open")) closePanel();
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = input.value;
      input.value = "";
      handleUserQuestion(text);
    });
    agentBtn.addEventListener("click", function () {
      state.requestedTeam = true;
      trackEvent("whatsapp_clicked", { source: "persistent_button" });
      var summaryLines = ["Hi Colart! I was chatting with Pixel on your website and would like to talk to your team."];
      if (state.log.length) {
        summaryLines.push("");
        summaryLines.push("What we covered:");
        state.log.forEach(function (l) { summaryLines.push("- " + l); });
      }
      summaryLines.push("");
      summaryLines.push("Could someone help me further?");
      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(summaryLines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  });
})();
