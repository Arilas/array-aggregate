import { eq } from './eq'
import { gt } from './gt'
import { gte } from './gte'
import { lt } from './lt'
import { lte } from './lte'
import { ne } from './ne'
import { inFn } from './in'
import { nin } from './nin'

export default {
  $eq: eq,
  $gt: gt,
  $gte: gte,
  $lt: lt,
  $lte: lte,
  $ne: ne,
  $in: inFn,
  $nin: nin,
}
