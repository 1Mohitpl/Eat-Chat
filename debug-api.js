const fetch = global.fetch || require('node-fetch');
(async () => {
  try {
    const listUrl = 'https://www.swiggy.com/dapi/restaurants/list/v5?lat=22.56430&lng=88.36930&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING';
    const listResp = await fetch(listUrl);
    console.log('LIST status', listResp.status);
    const listJson = await listResp.json();
    const restaurants = listJson?.data?.cards?.[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants;
    console.log('restaurants length', restaurants?.length);
    const rid = restaurants?.[0]?.info?.id;
    console.log('sample id', rid);
    if (!rid) return;
    const menuUrl = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=22.56430&lng=88.36930&restaurantId=${rid}`;
    console.log('MENU URL', menuUrl);
    const menuResp = await fetch(menuUrl);
    console.log('MENU status', menuResp.status);
    const menuJson = await menuResp.json();
    console.log('MENU keys', Object.keys(menuJson));
    console.log('MENU data keys', Object.keys(menuJson?.data ?? {}));
    console.log('MENU cards length', menuJson?.data?.cards?.length);
  } catch (err) {
    console.error('ERROR', err);
  }
})();
