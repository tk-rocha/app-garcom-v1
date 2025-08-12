/**
 * Utility function to convert UUID to a temporary numeric ID for cart compatibility
 * This creates a consistent hash-based numeric ID from UUID
 */
export const uuidToNumericId = (uuid: string): number => {
  // Simple hash function to convert UUID to number
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

/**
 * Store mapping between numeric IDs and UUIDs for reverse lookup
 */
const idMapping = new Map<number, string>();
const reverseMapping = new Map<string, number>();

export const getNumericId = (uuid: string): number => {
  if (reverseMapping.has(uuid)) {
    return reverseMapping.get(uuid)!;
  }
  
  const numericId = uuidToNumericId(uuid);
  idMapping.set(numericId, uuid);
  reverseMapping.set(uuid, numericId);
  return numericId;
};

export const getUuidFromNumericId = (numericId: number): string | undefined => {
  return idMapping.get(numericId);
};