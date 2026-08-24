// Single source of truth for every string / number rendered from the design.

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Loan Options", href: "#loan-options" },
  { label: "FAQs", href: "#faqs" },
] as const;

export const PHONE = { display: "(888) 999-2813", href: "tel:+18889992813" };

export const HERO_STATS = [
  { value: "200,000+", label: "Inquiries Processed" },
  { value: "$8.5B+", label: "Funded Through Our Partners" },
  { value: "35+", label: "Trusted Lending Partners" },
  { value: "A+", label: "BBB Accredited & Rated" },
] as const;

export const MARKETPLACE_LENDERS = [
  "Swoop Funding",
  "Upwise Capital",
  "SoFi",
  "LightStream",
  "United Capital",
] as const;

export const MARKETPLACE_DISCLAIMER =
  "All Trademarks, Logos, And Brand Names Displayed Are The Property Of Their Respective Owners. Use Of These Names And Logos Does Not Imply Endorsement.";

export const FAQ_ITEMS = [
  {
    q: "Will checking my rate hurt my credit score?",
    a: "No. Checking your rate with PriorityPlus is a soft credit inquiry — it's free, takes about 60 seconds, and has zero impact on your credit score. A hard pull only happens later, if you choose to accept an offer.",
  },
  {
    q: "How much can I consolidate?",
    a: "Personal consolidation loans on our marketplace typically range from $5,000 to $500,000 depending on the lender, your income, and your credit profile. Most borrowers combine credit cards, medical bills, and store financing into a single fixed payment.",
  },
  {
    q: "What does it cost to use PriorityPlus?",
    a: "Nothing. Comparing offers is completely free — lenders pay us a fee when a loan funds, so you never receive a bill from us. The rate you see is the rate you get; no hidden origination surprises at checkout.",
  },
] as const;

/** Floating "bill" receipts in the More bills. More stress. section. */
export const BILL_CARDS = [
  {
    id: "apr",
    label: "High Interest",
    value: "24.9% APR",
    sub: "Credit Card",
    tone: "danger" as const,
    // % of the stage box — tuned against the Figma export
    x: 4,
    y: 34,
    rotate: -8,
    delay: 0,
  },
  {
    id: "due",
    label: "Payment Due",
    value: "$185",
    unit: "/mo",
    sub: "Auto Loan",
    tone: "neutral" as const,
    x: 33,
    y: 2,
    rotate: -3,
    delay: 0.6,
  },
  {
    id: "min",
    label: "Minimum Payment",
    value: "$120",
    unit: "/mo",
    sub: "Store Card",
    tone: "neutral" as const,
    x: 66,
    y: 18,
    rotate: 7,
    delay: 1.2,
  },
  {
    id: "late",
    label: "Late Fee Risk",
    value: "+$35",
    sub: "Monthly",
    tone: "danger" as const,
    x: 19,
    y: 74,
    rotate: 5,
    delay: 1.8,
  },
  {
    id: "next",
    label: "Next Payment",
    value: "$210",
    unit: "/mo",
    sub: "Personal Loan",
    tone: "neutral" as const,
    x: 57,
    y: 68,
    rotate: -6,
    delay: 2.4,
  },
] as const;

export const LOAN_OFFERS = [
  { lender: "SoFi", amount: "$40,000", apr: "6.99%", term: "48/mo" },
  { lender: "Prosper", amount: "$35,000", apr: "7.29%", term: "60 mo" },
  { lender: "Upgrade", amount: "$30,000", apr: "8.49%", term: "36 mo" },
  { lender: "Best Egg", amount: "$25,000", apr: "8.99%", term: "36 mo" },
] as const;

export const THREE_STEPS = [
  {
    title: "Unlock your rate",
    body: "A quick soft credit check reveals personalized loan offers without impacting your credit score.",
  },
  {
    title: "Shape your loan",
    body: "Choose the amount, repayment term, and monthly payment that fit your budget, not a lender's template.",
  },
  {
    title: "Simplify your finances",
    body: "Funds go directly into your account so you can pay off existing balances and start fresh with one predictable payment.",
  },
] as const;

export const JOURNEY_STEPS = [
  {
    title: "Offers in hand",
    body: "Check your rate, compare pre-qualified offers from 8+ lenders, and pick your plan.",
  },
  {
    title: "Funds in your account",
    body: "Money is deposited straight into your bank account, ready to clear your balances.",
  },
  {
    title: "Simplified Repayment",
    body: "Five due dates become one fixed monthly payment - one amount and no surprises.",
  },
  {
    title: "Debt paid off",
    body: "No prepayment penalties. Finish sooner and keep more of your money.",
  },
] as const;

export const JOURNEY_NOTE = {
  title: "Don't let minimum payments slow you down.",
  body: "Avoid decades of interest by replacing high-interest balances with one predictable payment.",
};

export const COPILOT_GREETING =
  "Hi! I'm the PriorityPlus copilot. Ask me anything about consolidating debt, rates, or whether this is even right for you. I'll be straight with you.";

export const COPILOT_CHIPS = [
  "Will this lower my credit score?",
  "Is consolidation right for me?",
  "What's the catch?",
] as const;

