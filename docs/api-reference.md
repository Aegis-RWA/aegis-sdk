# API Reference

## `AegisClient`

The entry point for interacting with the Aegis Protocol.

### Constructor Parameters
* `rpcUrl` (string): The URL of the Soroban RPC node you are connecting to.
* `networkPassphrase` (string): The Stellar network passphrase (e.g., `Networks.TESTNET` or `Networks.PUBLIC`).
* `contractId` (string): The StrKey-encoded Contract ID of the deployed Aegis contract.
* `keypair` (Keypair, optional): A Stellar SDK Keypair object used for signing state-changing transactions (like minting or transferring). If omitted, the client can only make read-only calls.

### Client Modules
* `client.compliance`: Whitelist & KYC verification module (`ComplianceModule`).
* `client.asset`: Minting & transferring RWA tokens module (`AssetModule`).
* `client.investor`: Investor portfolio read model module (`InvestorModule`). See [Investor Portfolio Documentation](./investor-portfolio.md).
* `client.role`: Role discovery & capability checks module (`RoleModule`). See [Role Discovery & Capability Checks Documentation](./role-discovery.md).

## `InvestorModule`

Read model service for building investor dashboard views.

### Methods
* `getPortfolio(investorAddress: string, options?: FetchPortfolioOptions): Promise<InvestorPortfolio>`
  Fetches investor balances, KYC whitelist compliance, asset metadata, formatted display balances, transfer eligibility, and operational portfolio status (`active`, `empty`, `blocked`, `unavailable`).

## `RoleModule`

Client-side role discovery and capability checks. Not a substitute for on-chain
authorization — see [Role Discovery & Capability Checks Documentation](./role-discovery.md)
for the full security note.

### Methods
* `discoverRole(address: string): Promise<RoleDiscoveryResult>`
  Classifies an address as `investor`, `unauthorized`, or `unknown` based on whitelist status.
* `checkCapability(address: string, capability: CapabilityName): Promise<CapabilityCheckResult>`
  Evaluates a single capability (`view_portfolio`, `receive_transfer`, `initiate_transfer`, `mint_asset`).
* `getCapabilityMatrix(address: string): Promise<CapabilityMatrix>`
  Evaluates all known capabilities for an address in one call.

## Error Handling Strategies

Soroban transactions and RPC queries can fail for several reasons. The SDK manages errors with custom taxonomy (`PortfolioError`) and safe fallbacks:
1. **Simulation Failures:** If a transaction is simulated and fails (e.g., trying to transfer to a non-whitelisted address), the SDK intercepts the RPC error and throws before submitting to the ledger.
2. **Transaction Timeouts:** If the Stellar network is congested and the transaction is not included in a ledger within the timeout window.
3. **XDR Parsing Errors:** If the contract returns data that does not match the expected return type.
4. **Safe Read Model Fallbacks:** Portfolio queries intercept network/RPC failures and return an `InvestorPortfolio` with `status: 'unavailable'` to prevent frontend application crashes.