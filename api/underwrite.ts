export const config = {
  runtime: "edge"
};

type Transaction = {
  date: string;
  description?: string;
  amount: number;
  type?: "credit" | "debit";
  category?: string;
  balance?: number;
};

type UnderwriteRequest = {
  business_name?: string;
  industry?: string;
  opening_balance?: number;
  analysis_period_months?: number;
  transactions: Transaction[];
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: corsHeaders
  });
}

function round(value: number, decimals = 2) {
  return Number(value.toFixed(decimals));
}

function monthKey(date: string) {
  return date.slice(0, 7);
}

function normalizeAmount(tx: Transaction) {
  if (tx.type === "credit") return Math.abs(tx.amount);
  if (tx.type === "debit") return -Math.abs(tx.amount);
  return tx.amount;
}

function isDebtPayment(tx: Transaction) {
  const text = `${tx.description ?? ""} ${tx.category ?? ""}`.toLowerCase();
  return (
    text.includes("loan") ||
    text.includes("debt") ||
    text.includes("mca") ||
    text.includes("financing") ||
    text.includes("credit card") ||
    text.includes("repayment")
  );
}

function isOverdraft(tx: Transaction, runningBalance: number) {
  const text = `${tx.description ?? ""} ${tx.category ?? ""}`.toLowerCase();
  return (
    runningBalance < 0 ||
    text.includes("overdraft") ||
    text.includes("nsf") ||
    text.includes("insufficient funds")
  );
}

function standardDeviation(values: number[]) {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    values.length;
  return Math.sqrt(variance);
}

function getVolatilityLabel(volatilityRatio: number) {
  if (volatilityRatio < 0.15) return "Low";
  if (volatilityRatio < 0.35) return "Medium";
  return "High";
}

function getRiskLevel(score: number) {
  if (score >= 75) return "Low";
  if (score >= 55) return "Moderate";
  return "High";
}

