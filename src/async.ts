const filterAsync = async <T>(
  v: readonly T[],
  f: (v: T) => Promise<boolean>,
): Promise<T[]> => {
  const include = await Promise.all(v.map(f))
  return v.filter((_, i) => include[i])
}

const findLastIndexAsync = async <T>(
  v: readonly T[],
  f: (v: T) => Promise<boolean>,
): Promise<number> => {
  for (let i = v.length - 1; i >= 0; i--) {
    if (await f(v[i]!)) {
      return i
    }
  }
  return -1
}

export {filterAsync, findLastIndexAsync}
