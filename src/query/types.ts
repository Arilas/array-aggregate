/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface Document {}
export type Query<TSchema> = {
  [P in keyof TSchema]?: Condition<TSchema[P]>
} & RootFilterOperators<TSchema> & {
    [key: string]: Condition<{}>
  }

/** @public */
export type Condition<T> =
  | AlternativeType<T>
  | FilterOperators<AlternativeType<T>>

/**
 * It is possible to search using alternative types in mongodb e.g.
 * string types can be searched using a regex in mongo
 * array types can be searched using their element type
 * @public
 */
export type AlternativeType<T> =
  T extends ReadonlyArray<infer U> ? T | RegExpOrString<U> : RegExpOrString<T>

/** @public */
export type RegExpOrString<T> = T extends string ? RegExp | RegExp | T : T

/** @public */
export interface RootFilterOperators<TSchema> extends Document {
  $and?: Query<TSchema>[]
  $nor?: Query<TSchema>[]
  $or?: Query<TSchema>[]
  $text?: {
    $search: string
    $language?: string
    $caseSensitive?: boolean
    $diacriticSensitive?: boolean
  }
  $where?: string | ((this: TSchema) => boolean)
  $comment?: string | Document
}

/** @public */
export interface FilterOperators<TValue> extends Document {
  // Comparison
  $eq?: TValue
  $gt?: TValue
  $gte?: TValue
  $in?: ReadonlyArray<TValue>
  $lt?: TValue
  $lte?: TValue
  $ne?: TValue
  $nin?: ReadonlyArray<TValue>
  // Logical
  $not?: TValue extends string
    ? FilterOperators<TValue> | RegExp
    : FilterOperators<TValue>
  // Element
  /**
   * When `true`, `$exists` matches the documents that contain the field,
   * including documents where the field value is null.
   */
  $exists?: boolean
  $type?: BSONType | BSONTypeAlias
  // Evaluation
  $expr?: Record<string, any>
  $jsonSchema?: Record<string, any>
  $mod?: TValue extends number ? [number, number] : never
  $regex?: TValue extends string ? RegExp | RegExp | string : never
  $options?: TValue extends string ? string : never
  // Geospatial
  $geoIntersects?: { $geometry: Document }
  $geoWithin?: Document
  $near?: Document
  $nearSphere?: Document
  $maxDistance?: number
  // Array
  $all?: ReadonlyArray<any>
  $elemMatch?: Document
  $size?: TValue extends ReadonlyArray<any> ? number : never
  // Bitwise
  $bitsAllClear?: BitwiseFilter
  $bitsAllSet?: BitwiseFilter
  $bitsAnyClear?: BitwiseFilter
  $bitsAnySet?: BitwiseFilter
  $rand?: Record<string, never>
}

/** @public */
export type BitwiseFilter =
  | number /** numeric bit mask */
  | ReadonlyArray<number> /** `[ <position1>, <position2>, ... ]` */

/** @public */
export const BSONType = Object.freeze({
  double: 1,
  string: 2,
  object: 3,
  array: 4,
  binData: 5,
  undefined: 6,
  objectId: 7,
  bool: 8,
  date: 9,
  null: 10,
  regex: 11,
  dbPointer: 12,
  javascript: 13,
  symbol: 14,
  javascriptWithScope: 15,
  int: 16,
  timestamp: 17,
  long: 18,
  decimal: 19,
  minKey: -1,
  maxKey: 127,
} as const)

/** @public */
export type BSONType = (typeof BSONType)[keyof typeof BSONType]
/** @public */
export type BSONTypeAlias = keyof typeof BSONType
