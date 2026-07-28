/**
 * Migration Example: Compliance / KYC Whitelist Check
 *
 * Shows the equivalent raw Soroban call vs Aegis SDK usage.
 */
import { rpc, Contract, nativeToScVal, xdr, scValToNative } from '@stellar/stellar-sdk';
import { AegisClient } from '@aegis/sdk';

// ============================================================
// BEFORE: Raw Soroban Contract Calls
// ============================================================

async function checkWhitelistRaw(
  rpcServer: rpc.Server,
  contractId: string,
  address: string
): Promise<boolean> {
  const contract = new Contract(contractId);
  const call = contract.call(
    'is_whitelisted',
    nativeToScVal(address, { type: 'address' })
  );

  try {
    const result = await rpcServer.simulateTransaction({
      transaction: call as any,
    } as any);

    if (rpc.Api.isSimulationSuccess(result) && result.result) {
      const parsed = scValToNative(
        xdr.ScVal.fromXDR(result.result.retval, 'base64')
      );
      return parsed as boolean;
    }

    return false;
  } catch (error) {
    console.error('RPC Simulation failed:', error);
    throw error;
  }
}

// ============================================================
// AFTER: Aegis SDK
// ============================================================

async function checkWhitelistSDK(client: AegisClient, address: string): Promise<boolean> {
  return client.compliance.checkWhitelist(address);
}

// ============================================================
// Usage
// ============================================================

async function main() {
  const client = new AegisClient({
    rpcUrl: 'https://soroban-testnet.stellar.org',
    networkPassphrase: 'Test SDF Network ; September 2015',
    contractId: 'C_YOUR_CONTRACT_ID',
  });

  const userAddress = 'G_USER_PUBLIC_KEY_HERE';

  // SDK approach — clean, typed, no XDR handling
  const isWhitelisted = await checkWhitelistSDK(client, userAddress);
  console.log(`User ${userAddress} whitelisted: ${isWhitelisted}`);
}

main().catch(console.error);
