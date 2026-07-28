import { createMockAegisClient, createMockFixtures } from '../src/testing';

/**
 * Example dashboard-style test using the mock client instead of live RPC.
 * Demonstrates predictable portfolio responses for downstream UI tests.
 */
describe('Dashboard examples (mock client)', () => {
  it('renders a whitelisted investor dashboard snapshot', async () => {
    const fixtures = createMockFixtures();
    const client = createMockAegisClient({ keypair: fixtures.signer });

    client.setWhitelisted(fixtures.investorAddress, true);
    client.setBalance(fixtures.investorAddress, '2500000000');

    const [isApproved, portfolio] = await Promise.all([
      client.compliance.checkWhitelist(fixtures.investorAddress),
      client.investor.getPortfolio(fixtures.investorAddress),
    ]);

    expect(isApproved).toBe(true);
    expect(portfolio).toMatchObject({
      investorAddress: fixtures.investorAddress,
      status: 'active',
      totalHoldingsCount: 1,
      holdings: [
        expect.objectContaining({
          formattedBalance: '250.00',
          transferEligibility: expect.objectContaining({ isEligible: true }),
        }),
      ],
    });
  });

  it('records mint receipts for transaction history views', async () => {
    const fixtures = createMockFixtures();
    const client = createMockAegisClient({ keypair: fixtures.signer });

    const hash = await client.asset.mint(fixtures.investorAddress, 500);

    expect(client.transactions[0].hash).toBe(hash);
    expect(client.transactions[0].type).toBe('mint');
  });
});
