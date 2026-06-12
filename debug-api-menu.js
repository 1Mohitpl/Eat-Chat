const fetch = global.fetch || require('node-fetch');
(async () => {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept': 'application/json, text/plain, */*',
      'Referer': 'https://www.swiggy.com/'
    };

    const rid = '565580';
    const variants = [
      `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=22.56430&lng=88.36930&restaurantId=${rid}`,
      `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=22.56430&lng=88.36930&catalog_qa=undefined&submitAction=ENTER&restaurantId=${rid}`,
      `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&restaurantId=${rid}`
    ];

    for (const url of variants) {
      console.log('\nTEST URL:', url);
      const resp = await fetch(url, { headers });
      console.log('status', resp.status, 'content-length', resp.headers.get('content-length'));
      const text = await resp.text();
      console.log('text length', text.length);
      console.log(text.slice(0, 300));
    }
  } catch (err) {
    console.error('ERROR', err);
  }
})();
