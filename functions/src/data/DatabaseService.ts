import {Database} from "firebase-admin/lib/database/database";
import * as logger from "firebase-functions/logger";

import {DataItem} from "../../../shared/types";
import {getUnixTimestamp} from "../../../shared/utils";

/**
 * Manages basic operations for objects stored in the Realtime DB.
 * The dictionary in the DB must be a collection of items of type
 * T where the id of each item is the key in the dictionary.
 * @template T The type of the items in the dictionary.
 * @param {Database} db The Realtime DB instance.
 * @param {string} refPath The path to the dictionary in the Realtime DB.
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
   * @return {Promise<T[]>} The list of items.
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
   * @param {string} id The ID of the item.
   * @return {Promise<T | null>} The item, or null if not found.
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
   * @param {T} item The item to add.
   * @return {Promise<T>} The added item.
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
   * Get a Reference to the Realtime DB dictionary for type T.
   * @return {Reference} The reference to the dictionary.
   */
  public getDictRef() {
    return this.db.ref(this.dictRefPath);
  }
}
