import logical from './logical'

function normalizePart(target, key) {
  if (typeof target[key] !== 'object') {
    if (key.indexOf('$') === -1 && key !== '$not') {
      target[key] = {
        $eq: target[key]
      }
    }
  } else if (Array.isArray(target[key])) {
    target[key].forEach((item, index) => {
      const keys = Object.keys(item)
      let newTarget = item
      if (keys.length != 1) {
        newTarget = {
          $and: keys.map(operator => ({
            [operator]: item[operator]
          }))
        }
        target[key][index] = newTarget
      }
      for (const newKey of keys) {
        normalizePart(newTarget, newKey)
      }
    })
  } else {
    const keys = Object.keys(target[key])
    let newTarget = target[key]
    if (keys.length != 1) {
      newTarget = {
        $and: keys.map(operator => normalizePart({
          [operator]: target[key][operator]
        }, operator))
      }
      target[key] = newTarget
    } else {
      for (const newKey of keys) {
        normalizePart(newTarget, newKey)
      }
    }
  }
  return target
}

export function normalizeQuery(query) {
  const keys = Object.keys(query)
  if (keys.length !== 1 || !logical.hasOwnProperty(keys[0])) {
    return normalizeQuery({
      $and: keys.map(key => ({
        [key]: query[key]
      }))
    })
  }

  normalizePart(query, keys[0])
  return query
}