# Stock Options: ISO and NSO Tax Planning

## ISO vs. NSO: The Fundamental Difference

Stock options come in two types with dramatically different tax treatment:

**Incentive Stock Options (ISOs)**: Available only to employees; special AMT treatment; potential for full long-term capital gains treatment if holding requirements are met.

**Non-Qualified Stock Options (NSOs, also NQSOs)**: Can be granted to employees, directors, consultants, and advisors; taxed as ordinary income at exercise; no special tax treatment.

The practical distinction is substantial: an employee exercising a $10 option on stock worth $50 faces:
- **NSO**: Ordinary income of $40/share at exercise (the spread)
- **ISO**: No regular income tax at exercise; but the $40 spread is an AMT preference item

## Non-Qualified Stock Options (NSO): Straightforward Tax Treatment

### At Grant
No tax event. Receiving the option grant does not trigger income.

### At Exercise
When you exercise an NSO (purchase shares at the strike price), you recognize ordinary income equal to the spread:
- **Ordinary income = FMV at exercise − Strike price** (the spread)
- Employer withholds income tax and FICA on this amount
- Appears on W-2 as wages in the year of exercise
- Cost basis = FMV at exercise date

### At Sale
The difference between the sale price and the cost basis (FMV at exercise) is capital gain:
- Held more than 1 year after exercise date → long-term capital gains rate
- Held less than 1 year → short-term capital gains rate (ordinary income rates)

### NSO Practical Decision: Exercise and Sell vs. Exercise and Hold

**Exercise and immediately sell (same-day sale)**:
- Recognize ordinary income on the spread
- No capital gains (sale price ≈ exercise price + spread = same-day market price)
- Clean exit; no stock price risk

**Exercise and hold**:
- Recognize ordinary income on the spread at exercise
- Additional post-exercise appreciation: capital gains
- Risk: if stock falls below exercise price after you exercise, you've paid ordinary income tax on a gain that no longer exists — but you can harvest a capital loss

## Incentive Stock Options (ISOs): The AMT Challenge

### At Grant
No tax event.

### At Exercise
**No regular federal income tax** at ISO exercise — the key advantage.

**However**: The spread (FMV − Strike price) at ISO exercise is an **Alternative Minimum Tax (AMT) preference item**. It is added to your AMT income calculation and may trigger AMT liability even though no regular tax is owed.

**The AMT trap**: An employee exercises ISOs with a large spread in a year when regular income is moderate. AMT liability can be tens or hundreds of thousands of dollars — payable in cash even though no stock has been sold and no cash has been received.

### ISO Holding Requirements for Capital Gains Treatment

To qualify for long-term capital gains treatment on ISO shares (rather than a disqualifying disposition):
1. Must hold shares for **more than 2 years** from the grant date, AND
2. Must hold shares for **more than 1 year** from the exercise date

If BOTH requirements are met: sale proceeds minus exercise price = long-term capital gains. No ordinary income.

### Disqualifying Disposition

If either holding requirement is NOT met (you sell within 1 year of exercise OR within 2 years of grant), the sale triggers a **disqualifying disposition**:
- The spread at exercise (FMV on exercise date − strike price) = ordinary income
- Additional gain above the exercise-date FMV (if held past exercise) = capital gain (short or long-term)
- AMT paid in the exercise year may be partially recovered via AMT credit

## ISO AMT Planning: Critical Analysis Before Exercising

Before exercising ISOs with a significant spread, model the AMT impact:

**AMT income = Regular taxable income + ISO spread (plus other adjustments)**
**AMT = AMT income × 26% (up to $232,600 for single filers) or 28% (above that) − AMT exemption**

**2025 AMT exemption**: $88,100 (single), $137,000 (MFJ). Phase-out begins at $626,350 (single), $1,252,700 (MFJ).

**AMT credit**: When you exercise ISOs and pay AMT, you accumulate an AMT credit (the "minimum tax credit") equal to the AMT paid. This credit can be carried forward and used in future years when regular tax exceeds AMT — effectively recovering the AMT over time. The recovery timeline can be long (years to decades) depending on future income patterns.

## ISO Exercise Strategies

### Exercise Early When Spread Is Small

The most tax-efficient time to exercise ISOs is when the spread is minimal — ideally at or near grant when the stock price equals the strike price. If the ISO is exercised when FMV = strike price:
- No spread = No AMT preference item
- Low cost basis from the start
- All future appreciation from the exercise date = potential long-term capital gains

This is the primary reason many startup employees exercise options immediately upon grant or vesting (often combined with an 83(b) election for unvested stock — see the 83(b) document).

### Exercise in Low-Income Years

AMT is most problematic when the ISO spread is large AND regular income is also high. Exercising ISOs in a year when other income is low (sabbatical, parental leave, business loss year) reduces AMT exposure.

### Spread Exercise Across Multiple Years

If you have a large ISO grant and significant spread, exercising a portion each year — enough to remain under the AMT threshold — spreads the AMT exposure over multiple years rather than creating a single large AMT liability.

**AMT threshold approach**: Calculate the maximum ISO spread you can recognize in a given year before AMT kicks in (or exceeds some threshold). Exercise that amount in year 1, the same amount in year 2, etc. This is sometimes called "AMT spreading."

### Early Exercise With 83(b) Election

For unvested ISOs, some companies allow early exercise before vesting. If you exercise early-stage startup ISOs when the spread is zero or minimal, you can file an 83(b) election to lock in a $0 or minimal tax event. All future appreciation is capital gains from the exercise date. This starts the 1-year holding period clock immediately.

**Critical**: 83(b) elections must be filed within 30 calendar days of exercise — no exceptions. See the 83(b) election document for full details.

## Post-Termination Exercise Window

Stock options typically expire 90 days after the last day of employment (the "post-termination exercise window"). This is a hard deadline — after 90 days, unexercised options are permanently lost.

**Planning critical point**: Many employees leave companies with valuable unexercised options and fail to exercise within the 90-day window. This is a permanent, irreversible loss of valuable compensation.

**Pre-termination planning**:
- Know your option expiration dates
- Model the AMT and cash cost of exercising before leaving
- Arrange financing if necessary (some platforms offer pre-IPO loans against option value)
- In acquisition scenarios, understand the timeline — target company employees often have limited time to exercise

**Some companies offer extended exercise windows**: Later-stage private companies may offer 5-year or 10-year post-termination exercise windows for employees who have been with the company longer. Check your specific option agreement.

**ISO → NSO conversion**: ISOs automatically become NSOs 3 months after termination (or immediately upon death or disability). The favorable AMT treatment of ISOs disappears; the option continues as an NSO but with the extended exercise window if granted.

## Cashless Exercise Options

If you cannot afford to exercise options with cash, several mechanisms exist:

**Same-day sale (net exercise)**: Exercise options and immediately sell enough shares to cover the exercise price and taxes. You receive the net spread in cash or remaining shares. This is a disqualifying disposition for ISOs (shares not held 1+ year from exercise), triggering ordinary income on the spread.

**Net share settlement (NSO only)**: Some plans allow "cashless" exercise where the company withholds shares equal to the exercise price rather than requiring cash. You receive the net shares.

**Sell-to-cover**: Sell a portion of the exercised shares immediately to cover taxes (or exercise price), hold the remainder. Common mechanism for RSUs; less common for options.

**Personal loan or HELOC**: For employees who believe strongly in continued price appreciation and want to hold ISOs through the qualified holding period, a personal loan or HELOC to fund the cash exercise and AMT payment may be appropriate — with the risk that if the stock falls, the loan must still be repaid.
