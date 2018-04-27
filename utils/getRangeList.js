export default (singular, plural, max) => {
  const list = []
  for (let i = 0; i < max; i++) {
    list.push({
      key: i + 1,
      value: i + 1,
      text: `${(i + 1)} ${(i + 1) === 1 ? singular : plural}`
    })
  }
  return list
}