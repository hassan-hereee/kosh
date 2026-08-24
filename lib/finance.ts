export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const compact = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/** Monthly payment on an amortising loan. */
export function monthlyPayment(principal: number, annualRatePct: number, months: number) {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

/**
 * Minimum-payment trap: 2% of balance (floored at $25) with interest accruing.
 * Returns the months to clear and the total interest paid.
 */
export function minimumPaymentPayoff(balance: number, annualRatePct: number) {
  const r = annualRatePct / 100 / 12;
  let bal = balance;
  let months = 0;
  let interest = 0;
  const firstPayment = Math.max(balance * 0.02, 25);

  while (bal > 0.5 && months < 720) {
    const accrued = bal * r;
    const pay = Math.max(bal * 0.02, 25);
    if (pay <= accrued) return { months: 720, interest: Infinity, firstPayment };
    interest += accrued;
    bal = bal + accrued - pay;
    months++;
  }
  return { months, interest, firstPayment };
}

export const yearsFromMonths = (m: number) => Math.round(m / 12);
