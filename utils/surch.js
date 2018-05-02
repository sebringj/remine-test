const STOP_WORDS = ['a' ,'the', 'and', 'at', 'is'] // etc
// I did make this work initially but was a bit slow
// probably better to use Lunr for faceted search capability
function advancedSearch(originalData, query) {

  try {
    let { baths, beds, buildingType, search } = query

    let skipSort = true
    let re
    if (search) {
      // allow arbitrary order and remove stopwords
      const cleaned = search.split(/\b/g).map(w => w.toLowerCase().trim().replace(/[|&;$%@"<>()+,]/g, ''))
      for (let i = 0; i < cleaned.length; i++) {
        if (cleaned[i].trim() === '' || STOP_WORDS.indexOf(cleaned[i]) > -1) {
          cleaned.splice(i, 1)
          i--
        }
      }

      if (cleaned.length)
        re = new RegExp(`\\b(${cleaned.join('|')})\\b`, 'ig')
    }

    const data = []

    for (let i = 0; i < originalData.length; i++) {
  
      let cloned = {...originalData[i]}

      if (baths && baths.value !== cloned.baths)
        continue
      if (beds && beds.value !== cloned.beds)
        continue
      if (buildingType && _.get(buildingType, 'value') !== cloned.buildingType.name)
        continue

      cloned.rank = 0
      if (re) {
        skipSort = false
        const phrase = `${_.get(cloned, 'buildingType.name', '')} ${cloned.address}`
        const match = phrase.match(re)
        if (!match || !match.length)
          continue
        cloned.rank = match.length
      }

      data.push(cloned)
    }

    if (!skipSort) {
      const compare = (a, b) => {
        if (a.rank > b.rank) return -1
        if (a.rank < b.rank) return 1
        return 0
      }
      data.sort(compare)
    } 

    return data
  } catch (err) {
    return []
  }
}
export { advancedSearch }

// ended up doing this to make it faster/simpler with preloading "freeText"
function simpleSearch(originalData, query) {

  try {
    let { baths, beds, buildingType, search } = query

    search = search && search.toLowerCase()

    let data = originalData.filter((item) => {

      if (baths && baths.value !== item.baths)
        return false
      if (beds && beds.value !== item.beds)
        return false
      if (buildingType && buildingType.value !== item.buildingType.name)
        return false
      if (search && item.freeText.indexOf(search) === -1)
        return false

      return true

    })

    return data

  } catch (err) {
    return []
  }
}
export { simpleSearch }