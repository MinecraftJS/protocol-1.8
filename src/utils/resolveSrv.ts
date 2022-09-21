import { resolveSrv as resolveSrvRecords } from 'node:dns/promises';
import { isIP } from 'node:net';

/**
 * Minecraft also looks for an SRV record, this
 * util function resolves the SRV record if there's
 * one. Otherwise it returns the provided host and port.
 * @param host Host to resolve
 * @param port Port
 * @returns The resolved host and port
 */
export async function resolveSrv(
  host: string,
  port: number
): Promise<{ host: string; port: number }> {
  function defaultValues() {
    return { host, port };
  }

  if (isIP(host) !== 0 || host === 'localhost') return defaultValues();

  const records = await resolveSrvRecords(`_minecraft._tcp.${host}`);

  // If there's no record return provided host and port
  if (!records || records.length < 1) return defaultValues();

  return {
    host: records[0].name,
    port: records[0].port,
  };
}
