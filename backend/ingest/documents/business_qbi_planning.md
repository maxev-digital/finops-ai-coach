# QBI Deduction Planning for Business Owners: Implementation Strategies

## QBI Deduction Foundation (See Also: tax_qbi_deduction.md)

The Section 199A Qualified Business Income (QBI) deduction allows pass-through business owners (sole proprietors, S-Corp owners, partners in LLCs/partnerships) to deduct up to 20% of qualified business income. At the 37% marginal rate, a 20% deduction on QBI is worth 37% × 20% = 7.4% effective tax rate reduction on each dollar of eligible QBI.

This document focuses on implementation strategies — primarily around S-Corporation salary optimization, the W-2 wage limitation interaction, and cross-cutting tax planning decisions.

## S-Corp Salary Optimization for QBI: The Core Tradeoff

S-Corp owners face a fundamental tension:

- **Every dollar of W-2 salary** pays FICA payroll taxes (15.3% up to the Social Security wage base of $176,100; 2.9% above) AND is removed from the QBI calculation (reducing the 20% deduction)
- **Every dollar of S-Corp distribution** avoids payroll taxes AND is included in QBI (increasing the 20% deduction)

The optimization question: at what salary level do the payroll tax savings from lower salary + QBI benefit of more income in distribution form maximize net after-tax income?

### Below the Phase-Out Threshold: Minimize Salary to Reasonable Comp

For S-Corp owners below the QBI phase-out threshold ($197,300 single / $394,600 MFJ in 2025), the QBI deduction is not limited by W-2 wages. Every dollar shifted from salary to distribution:

1. Saves payroll taxes (15.3% up to wage base)
2. Includes more income in QBI base (generates 20% QBI deduction)

**Net effect of $1 moved from salary to distribution (below phase-out, in 22% bracket)**:
- Payroll tax savings: approximately $0.153 (15.3% × $1)
- Additional QBI deduction: $0.20 × 22% = $0.044 tax savings
- Total savings: approximately $0.197 per $1 shifted from salary to distribution

The incentive is clear: minimize salary to reasonable compensation minimum to maximize both payroll tax savings and QBI deduction. The IRS constraint is "reasonable" — see entity selection document.

### Above the Phase-Out Threshold: The W-2 Wage Limitation

For S-Corp owners above the complete phase-out threshold ($197,300 single / $394,600 MFJ), the QBI deduction is limited to the LESSER of:
- 20% of QBI, OR
- The greater of: 50% of W-2 wages, OR 25% of W-2 wages + 2.5% of the unadjusted basis of qualified depreciable property

This means the QBI deduction is now CAPPED by the company's W-2 wage bill.

**The reversal**: Above the phase-out, a HIGHER W-2 salary increases W-2 wages, which increases the W-2 limitation, which allows a HIGHER QBI deduction. For high-income business owners above the threshold, increasing the salary can increase the total QBI deduction — the opposite of the below-threshold strategy.

**Example**:
- S-Corp profit: $700,000
- Salary: $100,000
- W-2 wage limitation: 50% × $100,000 = $50,000 limit on QBI deduction
- QBI = $700,000 − $100,000 salary = $600,000; 20% of QBI = $120,000
- Deduction limited to $50,000 (the W-2 wage limitation)

If salary increases to $200,000:
- W-2 wage limitation: 50% × $200,000 = $100,000
- QBI = $500,000; 20% of QBI = $100,000
- Deduction = $100,000 (still limited by W-2 wages but larger)

The payroll tax on additional $100,000 salary ≈ $2,900 (only Medicare above SS wage base). The QBI deduction increase of $50,000 × 37% = $18,500 in tax savings. Net benefit: +$15,600.

**Optimization**: For high-income owners above the phase-out, model the optimal salary to maximize (QBI deduction benefit − payroll tax cost). This typically requires increasing salary above what would be ideal purely for payroll tax minimization.

## Depreciation and Section 179 Interaction with QBI

Bonus depreciation (100% through 2022, now phasing down) and Section 179 immediate expensing reduce taxable income and QBI simultaneously.

**The tradeoff**:
- Taking §179 or bonus depreciation in Year 1 reduces that year's taxable income and QBI dramatically
- But it also reduces the QBI deduction base in Year 1
- Net effect: $1 of §179 deduction reduces taxable income by $1.00, but also reduces QBI deduction by $0.20 — so the net tax saving from §179 is (1 − 0.20) × tax rate = 0.80 × 37% = 29.6% effective savings, not 37%

