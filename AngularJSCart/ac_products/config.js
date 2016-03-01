
//Setup each store below:
// Store can be loadded from a JSON file, a local .mdf database, or a remote database.
//'CF_DATA_SOURCE': 'ac_products/products.js',
//'CF_DATA_SOURCE': '/crud.ashx?ac=getproducts&cn=local',
//'CF_DATA_SOURCE': '/crud.ashx?ac=getproducts&cn=remote',
var config_module = angular.module('storeApp.config', [])
.constant('CONFIG',
{
    'CF_DATA_FILE': 'ac_products/products.js',
    'CF_DATA_LOCAL': '/crud.ashx?ac=getproducts&cn=local',
    'CF_DATA_REMOTE': '/crud.ashx?ac=getproducts&cn=remote',
    'CF_PRODUCTS_FILE': 'ac_products/products.js',
    'CF_PRODUCTS_FOLDER': 'ac_products',
    'CF_STORE_ID': 'SerGioApps',
    'CF_STORE_PAGE': 'storefront.html',
    'CF_STORE_BG_IMAGE': 'ac_img/bg1.jpg',
    'CF_DISTRIBUTOR_ID': 'WS1732',
    'CF_PAYMENT_PAYPAL_BUYNOW': 'paypaluser@youremail.com',
    'CF_PAYMENT_GOOGLE_WALLET_ID': 'GooGle_Wallet_ID',
    'CF_PAYMENT_STRIPE': 'pk_test_stripe',
    'CF_NAVBAR_THEME': 'navbar_dkred_gradient',
    'CF_NAVBAR_LOGO_IMAGE': 'ac_img/logo.png',
    'CF_NAVBAR_LOGO_TEXT': '',
    'CF_NAVBAR_LOGO_LINK': 'https://www.youtube.com/watch?v=HppJHKwCGCo',
    'CF_INSIDE_HEADER_SHOW': true,
    'CF_INSIDE_HEADER_LINK': 'https://www.youtube.com/watch?v=HppJHKwCGCo',
    'CF_INSIDE_HEADER_IMAGE': 'ac_img/logo.png',
    'CF_INSIDE_HEADER_TITLE': 'Responsive Angular Cart',
    'CF_CAROUSEL_SHOW': true,
    'CF_CAROUSEL_AUTO_PLAY': true,
    'CF_AN_CAROUSEL_IMG_VIDEO': 'hvr-pulse-grow',
    'CF_AN_CAROUSEL_PILL': 'hvr-wobble-to-top-right',
    'CF_AN_STORE_IMG_VIDEO': 'hvr-pulse-grow',
    'CF_AN_STORE_PILL': 'hvr-wobble-to-top-right',
    'CF_SYSTEM_NAME': 'My Angular JS project',
    'CF_SYSTEM_LANGUAGE': '',
    'CF_BASE_URL': '',
    'CF_API_URL': '',
    'CF_GOOGLE_ANALYTICS_ID': ''
});



