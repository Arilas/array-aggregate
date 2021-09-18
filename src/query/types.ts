export type SimpleType = string | number | Date | boolean

export type Query<T extends object = {}, R = NonNullable<Required<T>>> = {
  [key in keyof R]?: R[key] extends SimpleType
    ? SimpleEqValidation
    : R[key] extends (string | number | Date | SimpleType[])[]
    ? SimpleArrayValidation
    : R[key] extends object[]
    ? ArrayValidation<R[key][0]>
    : R[key] extends object
    ? Query<R[key]>
    : R[key] extends any[]
    ? SimpleEqValidation
    : null
} & RootQuerySelector<T>

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
  $mod?: [number, number]
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
  $all?: (
    | string
    | Date
    | number
    | RegExp
    | (string | Date | number | RegExp)[]
  )[]
}

export type SimpleEqValidation =
  | string
  | number
  | Date
  | RegExp
  | boolean
  | SimpleType[]
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
  | RegExp
  | boolean
  | SimpleType[]
  | (BasicOperators & {
      $not?: BasicOperators
      $and?: BasicOperators[]
      $or?: BasicOperators[]
      $nor?: BasicOperators[]
      $elemMatch?: SimpleEqValidation
    })
