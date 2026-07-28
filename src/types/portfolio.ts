/**
 * Portfolio status indicator representing the operational state of an investor's portfolio.
 */
export type PortfolioStatus = 'active' | 'empty' | 'blocked' | 'unavailable' | 'unknown';

/**
 * Detailed transfer eligibility evaluation for an asset holding.
 */
export interface TransferEligibility {
  isEligible: boolean;
  reason?: string;
  code?: string;
}

/**
 * Metadata for a Real World Asset (RWA) or tokenized asset.
 */
export interface AssetMetadata {
  symbol: string;
  name: string;
  decimals: number;
  isRwa: boolean;
  category?: string;
  contractId?: string;
}

/**
 * Individual asset holding for an investor.
 */
export interface AssetHolding {
  assetId: string;
  balance: string;
  formattedBalance: string;
  metadata: AssetMetadata;
  isCompliant: boolean;
  transferEligibility: TransferEligibility;
}

/**
 * Complete investor portfolio read model representing balances, compliant holdings,
 * asset metadata, transfer eligibility, and status.
 */
export interface InvestorPortfolio {
  investorAddress: string;
  status: PortfolioStatus;
  totalHoldingsCount: number;
  compliantHoldingsCount: number;
  holdings: AssetHolding[];
  isKycApproved: boolean;
  isBlocked: boolean;
  fetchedAt: string;
  error?: string;
}

/**
 * Options for querying an investor portfolio.
 */
export interface FetchPortfolioOptions {
  includeMetadata?: boolean;
  assetContractIds?: string[];
  timeoutMs?: number;
}