/** Canned answers so the copilot works without a backend. */
export const COPILOT_REPLIES: Record<string, string> = {
  "Will this lower my credit score?":
    "Checking your rate uses a soft pull, which never affects your score. If you accept an offer the lender runs a hard pull, and paying balances down usually helps your utilization within a cycle or two.",
  "Is consolidation right for me?":
    "It tends to help when you carry several high-APR balances and your credit qualifies you for a lower fixed rate. If your APRs are already low, or the balances are small enough to clear in a few months, it may not be worth it.",
  "What's the catch?":
    "Consolidation does not erase debt, it reorganizes it. Watch for origination fees and for stretching the term so far that you pay more total interest even at a lower rate. We show both numbers before you commit.",
};

export const TESTIMONIALS = [
  {
    name: "Robert N.",
    rating: 5,
    headline: "Made the process effortless",
    quote:
      "From start to finish, the team was professional and transparent consolidating my cards into one payment took the stress out of my month.",
  },
  {
    name: "Maccy Doe",
    rating: 5,
    headline: "Saved me thousands in interest",
    quote:
      "I was drowning in minimum payments. PriorityPlus walked me through my options, and I walked away with a clear payoff plan.",
  },
  {
    name: "Jason L.",
    rating: 5,
    headline: "Quick, simple, no pressure",
    quote:
      "The online process took a few minutes and they answered every question I had.",
  },
  {
    name: "Kian Hooshmand",
    rating: 5,
    headline: "Real progress at last",
    quote:
      "Before finding PriorityPlus, my monthly debt felt completely unmanageable. Their team walked me through the entire consolidation process and combined everything into one single payment.",
  },
  {
    name: "Anthony R.",
    rating: 5,
    headline: "A clear payoff date",
    quote:
      "I had four different interest rates climbing every month and no real plan to pay them off. PriorityPlus laid out clear loan options in minutes, cutting my monthly bill by $350.",
  },
  {
    name: "Rachel V.",
    rating: 5,
    headline: "Shockingly fast and straightforward",
    quote:
      "I was skeptical because so many online offers come with hidden fees. Their website let me see exactly what I qualified for before committing to anything.",
  },
] as const;

export const TESTIMONIAL_SUMMARY = {
  score: "4.9/5",
  outOf: "from 12,400+ verified reviews",
};

export const CONSULTANTS = [
  {
    name: "Belinda J.",
    role: "Senior consultant",
    tenure: "6 years",
    badge: "Named in 40+ five-star reviews",
    cta: "Book with Belinda",
    photo: "/consultants/belinda.png",
  },
  {
    name: "Josh H.",
    role: "Consolidation specialist",
    tenure: "4 years",
    badge: '"Hands down recommend a call"',
    cta: "Book with Josh",
    photo: "/consultants/josh.png",
  },
  {
    name: "Dianna R.",
    role: "Client advocate",
    tenure: "5 years",
    badge: '"Professional, understanding"',
    cta: "Book with Dianna",
    photo: "/consultants/diana.png",
  },
] as const;

export const CALL_TIMELINE = [
  { when: "Min 1", what: "Say hello, confirm the debts you want gone." },
  { when: "Min 2-5", what: "Review your real offers from the marketplace, side by side." },
  { when: "Min 6-10", what: "Your questions  including options beyond a loan if that fits better." },
] as const;

export const CALL_PROMISE =
  "no pressure, no obligation, and if we're not the right fit, we'll tell you  and point you somewhere that is.";

export const CALL_SLOTS = [
  "Today · 4:45 PM",
  "Today · 6:15 PM",
  "Tomorrow · 9:30 AM",
  "Tomorrow · 2:15 PM",
] as const;

export const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: ["About Us", "How It Works", "Financial Wellness", "FAQs"],
  },
  {
    heading: "Services",
    links: ["Funding", "Working Capital", "Loan Options", "Equipment"],
  },
  {
    heading: "Loan Types",
    links: ["Medicals", "Debt Consolidation", "Home Improvement", "Personal Loans"],
  },
] as const;

export const FOOTER_BLURB =
  "PriorityPlus Financial is a marketplace connecting borrowers with a curated network of trusted lending partners. We are not a lender.";

export const FOOTER_CONTACT = [
  { icon: "phone" as const, label: PHONE.display, href: PHONE.href },
  {
    icon: "mail" as const,
    label: "info@priorityplusfinancial.com",
    href: "mailto:info@priorityplusfinancial.com",
  },
  {
    icon: "globe" as const,
    label: "Brentwood, TN Office • Costa Mesa, CA Office",
    href: null,
  },
];

export const LEGAL_LINKS = ["Terms of Use", "Privacy Policy"] as const;

export const COPYRIGHT = "©2026 PriorityPlus Financial. All rights reserved.";

export const CTA_LEDE =
  "Check your rate in 60 seconds and compare personalized offers from 35+ trusted lending partners — without affecting your credit score.";

export const FOOTER_DISCLAIMERS = [
  "PriorityPlus Financial is not a lender. We connect consumers with third-party lending partners. Loan offers are subject to eligibility and lender approval. Checking your rate uses a soft inquiry and won't affect your credit score. Loan amounts, rates, and terms vary by lender and applicant qualifications.",
  "PriorityPlus Financial is a Utah-licensed lender under the Utah Department of Financial Institutions (NMLS #2242692). Personal loan offers provided to customers who originated via a paid Google or Bing advertisement feature rate quotes on PriorityPlus Financial of no greater than 35.99% APR with terms from 61 days to 180 months. Your actual rate depends upon credit score, loan amount, loan term, domicile, and credit usage and history, and will be agreed upon between you and the lender. An example of total amount paid on a personal loan of $10,000 for a term of 36 months at a rate of 10% would be equivalent to $11,616.12 over the 36-month life of the loan.",
];
