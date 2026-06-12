# FinCoach V2 — Active Portfolio Trader

**Status:** Planned — begin after V1 (financial wellness coach) is live and stable  
**Tier positioning:** Pro upgrade on top of V1 base subscription  
**Primary user:** Individual active investor managing their own portfolio  
**Secondary user:** RIA firm / independent advisor using it as a research layer for clients

---

## Product Vision

V1 answers questions. V2 watches the market and tells you what to do about what you own.

The core loop:

1. User connects their portfolio holdings (tickers, shares, cost basis, account type)
2. News ingestion pipeline runs continuously — RSS feeds, earnings releases, macro data
3. When material news drops that affects a user's holdings, an alert fires
4. Alert includes an AI-generated, personalized suggestion tied to their specific position:
   > "Microsoft beat earnings by 8%. Analysts raising targets to $480. You hold 200 shares at $280 cost basis — $29K unrealized gain in a taxable account. If you've already hit long-term capital gains threshold this year, consider holding. If not, partial harvest before year-end could make sense. Review your full tax picture first."
5. User can ask follow-up questions in chat — the alert becomes a conversation entry point

This is the differentiation: not generic market news, not raw data — contextualized, holding-specific, actionable suggestions grounded in the user's actual numbers and tax situation.

---

## Tier Structure

| Feature | V1 Base | V2 Pro |
|---------|---------|--------|
| AI financial wellness chat | Yes | Yes |
| 82-doc CFP knowledge base | Yes | Yes |
| Personalized profile coaching | Yes | Yes |
| Financial wellness score | Yes | Yes |
| Portfolio holdings tracking | No | Yes |
| Market news dashboard | No | Yes |
| Real-time news ingestion | No | Yes |
| Holdings-matched alerts | No | Yes |
| Buy / sell / hold suggestions | No | Yes |
| Alert delivery (email / push) | No | Yes |
| Earnings calendar awareness | No | Yes |

**Pricing:** V1 base $24/mo individual or $199/mo team. V2 Pro add-on: +$15-20/mo per seat.

---

## Architecture Extensions (All Additive — V1 Infrastructure Unchanged)

```
V1 stack stays intact. V2 adds:

news_ingestion/
  pipeline.py         ← scheduled job (cron, every 1-4 hours)
  sources.py          ← RSS feed registry
  entity_extractor.py ← Haiku: extract tickers/companies from article

alert_engine/
  watcher.py          ← cross-reference ingested news vs user holdings
  scorer.py           ← Haiku: is this materially price-moving news?
  suggester.py        ← Sonnet: generate holding-specific suggestion

frontend/app/
  market/page.tsx     ← market news dashboard (holdings-filtered feed)
  alerts/page.tsx     ← alert inbox + suggestion history

database/
  user_holdings table ← portfolio positions
  news_items table    ← ingested articles
  alerts table        ← generated suggestions + delivery state
```

### No changes to:
- `/chat` router and RAG pipeline
- `/evaluate` router and Prompt Lab
- 3-tier model routing (Haiku/Sonnet/Opus)
- pgvector schema — news articles get ingested as chunks into the SAME `document_chunks` table with `type: "news"` in metadata
- Redis cache
- User auth and profile tables

---

## New Data Models

### `user_holdings`
```sql
id              uuid primary key
user_id         uuid references users(id)
ticker          varchar(10)          -- e.g. "MSFT"
company_name    varchar(255)
shares          numeric(12, 4)
cost_basis      numeric(10, 2)       -- per share
account_type    varchar(20)          -- taxable, roth, traditional, hsa
added_at        timestamptz
last_price      numeric(10, 2)       -- updated by market data job
last_price_at   timestamptz
```

### `news_items`
```sql
id              uuid primary key
headline        text
body_summary    text                 -- truncated, not full article
source          varchar(100)         -- "Reuters", "SEC EDGAR", "CNBC"
url             text
tickers_mentioned  varchar[]        -- extracted by Haiku
published_at    timestamptz
ingested_at     timestamptz
materiality_score  smallint         -- 0-100, scored by Haiku
```

### `alerts`
```sql
id              uuid primary key
user_id         uuid references users(id)
holding_id      uuid references user_holdings(id)
news_item_id    uuid references news_items(id)
suggestion      text                 -- Sonnet-generated, personalized
action_type     varchar(20)          -- "consider_sell", "consider_buy_more", "take_profits", "hold", "watch"
delivered_at    timestamptz
read_at         timestamptz
dismissed_at    timestamptz
```

---

## News Ingestion Pipeline

### RSS Feed Sources
```python
FEEDS = [
    # Market-wide
    "https://feeds.reuters.com/reuters/businessNews",
    "https://feeds.finance.yahoo.com/rss/2.0/headline",
    "https://www.cnbc.com/id/100003114/device/rss/rss.html",

    # Macro / Fed
    "https://www.federalreserve.gov/feeds/press_all.xml",
    "https://api.stlouisfed.org/fred/releases/rss",

    # Earnings / SEC filings
    "https://efts.sec.gov/LATEST/search-index?q=%228-K%22&dateRange=custom&startdt={today}&forms=8-K",

    # Analyst ratings (Seeking Alpha free tier or Benzinga webhook)
]
```

