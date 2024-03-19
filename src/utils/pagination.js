/**
 * Find out from, to from page and size query params
 * @param {int} page
 * @param {int} size
 * @returns
 */
export const getPagination = (page, size) => {
  const limit = size ? size : 3;
  const from = page ? page * limit : 0;
  // minus 1 because supabase include range both start and end
  // for example: from 0 to 2 will include 0, 1, 2 -> 3 rows
  const to = page ? from + size - 1 : size - 1;
  return { from, to };
};


export const getPaginationData = (data, total, from, size) => {
  return {
    "results": data,
    'total': total,
    'limit': size,
    'skip': from
  }
};
