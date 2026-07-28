# API Reference

## `AegisClient`

The entry point for interacting with the Aegis Protocol.

### Constructor Parameters
* `environment` (`'testnet' | 'local' | 'mainnet'`, optional): A typed environment preset that supplies `rpcUrl` and `networkPassphrase` automatically. See [Environment Presets](./environments.md).
* `rpcUrl` (string, optional): The URL of the Soroban RPC node you are connecting to. Required if `environment` is omitted; otherwise overrides the preset's default.
* `networkPassphrase` (string, optional): The Stellar network passphrase (e.g., `Networks.TESTNET` or `Networks.PUBLIC`). Required if `environment` is omitted; otherwise overrides the preset's default.
* `contractId` (string): The StrKey-encoded Contract ID of the deployed Aegis contract.
* `keypair` (Keypair, optional): A Stellar SDK Keypair object used for signing state-changing transactions (like minting or transferring). If omitted, the client can only make read-only calls.
* `allowMainnet` (boolean, optional): Must be `true` to use `environment: 'mainnet'`, which is gated until the Aegis protocol is live on the public network.

Either `environment` or both `rpcUrl` and `networkPassphrase` must be provided. Invalid or unsafe configuration (malformed URLs, insecure `http://` overrides outside the `local` preset, empty passphrases, unavailable environments) throws a `ConfigValidationError`.

### Client Modules
* `client.compliance`: Whitelist & KYC verification module (`ComplianceModule`).
* `client.asset`: Minting & transferring RWA tokens module (`AssetModule`).
* `client.investor`: Investor portfolio read model module (`InvestorModule`). See [Investor Portfolio Documentation](./investor-portfolio.md).

## `InvestorModule`

Read model service for building investor dashboard views.

### Methods
* `getPortfolio(investorAddress: string, options?: FetchPortfolioOptions): Promise<InvestorPortfolio>`
  Fetches investor balances, KYC whitelist compliance, asset metadata, formatted display balances, transfer eligibility, and operational portfolio status (`active`, `empty`, `blocked`, `unavailable`).

## Error Handling Strategies

Soroban transactions and RPC queries can fail for several reasons. The SDK manages errors with custom taxonomy (`PortfolioError`) and safe fallbacks:
1. **Simulation Failures:** If a transaction is simulated and fails (e.g., trying to transfer to a non-whitelisted address), the SDK intercepts the RPC error and throws before submitting to the ledger.
2. **Transaction Timeouts:** If the Stellar network is congested and the transaction is not included in a ledger within the timeout window.
3. **XDR Parsing Errors:** If the contract returns data that does not match the expected return type.
4. **Safe Read Model Fallbacks:** Portfolio queries intercept network/RPC failures and return an `InvestorPortfolio` with `status: 'unavailable'` to prevent frontend application crashes.
5. **Configuration Validation:** `AegisClient` validates its configuration at construction time and throws a `ConfigValidationError` (with a machine-readable `code`) for unsafe RPC URLs, empty passphrases, unknown environments, or a gated `mainnet` preset used without `allowMainnet: true`. See [Environment Presets](./environments.md).