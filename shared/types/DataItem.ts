export interface DataItem {
  /** The unique Firebase identifier of the object */
  id: string;
  /** Unix timestamp of when the object was created */
  dateCreatedUtc: number;
  /** Unix timestamp of when the object was last updated */
  dateUpdatedUtc: number;
}