function getOrdinal(day: number) {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function getRecommendedCollectionWindow(transactions: Transaction[]) {
  const depositsByDay: Record<number, number> = {};

  for (const tx of transactions) {
    const amount = normalizeAmount(tx);
    if (amount <= 0 || !tx.date) continue;
    const day = Number(tx.date.slice(8, 10));
    depositsByDay[day] = (depositsByDay[day] ?? 0) + amount;
  }

  let bestStart = 1;
  let bestTotal = 0;

  for (let start = 1; start <= 26; start++) {
    let windowTotal = 0;
    for (let day = start; day < start + 5; day++) {
      windowTotal += depositsByDay[day] ?? 0;
    }
    if (windowTotal > bestTotal) {
      bestTotal = windowTotal;
      bestStart = start;
    }
  }

  const bestEnd = bestStart + 4;
  return `${bestStart}${getOrdinal(bestStart)}–${bestEnd}${getOrdinal(bestEnd)} of each month`;
}

function createPlainEnglishExplanation(params: {
  businessName: string;
  riskLevel: string;
  avgMonthlyDeposits: number;
  avgBalance: number;
  volatilityLabel: string;
  overdraftCount: number;
  lowBalanceDays: number;
  debtToDepositRatio: number;
  recommendedCollectionWindow: string;
}) {
  const {
    businessName,
    riskLevel,
    avgMonthlyDeposits,
    avgBalance,
    volatilityLabel,
    overdraftCount,
    lowBalanceDays,
    debtToDepositRatio,
    recommendedCollectionWindow
  } = params;

  return `${businessName} shows ${riskLevel.toLowerCase()} cash-flow risk based on transaction activity. Average monthly deposits are $${Math.round(
    avgMonthlyDeposits
  ).toLocaleString()}, with an estimated average balance of $${Math.round(
    avgBalance
  ).toLocaleString()}. Cash-flow volatility is ${volatilityLabel.toLowerCase()}, and the business had ${overdraftCount} overdraft or negative-balance event(s) during the analysis period. Debt payments represent ${Math.round(
    debtToDepositRatio * 100
  )}% of average monthly deposits, and there were ${lowBalanceDays} low-balance day(s). Recommended repayment collection window: ${recommendedCollectionWindow}. This summary is for underwriting support only and should be reviewed by a human analyst before any credit decision.`;
}

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(
      {
        status: "error",
        message: "Method not allowed. Use POST /api/underwrite."
      },
      405
    );
  }

  try {
    const body = (await request.json()) as UnderwriteRequest;

    if (!body.transactions || !Array.isArray(body.transactions)) {
      return jsonResponse(
        {
          status: "error",
          message: "Missing required field: transactions must be an array."
        },
        400
      );
    }

    if (body.transactions.length === 0) {
      return jsonResponse(
        {
          status: "error",
          message: "At least one transaction is required."
        },
        400
      );
    }

    const businessName = body.business_name ?? "Demo Business";
    const industry = body.industry ?? "Small Business";
    const openingBalance = body.opening_balance ?? 10000;

    const transactions = [...body.transactions]
      .filter((tx) => tx.date && typeof tx.amount === "number")
      .sort((a, b) => a.date.localeCompare(b.date));

    const uniqueMonths = new Set(transactions.map((tx) => monthKey(tx.date)));
    const monthsAnalyzed = body.analysis_period_months ?? Math.max(uniqueMonths.size, 1);

    const monthlyDeposits: Record<string, number> = {};
    let runningBalance = openingBalance;
    let balanceTotal = 0;
    let balanceObservations = 0;
    let overdraftCount = 0;
    let totalDeposits = 0;
    let totalOutflows = 0;
    let totalDebtPayments = 0;
    const lowBalanceDateSet = new Set<string>();

    for (const tx of transactions) {
      const amount = normalizeAmount(tx);
      const month = monthKey(tx.date);
      runningBalance = tx.balance ?? runningBalance + amount;
      balanceTotal += runningBalance;
      balanceObservations += 1;

      if (amount > 0) {
        monthlyDeposits[month] = (monthlyDeposits[month] ?? 0) + amount;
        totalDeposits += amount;
      }

      if (amount < 0) {
        const outflow = Math.abs(amount);
        totalOutflows += outflow;
        if (isDebtPayment(tx)) totalDebtPayments += outflow;
      }

      if (isOverdraft(tx, runningBalance)) overdraftCount += 1;
      if (runningBalance < 2500) lowBalanceDateSet.add(tx.date);
    }

    const monthlyDepositValues = Object.values(monthlyDeposits);
    const avgMonthlyDeposits = totalDeposits / monthsAnalyzed;
    const avgMonthlyOutflows = totalOutflows / monthsAnalyzed;
    const avgMonthlyDebtPayments = totalDebtPayments / monthsAnalyzed;
    const avgBalance = balanceObservations > 0 ? balanceTotal / balanceObservations : openingBalance;
    const monthlyNetCashFlow = avgMonthlyDeposits - avgMonthlyOutflows;
    const volatilityRatio = avgMonthlyDeposits > 0 ? standardDeviation(monthlyDepositValues) / avgMonthlyDeposits : 0;
    const volatilityLabel = getVolatilityLabel(volatilityRatio);
    const debtToDepositRatio = avgMonthlyDeposits > 0 ? avgMonthlyDebtPayments / avgMonthlyDeposits : 0;
    const estimatedWeeksOfLiquidity = avgMonthlyOutflows > 0 ? avgBalance / (avgMonthlyOutflows / 4.33) : 0;
    const monthlyRepaymentCapacity = Math.max(monthlyNetCashFlow * 0.35, 0);
    const recommendedLoanAmount = Math.max(
      0,
      Math.round(Math.min(monthlyRepaymentCapacity * 6, avgMonthlyDeposits * 1.2) / 1000) * 1000
    );

    let riskScore = 100;
    riskScore -= overdraftCount * 8;
    riskScore -= lowBalanceDateSet.size * 1.5;
    riskScore -= volatilityRatio * 50;
    riskScore -= debtToDepositRatio * 100;
    if (monthlyNetCashFlow < 0) riskScore -= 25;
    if (estimatedWeeksOfLiquidity < 4) riskScore -= 10;
    riskScore = Math.max(0, Math.min(100, riskScore));

    const riskLevel = getRiskLevel(riskScore);
    const analystReviewRequired =
      riskLevel !== "Low" ||
      overdraftCount >= 2 ||
      debtToDepositRatio > 0.2 ||
      estimatedWeeksOfLiquidity < 4;

    const recommendedCollectionWindow = getRecommendedCollectionWindow(transactions);
    const aiExplanation = createPlainEnglishExplanation({
      businessName,
      riskLevel,
      avgMonthlyDeposits,
      avgBalance,
      volatilityLabel,
      overdraftCount,
      lowBalanceDays: lowBalanceDateSet.size,
      debtToDepositRatio,
      recommendedCollectionWindow
    });

    return jsonResponse({
      status: "success",
      timestamp: new Date().toISOString(),
      business: {
        name: businessName,
        industry,
        months_analyzed: monthsAnalyzed
      },
      analysis: {
        risk_score: Math.round(riskScore),
        risk_level: riskLevel,
        analyst_review_required: analystReviewRequired,
        recommended_loan_amount: recommendedLoanAmount,
        recommended_collection_window: recommendedCollectionWindow,
        metrics: {
          average_monthly_deposits: round(avgMonthlyDeposits),
          average_monthly_outflows: round(avgMonthlyOutflows),
          average_balance: round(avgBalance),
          monthly_net_cash_flow: round(monthlyNetCashFlow),
          cash_flow_volatility_ratio: round(volatilityRatio, 3),
          cash_flow_volatility: volatilityLabel,
          overdraft_count: overdraftCount,
          low_balance_days: lowBalanceDateSet.size,
          monthly_debt_payments: round(avgMonthlyDebtPayments),
          debt_to_deposit_ratio: round(debtToDepositRatio, 3),
          estimated_weeks_of_liquidity: round(estimatedWeeksOfLiquidity, 1)
        },
        ai_explanation: aiExplanation,
        explanation_source: "rules_template_v1"
      },
      disclaimer:
        "Portfolio demo and underwriting support only. This is not a credit approval, decline, or adverse action decision."
    });
  } catch {
    return jsonResponse(
      {
        status: "error",
        message: "Invalid request body. Send valid JSON."
      },
      400
    );
  }
}
