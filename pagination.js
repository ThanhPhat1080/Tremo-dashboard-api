/**
 * Find out from, to from page and size query params
 * @param {int} page 
 * @param {int} size 
 * @returns 
 */
export const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size : size;

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
