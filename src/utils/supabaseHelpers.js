export async function fetchAllRecords(supabase, table, options = {}) {
  let allData = [];
  let from = 0;
  const PAGE_SIZE = 1000;
  let hasMore = true;

  while (hasMore) {
    let query = supabase.from(table).select(options.select || '*').range(from, from + PAGE_SIZE - 1);
    
    if (options.eq) {
      options.eq.forEach(condition => {
        query = query.eq(condition.column, condition.value);
      });
    }
    
    if (options.order) {
      query = query.order(options.order.column, options.order.options);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ${table}:`, error);
      return { data: null, error };
    }

    if (data && data.length > 0) {
      allData = [...allData, ...data];
      if (data.length < PAGE_SIZE) {
        hasMore = false;
      } else {
        from += PAGE_SIZE;
      }
    } else {
      hasMore = false;
    }
  }

  return { data: allData, error: null };
}