### Ingestion Job Flow
```
1. Fetch new articles from all RSS feeds since last_run
2. For each article:
   a. Haiku: extract ticker mentions → ["MSFT", "NVDA"] (entity extraction prompt)
   b. Haiku: score materiality 0-100 → is this price-moving news?
      - Earnings beat/miss = 80+
      - CEO departure = 85+
      - Fed rate decision = 90+
      - General industry news = 20-40
      - Opinion/analysis = 10-25
   c. Chunk + embed headline + body_summary → upsert to document_chunks
      (type: "news", ticker: "MSFT", published_at: "...", materiality: 80)
   d. Save to news_items table

3. Alert trigger: for each news_item where materiality >= threshold (default 60):
   a. Find all users who hold any ticker in tickers_mentioned
   b. For each matched user + holding:
      - Build context: holding details + user profile + news item
      - Sonnet: generate personalized suggestion
      - Save to alerts table
      - Queue notification delivery
```

### Materiality Threshold by Action Type
| Score | Action Label | Example |
|-------|-------------|---------|
| 90-100 | Urgent watch | Halt, SEC investigation, acquisition offer |
| 75-89 | Take profits / Consider sell | Earnings beat + extended valuation |
| 60-74 | Consider buy more | Earnings beat, pullback on good news |
| 40-59 | Hold / Watch | Analyst upgrade, general positive news |
| < 40 | No alert | Opinion pieces, broad market commentary |

---

## Market News Dashboard (`/market`)

The main page for Pro users. Not generic market news — filtered and ranked by relevance to the user's holdings.

### Layout
```
┌─────────────────────────────────────────────────┐
│  Portfolio Pulse                    [+ Add Holding]│
│  Your holdings: MSFT · NVDA · AAPL · BRK.B      │
├──────────────────────┬──────────────────────────┤
│ ALERTS (3 new)       │ MARKET SNAPSHOT           │
│ ─────────────────    │ S&P 500   5,312  -0.6%   │
│ MSFT earnings beat   │ NASDAQ    18,400  -0.9%  │
│ → Suggest: consider  │ 10yr yield  4.41%        │
│   partial harvest    │ VIX         18.4  +2.1   │
│                      │ Fed funds   5.25-5.50%   │
│ NVDA analyst upgrade │ ─────────────────────── │
│ → Suggest: hold,     │ EARNINGS THIS WEEK       │
│   watch resistance   │ Mon: — / Tue: NVDA       │
│                      │ Wed: — / Thu: AAPL       │
├──────────────────────┴──────────────────────────┤
│ RECENT NEWS (filtered to your holdings)          │
│ ┌──────────────────────────────────────────────┐│
│ │ [MSFT] Microsoft beats Q3 EPS by $0.18...    ││
│ │ Reuters · 2h ago · Materiality: 84/100       ││
│ └──────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────┐│
│ │ [AAPL] Apple supply chain report: iPhone...  ││
│ │ CNBC · 4h ago · Materiality: 51/100          ││
│ └──────────────────────────────────────────────┘│
└─────────────────────────────────────────────────┘
```

### Data Sources for Market Snapshot
- Prices: `yfinance` (free, no API key needed)
- Yield / macro: FRED API (free, St. Louis Fed)
- Earnings calendar: Alpha Vantage free tier or yfinance `ticker.calendar`
- VIX: yfinance `^VIX`

---

## Alert Suggestion Format

Every alert follows a consistent structure so Claude generates reliably parseable output:

```
System: You are a financial research assistant reviewing news for a portfolio holder.
Generate a concise, grounded suggestion. You are NOT a licensed investment advisor.
Always end with: "This is not investment advice. Consult a licensed advisor before acting."

User context:
  Holding: 200 shares MSFT @ $280.00 cost basis (taxable account)
  Current price: $425.00 | Unrealized gain: $29,000 (51.8%)
  User profile: 52yo, MFJ, 24% federal bracket, Texas (no state tax)
  Goal: retire at 62, target $8K/mo

News: Microsoft Q3 2026 earnings: EPS $3.46 vs $3.28 est (+5.5%).
Revenue $61.9B vs $60.9B est. Azure growth 33% YoY. Shares +4.2% AH.

Generate: action_type, one-line summary, 2-3 sentence rationale citing the user's numbers.
```

Output structure (JSON schema enforced):
```json
{
  "action_type": "consider_partial_harvest",
  "headline": "MSFT earnings beat — your $29K gain may warrant partial harvest review",
  "rationale": "Microsoft beat on EPS and revenue with Azure accelerating. At a 51.8% unrealized gain in a taxable account, you're past the long-term capital gains threshold. With no state income tax in Texas and your 24% federal bracket, the LTCG rate is 15% — a partial sale before year-end could be efficient depending on your other realized gains this year.",
  "disclaimer": "This is not investment advice. Consult a licensed advisor before acting."
}
```

