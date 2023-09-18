export function getDifference(arr1, arr2) {
  const set1 = new Set(arr1)
  for (let elem of arr2) {
    set1.delete(elem)
  }
  return Array.from(set1)
}

export function hasDifference(arr1, arr2) {
  const set2 = new Set(arr2)
  for (let elem of arr1) {
    if (!set2.has(elem)) {
      return true
    }
  }
  return false
}

export function hasNoDifference(arr1, arr2) {
  if (getDifference(arr1, arr2).length > 0) {
    return false
  }
  if (getDifference(arr2, arr1).length > 0) {
    return false
  }
  return true
}

export function getIntersection(arr1, arr2) {
  const set1 = new Set(arr1)
  const set2 = new Set(arr2)
  const ans = []
  for (let elem of set1) {
    if (set2.has(elem)) {
      ans.push(elem)
    }
  }
  return ans
}

export function hasIntersection(arr1, arr2) {
  const set2 = new Set(arr2)
  for (let elem of arr1) {
    if (set2.has(elem)) {
      return true
    }
  }
  return false
}

export function getMaxIndexes(arr) {
  let ans = [0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[ans[0]]) {
      ans = [i]
    } else if (arr[i] === arr[ans[0]]) {
      ans.push(i)
    }
  }
  return ans
}

export function join(arr, sep, lastSep) {
  if (arr.length === 1) {
    return arr[0].toString()
  }
  if (!lastSep) {
    return arr.join(sep)
  }
  return arr.slice(0, -1).join(sep) + lastSep + arr.at(-1)
}
