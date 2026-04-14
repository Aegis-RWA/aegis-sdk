# API Reference

## `AegisClient`

The entry point for interacting with the Aegis Protocol.

### Constructor Parameters
* `rpcUrl` (string): The URL of the Soroban RPC node you are connecting to.
* `networkPassphrase` (string): The Stellar network passphrase (e.g., `Networks.TESTNET` or `Networks.PUBLIC`).
* `contractId` (string): The StrKey-encoded Contract ID of the deployed Aegis contract.
* `keypair` (Keypair, optional): A Stellar SDK Keypair object used for signing state-changing transactions (like minting or transferring). If omitted, the client can only make read-only calls.

## Error Handling Strategies

Soroban transactions can fail for several reasons. The SDK will throw standard JavaScript `Error` objects in the following scenarios:
1. **Simulation Failures:** If a transaction is simulated and fails (e.g., trying to transfer to a non-whitelisted address), the SDK intercepts the RPC error and throws before submitting to the ledger.
2. **Transaction Timeouts:** If the Stellar network is congested and the transaction is not included in a ledger within the timeout window.
3. **XDR Parsing Errors:** If the contract returns data that does not match the expected return type.