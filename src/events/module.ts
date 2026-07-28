import { rpc } from '@stellar/stellar-sdk';
import { AegisClient } from '../client';
import {
  AegisContractEvent,
  ContractEventInput,
  DecodeContractEventOptions,
} from '../types/contract-event';
import { decodeContractEvent, decodeContractEvents } from './decoder';

export type FetchContractEventsRequest = Parameters<rpc.Server['getEvents']>[0];

export interface FetchContractEventsOptions extends DecodeContractEventOptions {
  startLedger?: number;
  cursor?: string;
  limit?: number;
}

/**
 * Module for fetching and decoding Aegis contract events from Soroban RPC.
 */
export class EventsModule {
  private client: AegisClient;

  constructor(client: AegisClient) {
    this.client = client;
  }

  /**
   * Decodes a raw or parsed Soroban contract event.
   */
  public decode(
    input: ContractEventInput,
    options?: DecodeContractEventOptions
  ): AegisContractEvent {
    return decodeContractEvent(input, options);
  }

  /**
   * Fetches contract events from RPC and decodes them into typed Aegis events.
   */
  public async fetchAndDecode(
    request: FetchContractEventsRequest,
    options: FetchContractEventsOptions = {}
  ): Promise<{
    latestLedger: number;
    events: AegisContractEvent[];
    cursor?: string;
  }> {
    const response = await this.client.runNetworkOperation(() =>
      this.client.rpcServer.getEvents(request)
    );

    const inputs: ContractEventInput[] = response.events.map((event) => ({
      contractId: event.contractId?.toString(),
      txHash: event.txHash,
      ledger: event.ledger,
      inSuccessfulContractCall: event.inSuccessfulContractCall,
      topic: event.topic,
      value: event.value,
    }));

    return {
      latestLedger: response.latestLedger,
      events: decodeContractEvents(inputs, options),
      cursor: response.events.at(-1)?.pagingToken,
    };
  }
}
