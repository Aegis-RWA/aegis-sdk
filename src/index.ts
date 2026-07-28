export { AegisClient, AegisClientConfig } from './client';
export { ComplianceModule } from './compliance';
export { AssetModule } from './asset';
export { InvestorModule } from './investor/portfolio';
export { RoleModule } from './role';
export { parseSorobanResult } from './utils/xdr-parser';
export {
  buildAdminActionReceipt,
  buildAdminTransactionExplorerUrl,
  normalizeAdminActionStatus,
} from './admin/receipts';
export { classifyNetworkFailure } from './network/failures';
export {
  buildNetworkFailureDiagnostic,
  NetworkFailureDiagnostic,
  NetworkRecoveryAction,
} from './diagnostics/network';
export { resolveClientConfig } from './config/validate';
export { AEGIS_ENVIRONMENTS, getEnvironmentPreset } from './config/environments';
export * from './types/portfolio';
export * from './errors/portfolio';
export * from './types/role';
export * from './errors/role';
export * from './types/admin-receipt';
export * from './errors/network';
export * from './errors/config';
export type { AegisEnvironmentName, AegisEnvironmentPreset } from './config/environments';
export type { ResolvedAegisConfig } from './config/validate';
