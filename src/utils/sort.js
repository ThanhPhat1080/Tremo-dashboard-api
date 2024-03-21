export const getSortData = (reqQuery) => {
    const { sortBy } = reqQuery;
    let ascending = true, sortField = 'createdAt';

    if (!sortBy) return { ascending, sortField };


    if (sortBy.startsWith('-')) {
        ascending = false;
        sortField = sortBy.substring(1);
    } else {
        sortField = sortBy;
    }

    // time order is latest first
    const timeFields = ['createdAt']
    if (sortField in timeFields) ascending = !ascending;

    return { ascending, sortField };
};
