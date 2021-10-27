/**
 * See https://stackoverflow.com/a/56150320
 *
 * JSON stringify replacer function for maps. A function that transforms the results.
 * @param this
 * @param key
 * @param value
 * @returns
 */
export function replacer(this: any, key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    }
  } else {
    return value
  }
}