---

## 3-Tier Model Routing for V2

Same infrastructure, new task assignments:

| Task | Model | Why |
|------|-------|-----|
| Entity extraction (tickers from article) | Haiku | Classification, not generation. Sub-100ms. |
| Materiality scoring (0-100) | Haiku | Another classification. |
| Alert suggestion generation | Sonnet | Hot path, needs to be fast — user is waiting on notification |
| Opus evaluation | Opus (async) | Cross-model quality check on suggestions before delivery |
| Chat follow-up on alerts | Sonnet | Same as V1 chat pipeline |

The Opus evaluation layer becomes especially important here — a wrong buy/sell suggestion has real financial consequences. Having Opus validate before delivery (checking safety, accuracy, grounding in retrieved news) is worth the async latency.

---

## Notification Delivery

Alert generated → notification sent via one or more channels:

| Channel | Implementation | Cost |
|---------|---------------|------|
| In-app (alert inbox) | Already in data model — just poll or websocket | Free |
| Email | Resend (same as any other project) — transactional | $20/mo for most volumes |
| Push (web) | Web Push API (browser native) + service worker | Free |
| SMS | Twilio — reserve for urgent alerts (materiality > 85) | $0.0079/SMS |

Priority: In-app first (Sprint 1), email (Sprint 2), push notifications (Sprint 3), SMS as optional for high-materiality alerts.

---

## Implementation Phasing

### Phase 4 Sprint 1 — Holdings + News Foundation (2 weeks)
- [ ] `user_holdings` table + CRUD API endpoints
- [ ] Portfolio intake UI (add/edit/remove holdings, link to account type)
- [ ] Basic RSS ingestion job (runs manually, no scheduler yet)
- [ ] `news_items` table populated
- [ ] `/market` page: static layout, manual refresh

### Phase 4 Sprint 2 — Alert Engine (2 weeks)
- [ ] Haiku entity extractor wired to ingestion pipeline
- [ ] Haiku materiality scorer
- [ ] Sonnet suggestion generator with structured output (JSON schema)
- [ ] Opus async validation before alert delivery
- [ ] `alerts` table + in-app alert inbox (`/alerts` page)
- [ ] Alert bell in nav with unread count

### Phase 4 Sprint 3 — Market Snapshot + Scheduling (1 week)
- [ ] Market snapshot widget: yfinance prices, FRED yield data, earnings calendar
- [ ] `/market` dashboard fully wired with real data
- [ ] Cron scheduler for ingestion (every 2 hours during market hours, daily AH)
- [ ] News feed filtered to user's holdings

### Phase 4 Sprint 4 — Notifications + Polish (1 week)
- [ ] Email alerts via Resend (transactional template)
- [ ] Web push notification service worker
- [ ] SMS via Twilio (high-materiality only, opt-in)
- [ ] User notification preferences (what to get, at what materiality threshold)
- [ ] Pricing gate: Pro tier check before accessing /market and /alerts

---

## Guardrail Position for V2

The suggestions are explicitly framed as research context for the user's own decision-making, not investment advice. Every alert ends with a disclaimer. Claude's system prompt for alert generation is explicit:

> "You are a financial research assistant, not a licensed investment advisor. You do not make recommendations. You present relevant information about market events in the context of the user's holdings and financial situation, so they can make an informed decision. Always include the disclaimer: 'This is not investment advice. Consult a registered investment advisor before acting.'"

This framing keeps the product outside RIA registration requirements while still being genuinely useful.

If the product is eventually sold to RIA firms (advisors using it for client research), the guardrail is loosened by the firm's own compliance framework — the advisor takes the recommendation responsibility. That's a separate enterprise tier.

---

## Key APIs and Cost Estimate at Scale

| Service | Use | Free Tier | Paid |
|---------|-----|-----------|------|
| yfinance (Yahoo) | Stock prices, earnings calendar | Unlimited | Free |
| FRED API (St. Louis Fed) | Macro data (yields, rates, CPI) | Unlimited | Free |
| Alpha Vantage | Backup market data, fundamentals | 25 req/day | $50/mo premium |
| RSS feeds (Reuters, CNBC, SEC) | News ingestion | Free | Free |
| Twilio | SMS alerts (high-materiality only) | Trial | $0.0079/SMS |
| Resend | Email alerts | 3K/mo free | $20/mo |

At 100 active Pro users, 2 alerts/user/day average: 200 emails/day = 6,000/month = free tier on Resend. SMS reserved for materiality > 85 only — maybe 10/day = $0.08/day. Total incremental cost at 100 users: effectively free above existing infrastructure.

---

## Reference

- V1 constitution: `CLAUDE.md`
- V1 Phase 3 product launch plan: `CLAUDE.md` → Phase 3 section
- Architecture diagram: `frontend/app/architecture/page.tsx` (multi-vertical template system)
- This doc is the source of truth for all V2 planning decisions