This is not a reason to avoid §179/bonus depreciation (immediate expensing is still a time-value benefit), but it means the effective benefit is slightly lower for QBI-eligible businesses than the nominal deduction suggests.

**Depreciation recapture and QBI**: §1245 recapture (ordinary income on depreciation of personal property) is included in QBI and can increase the QBI deduction in the year of the sale. §1231 gains exceeding §1231 losses are treated as long-term capital gains and excluded from QBI.

## QBI and Health Insurance Deduction Interaction

Self-employed health insurance premiums are deductible as an above-the-line adjustment on Form 1040 — reducing AGI. For S-Corp owners, health insurance must be included in the owner's W-2 wages to be deductible, then deducted on the personal return.

**The QBI interaction**: The self-employed health insurance deduction reduces AGI and also reduces QBI — because for S-Corp owners, the health insurance premium is an employer expense that flows through to the W-2, reducing S-Corp profit and thus QBI.

**Example**: $200,000 S-Corp profit. Owner pays $15,000 health insurance premium as fringe benefit through S-Corp. The premium reduces S-Corp profit (reducing QBI to $185,000) but is also W-2 income to the owner (then deducted on Schedule 1). Net: health insurance reduces QBI by $15,000, reducing the QBI deduction by $3,000 (20% × $15,000). The net tax saving on the premium is still positive — 100% deductible as health insurance minus the 20% QBI deduction loss.

## SSTB Income Allocation

Specified Service Trade or Business (SSTB) income — from law, medicine, accounting, financial services, consulting, and similar professions — is excluded from the QBI deduction entirely for owners above the phase-out threshold (but fully eligible below the threshold).

**If a business has both SSTB and non-SSTB components**: Allocate gross receipts, expenses, and assets between the two activities. The non-SSTB portion retains QBI eligibility for owners above the threshold.

**Example**: A physician who also owns a medical equipment company. The physician services are SSTB; the equipment company is non-SSTB. With proper allocation, the equipment company income remains eligible for the QBI deduction even if the physician owner's income exceeds the phase-out.

**The 10% de minimis rule**: If SSTB-related gross receipts are less than 10% of the business's total gross receipts, the entire business is treated as a non-SSTB. This can allow a primarily non-service business with incidental consulting revenue to preserve full QBI eligibility.

## Aggregation Election

Multiple qualifying businesses under the same ownership can be aggregated into a single entity for QBI deduction purposes. This can be strategically valuable when:

- One business has high W-2 wages (increases the W-2 limitation)
- Another business has high QBI but few employees (limited by W-2 wages)
- Aggregating allows the high-W-2 business's wages to support the QBI deduction for the low-wage business

**Requirements for aggregation**:
- Same person or group must own 50%+ of each business
- Businesses must share at least two of three characteristics: the same customers, products/services, or employees/facilities
- Must make a consistent aggregation election each year and disclose on the return

**Aggregation is irrevocable annually**: Once you aggregate for a tax year, you cannot disaggregate for the same year. You can change the aggregation structure in future years.

## QBI Carryforward Loss

If QBI for a year is negative (business loss), the negative amount carries forward to the next year as a reduction in future QBI. This "QBI loss carryforward" reduces the future QBI deduction:

**Example**: Year 1 net QBI loss of $50,000 (startup year). Year 2 QBI income of $200,000. Year 2 QBI after carryforward = $200,000 − $50,000 = $150,000. Year 2 QBI deduction = 20% × $150,000 = $30,000 (not $40,000).

Track QBI loss carryforwards on Form 8995 or Form 8995-A.

## Planning for 2025 Sunset

The Section 199A QBI deduction is a TCJA provision — it is scheduled to expire after December 31, 2025. If Congress allows it to sunset, pass-through businesses would no longer receive the 20% deduction beginning in 2026.

**Planning implications**:
- Accelerate income into 2025 if you are a pass-through business with significant QBI eligibility and the deduction sunsets (receive the 20% deduction on income taxed in 2025; lose it on 2026 income)
- Entity structure reconsideration: if QBI deduction is eliminated, the pass-through vs. C-Corp comparison changes — C-Corp's 21% flat rate vs. individual rates without the 20% QBI offset becomes more favorable for some businesses
- Monitor legislation through year-end 2025
