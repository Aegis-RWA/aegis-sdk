import { xdr, scValToNative } from '@stellar/stellar-sdk';

/**
* Utility function to intercept raw XDR responses from the Soroban RPC
* and decode them into standard standard JavaScript/TypeScript types.
*
* @param resultXdr - The base64 encoded XDR string returned from an RPC call.
* @returns The parsed JavaScript primitive or object.
*/
export function parseSorobanResult(resultXdr: string): any {
  if (!resultXdr) {
    return null;
  }

  try {
    const parsedXdr = xdr.ScVal.fromXDR(resultXdr, 'base64');
    return scValToNative(parsedXdr);
  } catch (error) {
    // TODO: Create comprehensive XDR error mapping (translate raw Soroban error codes into readable string messages)
    console.error("Failed to parse Soroban XDR result:", error);
    throw new Error("XDR Parsing failed.");
  }
}