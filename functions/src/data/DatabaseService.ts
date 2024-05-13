import {Reference} from "firebase-admin/database";
import {Database} from "firebase-admin/lib/database/database";
import * as logger from "firebase-functions/logger";

import {DataItem} from "../../../shared/types";
import {getUnixTimestamp} from "../../../shared/utils";

/**
 * Manages basic operations for objects stored in the Realtime DB.
 * The dictionary in the DB must be a collection of items of type
 * T where the id of each item is the key in the dictionary.
 * @template T The type of the items in the dictionary.
 * @param db The Realtime DB instance.
 * @param refPath The path to the dictionary in the Realtime DB.
 */
export class DatabaseService<T extends Partial<DataItem>> {
  private readonly db: Database;
  private readonly dictRefPath: string;

  constructor(db: Database, dictRefPath: string) {
    this.db = db;
    this.dictRefPath = dictRefPath;
  }

  /**
   * Read all items from the Realtime DB.
   * @return The list of items.
   */
  public async getAll(): Promise<T[]> {
    const snapshot = await this.getDictRef().get();
    if (snapshot.exists()) {
      const itemsDict: Record<string, T> = snapshot.val();

      let items: T[] = [];
      if (itemsDict) {
        items = Object.keys(itemsDict).map((key) => {
          const item: T = itemsDict[key];
          item.id = key;
          return item;
        });
      }
      return items;
    }
    return [];
  }

  /**
   * Read an item from the Realtime DB.
   * @param id The ID of the item.
   * @return The item, or null if not found.
   */
  public async get(id: string): Promise<T | null> {
    const snapshot = await this.getDictRef().child(id).get();
    if (snapshot.exists()) {
      const item: T = snapshot.val();
      item.id = id;
      return item;
    }

    return null;
  }

  /**
   * Add an item to the Realtime DB.
   * @param item The item to add.
   * @return The added item.
   */
  public async add(item: T): Promise<T> {
    logger.info(`Adding an item (type ${typeof item}) to Realtime DB`, item);

    const curDateTime = getUnixTimestamp();
    item.dateCreatedUtc = curDateTime;
    item.dateUpdatedUtc = curDateTime;
    const newItemRef = await this.getDictRef().push(item);

    if (!newItemRef.key) {
      throw new Error("Failed to add item to Realtime DB");
    }
    logger.info("Test case added to Realtime DB", newItemRef.key);

    item.id = newItemRef.key;
    return item;
  }

  
  /**
   * Add an item to the Realtime DB.
   * @param itemId The ID of the item to update.
   * @param item The updated item values.
   * @return The updated item.
   */
  public async update(itemId: string, item: Partial<T>): Promise<T> {
    logger.info(`Updating an item (type ${typeof item}) with id: ${itemId} in the Realtime DB`, item);

    const curDateTime = getUnixTimestamp();
    item.dateUpdatedUtc = curDateTime;

    // Create an object with the properties to update
    const updates: Partial<T> = {};
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        updates[`${key}` as keyof T] = item[key];
      }
    }

    // Update the specific child with the new values
    await this.getDictRef().child(itemId).update(updates);

    // Log success message
    logger.info("Item updated in Realtime DB", itemId);

    // Return the updated item
    return { ...(await this.get(itemId)), ...(item as T) };
}


  /**
   * Get a Reference to the Realtime DB dictionary for type T.
   * @return The reference to the dictionary.
   */
  public getDictRef(): Reference {
    return this.db.ref(this.dictRefPath);
  }
}
