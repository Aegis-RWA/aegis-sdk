import { AegisClient } from '../src/client';
import { Networks, Keypair } from '@stellar/stellar-sdk';

describe('RoleModule', () => {
  let client: AegisClient;

  const mockContractId = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4';

  const makeClient = (keypair?: Keypair) =>
    new AegisClient({
      rpcUrl: 'https://soroban-testnet.stellar.org',
      networkPassphrase: Networks.TESTNET,
      contractId: mockContractId,
      keypair,
    });

  beforeEach(() => {
    client = makeClient();
  });

  describe('discoverRole', () => {
    it('classifies a whitelisted address as investor', async () => {
      jest.spyOn(client.compliance, 'checkWhitelist').mockResolvedValue(true);
      const address = Keypair.random().publicKey();

      const result = await client.role.discoverRole(address);

      expect(result.role).toBe('investor');
      expect(result.isKycApproved).toBe(true);
      expect(result.code).toBe('OK');
    });

    it('classifies a non-whitelisted address as unauthorized', async () => {
      jest.spyOn(client.compliance, 'checkWhitelist').mockResolvedValue(false);
      const address = Keypair.random().publicKey();

      const result = await client.role.discoverRole(address);

      expect(result.role).toBe('unauthorized');
      expect(result.isKycApproved).toBe(false);
      expect(result.code).toBe('OK');
    });

    it('returns unknown role with INVALID_ADDRESS code for an empty address', async () => {
      const result = await client.role.discoverRole('');

      expect(result.role).toBe('unknown');
      expect(result.code).toBe('INVALID_ADDRESS');
    });

    it('returns unknown role with COMPLIANCE_QUERY_FAILED when the whitelist RPC call fails', async () => {
      jest.spyOn(client.compliance, 'checkWhitelist').mockRejectedValue(new Error('RPC timeout'));
      const address = Keypair.random().publicKey();

      const result = await client.role.discoverRole(address);

      expect(result.role).toBe('unknown');
      expect(result.code).toBe('COMPLIANCE_QUERY_FAILED');
      expect(result.reason).toContain('RPC timeout');
    });

    it('flags hasLocalSigner true when the address matches the configured keypair', async () => {
      const signer = Keypair.random();
      const signedClient = makeClient(signer);
      jest.spyOn(signedClient.compliance, 'checkWhitelist').mockResolvedValue(true);

      const result = await signedClient.role.discoverRole(signer.publicKey());

      expect(result.hasLocalSigner).toBe(true);
    });

    it('flags hasLocalSigner false when no keypair is configured', async () => {
      jest.spyOn(client.compliance, 'checkWhitelist').mockResolvedValue(true);
      const address = Keypair.random().publicKey();

      const result = await client.role.discoverRole(address);

      expect(result.hasLocalSigner).toBe(false);
    });
  });

  describe('checkCapability', () => {
    it('always permits view_portfolio without querying compliance', async () => {
      const spy = jest.spyOn(client.compliance, 'checkWhitelist');
      const address = Keypair.random().publicKey();

      const result = await client.role.checkCapability(address, 'view_portfolio');

      expect(result.isPermitted).toBe(true);
      expect(spy).not.toHaveBeenCalled();
    });

    it('permits mint_asset when a signer is configured, without a compliance check', async () => {
      const signer = Keypair.random();
      const signedClient = makeClient(signer);
      const spy = jest.spyOn(signedClient.compliance, 'checkWhitelist');

      const result = await signedClient.role.checkCapability(signer.publicKey(), 'mint_asset');

      expect(result.isPermitted).toBe(true);
      expect(result.verified).toBe(false);
      expect(spy).not.toHaveBeenCalled();
    });

    it('denies mint_asset when no signer is configured', async () => {
      const address = Keypair.random().publicKey();

      const result = await client.role.checkCapability(address, 'mint_asset');

      expect(result.isPermitted).toBe(false);
      expect(result.code).toBe('NO_SIGNER_CONFIGURED');
    });

    it('permits receive_transfer for a whitelisted address', async () => {
      jest.spyOn(client.compliance, 'checkWhitelist').mockResolvedValue(true);
      const address = Keypair.random().publicKey();

      const result = await client.role.checkCapability(address, 'receive_transfer');

      expect(result.isPermitted).toBe(true);
      expect(result.code).toBe('OK');
    });

    it('denies receive_transfer for a non-whitelisted address', async () => {
      jest.spyOn(client.compliance, 'checkWhitelist').mockResolvedValue(false);
      const address = Keypair.random().publicKey();

      const result = await client.role.checkCapability(address, 'receive_transfer');

      expect(result.isPermitted).toBe(false);
      expect(result.code).toBe('NOT_WHITELISTED');
    });

    it('denies initiate_transfer when whitelisted but no signer is configured', async () => {
      jest.spyOn(client.compliance, 'checkWhitelist').mockResolvedValue(true);
      const address = Keypair.random().publicKey();

      const result = await client.role.checkCapability(address, 'initiate_transfer');

      expect(result.isPermitted).toBe(false);
      expect(result.code).toBe('NO_SIGNER_CONFIGURED');
    });

    it('permits initiate_transfer when whitelisted and a matching signer is configured', async () => {
      const signer = Keypair.random();
      const signedClient = makeClient(signer);
      jest.spyOn(signedClient.compliance, 'checkWhitelist').mockResolvedValue(true);

      const result = await signedClient.role.checkCapability(signer.publicKey(), 'initiate_transfer');

      expect(result.isPermitted).toBe(true);
    });

    it('returns COMPLIANCE_QUERY_FAILED when the whitelist RPC call fails', async () => {
      jest.spyOn(client.compliance, 'checkWhitelist').mockRejectedValue(new Error('RPC down'));
      const address = Keypair.random().publicKey();

      const result = await client.role.checkCapability(address, 'receive_transfer');

      expect(result.isPermitted).toBe(false);
      expect(result.code).toBe('COMPLIANCE_QUERY_FAILED');
    });

    it('rejects an invalid address before any compliance check', async () => {
      const spy = jest.spyOn(client.compliance, 'checkWhitelist');

      const result = await client.role.checkCapability('', 'receive_transfer');

      expect(result.isPermitted).toBe(false);
      expect(result.code).toBe('INVALID_ADDRESS');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('getCapabilityMatrix', () => {
    it('evaluates every known capability for an address in one call', async () => {
      jest.spyOn(client.compliance, 'checkWhitelist').mockResolvedValue(true);
      const address = Keypair.random().publicKey();

      const matrix = await client.role.getCapabilityMatrix(address);

      expect(matrix.address).toBe(address);
      expect(matrix.capabilities).toHaveLength(4);
      const names = matrix.capabilities.map((c) => c.capability);
      expect(names).toEqual(
        expect.arrayContaining([
          'view_portfolio',
          'receive_transfer',
          'initiate_transfer',
          'mint_asset',
        ])
      );
    });
  });
});
