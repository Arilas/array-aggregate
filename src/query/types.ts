export type SimpleType = string | number | Date

export type Query<T extends object = {}, K = keyof T> = {
  [key in keyof T]?: Required<T>[key] extends SimpleType
    ? SimpleEqValidation
    : Required<T>[key] extends (string | number | Date)[]
    ? SimpleArrayValidation
    : Required<T>[key] extends object[]
    ? ArrayValidation<Required<T>[key][0]>
    : Required<T>[key] extends object
    ? Query<Required<T>[key]>
    : Required<T>[key] extends any[]
    ? SimpleEqValidation
    : null
} &
  RootQuerySelector<T>

export type RootQuerySelector<T extends object> = {
  $and?: Query<T>[]
  $nor?: Query<T>[]
  $or?: Query<T>[]
  $comment?: string
  [key: string]: any
}

export type ArrayValidation<T extends object> = Query<T> & {
  $not?: Query<T>
  $and?: Query<T>[]
  $or?: Query<T>[]
  $nor?: Query<T>[]
  $elemMatch?: Query<T>
}

export type BasicOperators = {
  $eq?: string | Date | number | RegExp | (string | Date | number | RegExp)[]
  $gt?: string | Date | number
  $gte?: string | Date | number
  $lt?: string | Date | number
  $lte?: string | Date | number
  $in?:
    | string[]
    | Date[]
    | number[]
    | RegExp[]
    | (string | Date | number | RegExp)[]
  $exists?: boolean
  $nin?:
    | string[]
    | Date[]
    | number[]
    | RegExp[]
    | (string | Date | number | RegExp)[]
  $ne?: string | Date | number | RegExp | (string | Date | number | RegExp)[]
}

export type SimpleEqValidation =
  | string
  | number
  | Date
  | (BasicOperators & {
      $not?: BasicOperators
      $and?: BasicOperators[]
      $or?: BasicOperators[]
      $nor?: BasicOperators[]
    })

export type SimpleArrayValidation =
  | string
  | number
  | Date
  | (BasicOperators & {
      $not?: BasicOperators
      $and?: BasicOperators[]
      $or?: BasicOperators[]
      $nor?: BasicOperators[]
      $elemMatch?: SimpleEqValidation
    })
