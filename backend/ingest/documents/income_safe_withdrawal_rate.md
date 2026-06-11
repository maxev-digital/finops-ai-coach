# Safe Withdrawal Rate Research and Application

## The 4% Rule — Origin and Methodology

The 4% rule originates from **William Bengen's 1994 research** published in the Journal of Financial Planning. Bengen analyzed historical U.S. market returns from 1926 to 1992 and found that a retiree with a 50–75% stock allocation could withdraw 4% of initial portfolio value in year one, adjust that amount for inflation each subsequent year, and sustain withdrawals for at least 30 years across every historical 30-year period studied.

The **1998 Trinity Study** (Cooley, Hubbard, and Walz) replicated and expanded this analysis, confirming that a 4% withdrawal rate from a 50–75% equity portfolio had roughly a 95% success rate over 30-year periods in historical data.

**What the 4% rule means in practice:**
- $1,000,000 portfolio → $40,000 in year one withdrawals
- Year 2: $40,000 × (1 + inflation rate, e.g. 3%) = $41,200
- Year 3: $41,200 × 1.03 = $42,436
- Repeat indefinitely — the dollar amount grows with inflation each year regardless of portfolio performance

The spending amount is indexed to inflation, not tied to portfolio value. A bad market year does not reduce spending in this model.

## Updated Research — Morningstar and Current Environment

Morningstar's 2023 research updated the safe withdrawal rate for a **30-year retirement to 3.8%** (rather than 4%) given:
- Current equity valuations (higher starting valuations historically predict lower future returns)
- Lower expected bond yields relative to the mid-century historical period
- Increased longevity risk (people live longer than historical tables assumed)

**The directional message:** The 4% rule was calibrated to historical returns in a period that included high real bond yields and less extreme equity valuations. Current conditions suggest modest conservatism.

**However**, the 4% rule remains a reasonable starting point for most retirement planning conversations. It is not meant to be a precise prediction — it is a planning heuristic.

## Success Rate and Failure Mode

"95% success rate" in historical analysis means:
- In 95 of 100 historical 30-year windows, the portfolio lasted 30 full years
- In 5 of 100 windows, the portfolio ran out of money before year 30

**The failure mode is almost always the same:** A severe bear market in the **first few years** of retirement forces the retiree to sell assets at depressed prices to fund spending. The portfolio shrinks so much in early years that it cannot recover when markets rebound. This is sequence-of-returns risk (covered separately).

**What failure looks like:** Not running out of money at year 25 — running out at year 22–27 after slowly depleting through a bad early-retirement period. The retiree is left with Social Security and potentially a pension as the remaining income, but the portfolio is gone.

## Adjustments for Different Time Horizons

The 4% rule was designed for **30-year retirements**. Adjustments are needed for longer and shorter horizons:

| Retirement Length | Approximate Safe Withdrawal Rate |
|---|---|
| 15 years (retire at 70) | 5.5–6% |
| 20 years (retire at 70, die at 90) | 5.0% |
| 25 years (retire at 65) | 4.5% |
| 30 years (retire at 65, die at 95) | 4.0% |
| 35 years (retire at 60) | 3.5–3.75% |
| 40 years (retire at 55) | 3.0–3.5% |
| 45 years (retire at 50) | 3.0% or less |

**Rationale:** Longer retirements expose the portfolio to more years of potential bad sequences and more years of inflation erosion. The math demands a lower initial withdrawal rate to maintain 90–95% historical success rates.

## Dynamic Spending Rules

Rigid inflation-adjusted spending (the pure 4% rule approach) is unrealistic and often unnecessarily conservative. Most retirees adjust spending naturally. Dynamic spending rules attempt to formalize this flexibility:

### Guardrails Method (Guyton-Klinger)

Developed by Jonathan Guyton and William Klinger. The approach:

- Set an initial withdrawal rate (e.g., 5.0–5.5%, higher than the 4% baseline)
- Establish an upper guardrail (e.g., if portfolio grows such that the current withdrawal rate drops below 3.5%, increase spending by 10%)
- Establish a lower guardrail (e.g., if portfolio declines such that the current withdrawal rate exceeds 6.5%, cut spending by 10%)
- Inflation adjustment suspended in down-market years

**Result:** Higher sustainable initial spending, flexibility to respond to markets, and historically high success rates. The trade-off is accepting variable spending — some retirees find spending cuts psychologically difficult even when the logic is clear.

### Variable Percentage Withdrawal (VPW)

Developed using actuarial/lifecycle principles. Each year, multiply the current portfolio value by a **withdrawal rate that increases with age** as life expectancy shortens.

