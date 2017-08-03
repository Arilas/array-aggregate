
const schema = {
  $and: {
    type: Array,
    childNodes: Infinity
  },
  $or: {
    type: Array,
    childNodes: Infinity
  },
  $nor: {
    type: Array,
    childNodes: Infinity
  },
  $not: {
    type: Object,
    childNodes: 1
  },
  $exists: {
    type: Boolean,
    childNodes: 0
  },
  $gt: {
    type: Number,
    childNodes: 0
  },
  $gte: {
    type: Number,
    childNodes: 0
  },
  $lt: {
    type: Number,
    childNodes: 0
  }
}