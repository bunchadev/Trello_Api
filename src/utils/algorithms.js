export const pagingSkipValue = (page, itemsPerPage) => {
  // value not valid return 0
  if (!page || !itemsPerPage) return 0
  if (page <= 0 || itemsPerPage <= 0) return 0

  // calculate skip value (itemsPerPage = 12)
  return (page - 1) * itemsPerPage
}