**Mechanics:** The withdrawal percentage is calculated to draw down the portfolio to zero at the end of life expectancy, adjusting for market performance automatically.

**Example:** At age 70, VPW table might indicate 5.0% withdrawal rate. Portfolio = $800,000 → withdraw $40,000. At age 75, rate might be 5.8%. If portfolio has grown to $900,000 → withdraw $52,200.

**Advantages:** Never depletes the portfolio unexpectedly. Automatically adjusts for market performance — spending rises in good years, falls in bad years. Portfolio balance approaches zero near end of life expectancy, maximizing lifetime consumption.

**Disadvantages:** Spending is inherently variable and tied to portfolio performance. Poor sequence of returns causes immediate spending cuts rather than the delayed depletion of the constant-dollar approach.

### Floor-and-Upside Approach

**Structure:**
- **Floor:** Cover essential expenses (housing, food, healthcare, utilities) with guaranteed income sources: Social Security, pension, life annuity
- **Upside:** Use portfolio for discretionary spending (travel, gifts, home improvements, luxuries)

**Advantage:** If the portfolio declines significantly, essential needs are still met by guaranteed sources. The floor removes the catastrophic failure scenario. Discretionary spending adjusts naturally with portfolio performance without threatening survival needs.

**Implementation:** Calculate the monthly income from guaranteed sources. If $4,500/month in SS + pension covers all essential expenses, then portfolio withdrawals are entirely discretionary. Market downturns affect vacations, not food.

## Monte Carlo Analysis — What It Tells You

Financial planning software uses Monte Carlo simulation to test withdrawal strategies across thousands of randomized return sequences.

**What "95% success" in Monte Carlo means:** In 950 of 1,000 simulated market sequences, the portfolio lasted the full planning period. In 50 scenarios, it ran out of money.

**Monte Carlo vs. historical simulation:** Monte Carlo randomizes returns without constraint; historical simulation uses actual return sequences. Historical analysis is limited by the number of historical periods (only a few dozen independent 30-year periods since 1926). Monte Carlo creates more scenarios but does not capture specific historical worst cases well.

**Interpretation for clients:** A 95% success rate is not a 5% chance of ruin — it is a 5% chance of the portfolio running out *under randomized assumptions*. In practice, most retirees spend less over time (especially medical costs aside), reduce spending proactively, can earn supplemental income, and have Social Security as a floor. Pure Monte Carlo failure overstates real-world catastrophe risk.

**Planning benchmark:** Most advisors target 85–95% Monte Carlo success probability. Below 85% suggests the plan needs adjustment. 99–100% is unnecessarily conservative — it implies leaving enormous unspent wealth at death.

## Asset Allocation's Role in Withdrawal Rate

The optimal equity allocation for a retiree withdrawing at 4% is typically **50–75% equities**:

- **Too little equity (all bonds/cash):** Portfolio cannot generate sufficient returns to keep pace with inflation and withdrawals. Depletes faster despite lower volatility.
- **Too much equity (100% stocks):** Extreme sequence-of-returns risk. A 40–50% portfolio drawdown in year 1–3 of retirement, while selling shares to fund withdrawals, permanently impairs the portfolio.

Research consistently shows that balanced allocations (50–70% equity) produce higher success rates than either extreme.

**Glide path in retirement:** Some research suggests a "bond tent" — higher bond allocation at retirement onset, gradually shifting to more equities over the first 10 years. This mitigates sequence risk in the critical early years while maintaining long-term growth potential.

## Real-World Calibration: Examples

**Client A, age 65, $2,000,000 portfolio, FRA Social Security in 2 years:**
- Planning 30-year retirement (to age 95)
- 4.0% withdrawal rate → $80,000/year
- Plus Social Security starting at 67: $32,000/year
- Total: $112,000/year. This is quite sustainable; SS covers a significant portion.

**Client B, age 55, $1,500,000 portfolio, minimal pension:**
- Planning 40-year retirement (to age 95)
- Appropriate withdrawal rate: 3.0–3.25% → $45,000–$49,000/year
- Social Security claimed at 70: $28,000/year (15 years away)
- Total at 70: $73,000–$77,000/year. Pre-70: $45–49k only — may need to supplement

**Client C, age 70, $800,000 portfolio + $3,200/month SS + $1,200/month pension:**
- Guaranteed income: $52,800/year — likely covers essential expenses
- At 5.5% withdrawal: $44,000/year discretionary from portfolio
- Total: $96,800/year. Very sustainable with floor income covering essentials.
