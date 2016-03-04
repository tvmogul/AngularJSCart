<body>

<!-- Start Article -->
<span id="ArticleContent">

<h2>AngularJS Responsive Video Mobile Shopping Cart</h2>

<a href="http://www.codeproject.com/Articles/881354/A-Shopping-Cart-using-Angular-Mobile-Responsive" target="_blank">Read CodeProject Article for Amgular Shopping Cart</a>

<a href="http://www.codeproject.com/Articles/1082042/Angular-Shopping-Cart-Editor" target="_blank">Download Source Code for Angular Editor</a>

<a href="https://www.youtube.com/watch?v=HppJHKwCGCo" target="_blank">How to Install Mobile Apps on Any TV & Get Free Movies Legally</a>

<p>This article presents a full-featured, Mobile AngularJS Shopping Cart with Videos and many other goodies.</p>

<table style="max-width:600px !important;">
	<tbody>
		<tr>
			<td style="vertical-align:middle;"><img src="http://www.software-rus.com/Articles/AngularResponsiveCart/images/store1.gif" height="480px" width="368px"></td>
			<td style="vertical-align:middle;"><img src="http://www.software-rus.com/Articles/AngularResponsiveCart/images/arrows.png" height="100px" width="100px"></td>
			<td style="vertical-align:middle;"><img src="http://www.software-rus.com/Articles/AngularResponsiveCart/images/mobilecart.jpg" height="405px" width="210px"></td>
		</tr>
	</tbody>
</table>

<h2 id="sec1">Shopping Cart Features</h2>

<p>Here are some of the practical features I included:</p>

<ul>
	<li>Must be <strong><em>responsive</em></strong> so it will display and scroll perfectly on any mobile device.</li>
	<li>Must have a <em>cool-looking, responsive </em>Bootstrap Menu.&nbsp;</li>
	<li>Allow <strong>Multiple Stores</strong> in our cart.</li>
	<li>Must read the products and their descriptions from an external JSON <strong><em>text file</em></strong>.</li>
	<li>Must be able to play a <strong>Video</strong> (TV Commercial) about a product in addition to a picture of the product.</li>
	<li>Must at least include merchant gateways for <em><strong>PayPal, Google Wallet, </strong></em>and<em><strong> Stripe</strong></em>.</li>
	<li>Must be extensible so that adding new features like payment methods is easy.</li>
	<li>Must allow FREE products that can't be added to the cart.</li>
	<li>Must handle <strong><em>Google Analytics</em></strong> using AngularJS.</li>
	<li>Must include&nbsp;<strong><em>Dialog Service</em></strong>&nbsp;<strong>WITHOUT</strong> using <em><strong>ui.bootstrap</strong></em> because we don't want the headaches of trying to keep up with their changes.</li>
	<li>Must be able to include links to thrird-party websites like <strong><em>Google Play</em></strong>, etc.</li>
	<li>Must have a directory structure that allows it to be "<strong><em>dropped</em></strong>" at the <em><strong>root level</strong></em> onto any existing website.</li>
	<li>Must display text as <strong>HTML</strong> so it attracts the potential customer visually.</li>
	<li>Must be able to display products in a <strong><em>Pinterest Style Layout</em></strong> or a <strong><em>Listview Layout</em></strong></li>
	<li>Must follow MVC architecture.</li>
	<li>Must include <strong>Pagination</strong> to control number of products displayed per page</li>
	<li>Include Bootstrap 3 <strong>without </strong>adding <strong>ui.bootstrap</strong></li>
	<li>Must include Filter &amp; Sort Options</li>
</ul>

<p>I used <strong>Bootstrap 3 </strong>but <strong>NOT </strong><em>ui.bootstrap</em>&nbsp;because ui.bootstrap gives me headaches trying to keep up with their changes. <strong>Bootstrap 3</strong> has <em><strong>navbars </strong></em>where
 it easy to change the look-and-feel of the navbars from in side your 
app using AngularJS as demonstrated below in the shopping cart.​<br>
<br>
I decided to add some <em><strong>Color Coordination </strong></em>with 
the navbars so that each navbar would have its own hover color when 
hovering over the pills. In each style sheet for each navbar we have the
 hover css as follows.</p>

<pre>&nbsp;.nav-pills li:hover{
&nbsp;&nbsp;&nbsp; background-color: #6d0019 !important; &nbsp;
&nbsp;&nbsp;&nbsp; color:#fff;
&nbsp;&nbsp;&nbsp; box-shadow: 0 2px 6px rgba(0,0,0,0.5)&nbsp; &nbsp;
}

</pre>

<p>Which produces the different hover effects for each navbar.</p>

<p>I added a dialog service, see '<em>storeMessages</em>', because I 
&nbsp;didn't want to pollute the DOM with modal content. As a service we
 defer it until the point the service is called.passing the data into 
the modal. Whereas with a directive we would need custom attributes 
(that would differ from modal to modal) and that means the data would 
have to be put on the scope before it could be passed in, which is not 
always convenient. You should customize this dialog service to whatever 
look and feel and functionality you want in your own cart. You should 
customize this rudimentary dialog service I added to suite your own 
needs in your shopping cart.</p>
<p>
My goal is an AngularJS&nbsp;app that looks and behaves nicely on any mobiel device or laptop as show below.</p>
<p>
In a week or two I will be adding an editor I &nbsp;wrote in AngularJS to easily create and edit the JSON&nbsp;<strong>products.txt</strong> file where the store's products are stored. And you can always find the latest code for my projects on my website at: <a href="http://www.software-rus.com/" target="_blank">www.software-rus.com</a></p>

<h2 id="sec2">AngularJS App Structure</h2>

<p>The sample application starts with the definition of an <strong>AngularJS</strong> module that represents the application. The module <strong>AngularStore</strong> module is defined in the <strong>app.js</strong>
 file passes in two dependcies, namely ['ui.bootstrap', 
'favicon'].&nbsp; I decide to use "ui.bootstrap" in a minimal way as a 
dependency to "AngularStore" for the menu and part of the UI look I 
wanted. And I added favicon to help to add images from websites to the 
menu. In addition, I also added <strong>jQuery</strong> to simply demonstrate how to integrate it with an<strong> AngularJS</strong>
 application. The “shoppingCart” class contains all the logic and 
provides the object model needed to create fully responsive and 
attractive views.</p>

<pre>var storeApp = angular.module('AngularStore', ['favicon', 'storeMessages.services'])
&nbsp; .config(['$routeProvider', function ($routeProvider) {
&nbsp; $routeProvider.
&nbsp; &nbsp; when('/store', {
&nbsp; &nbsp; &nbsp; &nbsp; templateUrl: 'ac_partials/store.htm',
&nbsp; &nbsp; &nbsp; &nbsp; controller: storeController
&nbsp; &nbsp; }).
&nbsp; &nbsp; when('/products/:productSku', {
&nbsp; &nbsp; &nbsp; &nbsp; templateUrl: 'ac_partials/product.htm',
&nbsp; &nbsp; &nbsp; &nbsp; controller: storeController
&nbsp; &nbsp; }).
&nbsp; &nbsp; when('/cart', {
&nbsp; &nbsp; &nbsp; &nbsp; templateUrl: 'ac_partials/cart.htm',
&nbsp; &nbsp; &nbsp; &nbsp; controller: storeController
&nbsp; &nbsp; }).
&nbsp; &nbsp; otherwise({
&nbsp; &nbsp; &nbsp; &nbsp; redirectTo: '/store'
&nbsp; &nbsp; });
&nbsp; } ]);
</pre>

<p>The first thing you will notice is that I prefaced each of our 
AmgularJS folders with "ac_" so that when we can just drop the cart into
 an existing website on a server at the root level and our folders will 
not conflict with existing folders or files.</p>

<p>We have a <strong>routeProvider</strong> that specifies which view 
should be displayed based on the URL. For example, when the URL ends 
with “/cart”, the app should load the view defined in the 
"ac_partials/cart.htm” file. And we will bind all of our views to a 
controller “storeController,” a class that contains a “store” and a 
“cart”.&nbsp;&nbsp;<br>
<br>
The easiest way to share data between controllers in <strong>AngularJS</strong>
 is by defining an app-level “service” to initialize the controllers 
that need them. We will create a data service that provides a store and a
 shopping cart that will be shared by all views instead of creating 
fresh ones for each view to improve performance by eliminating the need 
to re-load the store and cart items each time a new view is 
displayed.&nbsp; We want our “DataService” to retrieve our sotre 
products data from a JSON text file. Here is the definition of the 
“DataService” that provides data shared by all views in the Angular 
Store application.<br>
<br>
<span style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; display: inline !important; float: none;">Our<span class="Apple-converted-space">&nbsp;</span></span><strong style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">DataService</strong><span style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; display: inline !important; float: none;"><span class="Apple-converted-space">&nbsp;</span>will load data from a json file<span class="Apple-converted-space">&nbsp;</span></span><strong style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">asynchronously</strong><span style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; display: inline !important; float: none;"><span class="Apple-converted-space">&nbsp;</span>so we will need to use<span class="Apple-converted-space">&nbsp;</span></span><strong style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">promise</strong><span style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; display: inline !important; float: none;"><span class="Apple-converted-space">&nbsp;</span>and<span class="Apple-converted-space">&nbsp;</span></span><strong style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">deferred</strong><span style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; display: inline !important; float: none;">. A<span class="Apple-converted-space">&nbsp;</span></span><em style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">promise</em><span style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; display: inline !important; float: none;"><span class="Apple-converted-space">&nbsp;</span>in
 Angular.js act as an placeholder from where a javascript object returns
 some result as data which is done in an asynchronous way and it does 
not guarantee any fixed response time. This<span class="Apple-converted-space">&nbsp;</span></span><em style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">deferred object</em><span style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; display: inline !important; float: none;"><span class="Apple-converted-space">&nbsp;</span>is constructed with<span class="Apple-converted-space">&nbsp;</span></span><strong style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">$q.defer()</strong><span style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; display: inline !important; float: none;">.
 This Api is used to notify the success or unsuccesful completion of the
 asynchronous work, which is within the context of Deferred Api. After 
completing the task in<span class="Apple-converted-space">&nbsp;</span></span><em style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">deferred object</em><span style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; display: inline !important; float: none;">, we can have access to the result in<span class="Apple-converted-space">&nbsp;</span></span><em style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px;">promise object</em><span style="color: rgb(0, 0, 0); font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 13px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; display: inline !important; float: none;">.</span></p>

<pre>// create a data service that provides a store and a shopping cart that
// will be shared by all views (instead of creating fresh ones for each view).
storeApp.factory('DataService', function ($http, $q) {
    function <strong>Store</strong>() {
        var productsDeferred = $q.defer();
        this.products = productsDeferred.promise;
        $http.get('ac_products/products.txt').success(function (data) {
            var products = [];
            for (var i = 0, len = data.length; i &lt; len; i++) {
                var prod = data[i];
                if (prod.storeid == "7cc6cb94-0938-4675-b84e-6b97ada53978") {
                    products.push(prod);
                }
            }
            productsDeferred.resolve(products);
        });
    }
    Store.prototype.getProduct = function (sku) {
        return this.products.then(function (products) {
            <strong>// MUST use products, it's the real value; this.products is a promise</strong>
            for (var i = 0; i &lt; products.length; i++) { 
                if (products[i].sku == sku)
                    return products[i];
            }
            return null;
        });
    };
    Store.prototype.getProducts = function () {
        return this.products.then(function (products) {
            return products;
        });
    };
    // create store
    <strong>var myStore = new Store();</strong>

    // create shopping cart
    var myCart = new shoppingCart("AngularStore");
    // enable PayPal checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with PayPal, you have to create a merchant account with 
    // PayPal. You can do that here:
    // https://www.paypal.com/webapps/mpp/merchant
    //myCart.addCheckoutParameters("PayPal", "paypaluser@youremail.com");
    myCart.addCheckoutParameters("PayPal", "paypaluser@youremail.com");

    // enable Google Wallet checkout
    // note: the second parameter identifies the merchant; in order to use the 
    // shopping cart with Google Wallet, you have to create a merchant account with 
    // Google. You can do that here:
    // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
    myCart.addCheckoutParameters("Google", "GooGle_Wallet_ID",
        {
            ship_method_name_1: "UPS Next Day Air",
            ship_method_price_1: "20.00",
            ship_method_currency_1: "USD",
            ship_method_name_2: "UPS Ground",
            ship_method_price_2: "15.00",
            ship_method_currency_2: "USD"
        }
    );

    // enable Stripe checkout
    // note: the second parameter identifies your publishable key; in order to use the 
    // shopping cart with Stripe, you have to create a merchant account with 
    // Stripe. You can do that here:
    // https://manage.stripe.com/register
    myCart.addCheckoutParameters("Stripe", "pk_test_stripe",
        {
            chargeurl: "https://localhost:1234/processStripe.aspx"
        }
    );

    // return data object with store and cart
    return {
        store: myStore,
        cart: myCart
    };
});
</pre>

<hr>
<h2 id="sec33">The Bootstrap 3 Menu Control</h2>

<p>I kept the menu control for our Bootstrap 3 menu very simple as you 
can see below. To set the active tab I used&nbsp;ng-controller to run a 
single controller outside of the ng-view as shown below.</p>

<pre>&lt;li ng-class="{ active: isActive('/store')}"&gt;&lt;a ng-href="storefront.html#/store"&gt;Store &lt;/a&gt;&lt;/li&gt;</pre>

<p>and...&nbsp;</p>

<pre>function MyMenu($scope, $location) {
    $scope.name = 'MyMenu';
    $scope.isCollapsed = false;

    $scope.changeBackgroundImage = function (event) {
        event.preventDefault();
        var x = 0
        for (x = 0; x &lt; arBGs.length; x++) {
            if (_bgImage === arBGs[x]) { break; }
        }
        if (x + 1 &lt; arBGs.length) {
            _bgImage = arBGs[x + 1];
        }
        else {
            x = 0;
            _bgImage = arBGs[x];
        }
        $("body").css('background-image', '');
        $("body").css("background", "#ffffff url(" + _bgImage + ") no-repeat center center fixed");
        localStorage['bg_cart'] = _bgImage;

    }
    
    $scope.changeNavBar = function (css_name) {
        event.preventDefault();
        var _path = "ac_css/" + css_name + ".css";
        $("#link_index").attr("href", _path);

        _navbar_theme = css_name;
        localStorage["navbar_theme"] = _navbar_theme;

        return false;
    }

    // Author: Bill SerGio - An elegant way to set the active tab is to use ng-controller 
    // to run a single controller outside of the ng-view as shown below.
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
}
</pre>

<h2>Our Angular Views: Store, Product, and Cart</h2>

<p>The look and feel of a shopping cart is very important so I decided 
to use a Pinterest Style Layout that can be switched with a ListView 
Layout which is commonly seen in more expensive shopping carts. I used 
as a starting point a non-AngularJS css layout called ViewModeSwitch 
that I modified for AngularJS that I found on GitHub at: <a href="https://github.com/codrops/ViewModeSwitch"> https://github.com/codrops/ViewModeSwitch</a></p>

<p>Our responsive AngularJS&nbsp;Store App has three main views:</p>

<p><strong>Store View</strong>: This is the first view that is loaded 
when the app runs showing the products available. Users can search for 
items using a filter, and obtain detailed information about specific 
products by watching the product's TV commercial (i.e., video) if the 
product has one, or by clicking the product name. Users can also add 
products to the shopping cart if they have a price or obtain a free 
sample of a product if a product has a zero cost.&nbsp; Users can also 
view a summary of what is in their cart by clicking the summary which 
navigates to the cart. Shown below are what the responsive store view 
looks like on both a laptop and on a mobile device.</p>

<p style="page-break-after: avoid;"><strong>Product View:</strong> This 
view shows more details about a product and also allows users to add or 
remove the product in/from the shopping cart and shows how many of the 
product are added to the cart. You can display a video of the product or
 an image. If an image of the product is displayed then clicking on the 
image will popup a dialog showing a larger view of the image. You can 
see below what the Product View looks like with an image displayed.</p>

<p><strong>Cart View</strong>: This view shows the shopping cart. Users can edit the cart and checkout using <strong>PayPal, Google Wallet, and stripe</strong>.
 Check my website in the next week and I will also add a Bit Coin 
Payment option as well. Offering more payment options increases sales by
 boosting the seller's credibility. Below is what the Cart View looks 
like on a laptop.</p>

<p>The service reads our "products.txt" JSON file of products and 
creates a “store” object that containing the products available and a 
“shoppingCart” object that automatically loads its contents from local 
storage.&nbsp;The cart provides three checkout methods:</p>

<ol>
	<li><strong>PayPal</strong>. Thispayment method specifies the merchant 
account or BuyNow account(not a merchant account) to use for payment. To
 use PayPal, you have to create either a BuyNow Account or a merchant 
account with PayPal. You can do that here: <a href="https://www.paypal.com/webapps/mpp/merchant">https://www.paypal.com/webapps/mpp/merchantaypal.com/webapps/mpp/merchant</a></li>
	<li><strong>Google Wallet</strong>. This payment method requires that you create a merchant account with Google. You can do that here: <a href="https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup">https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup</a></li>
	<li><strong>Stripe</strong>. This payment method allows you to embed 
their API on a websites to accept payments, without the need of getting a
 merchant account. Stripe has no setup fees, monthly fees, minimum 
charges, validation fees, card storage fees, or charges for failed 
payments. Stripe has a 7-day waiting period for transactions to be 
completed so that Stripe can profile the businesses involved and detect 
fraud. <a href="https://stripe.com/">https://stripe.com</a></li>
</ol>

<p>Our <strong>DataService</strong> will be used by the <strong>storeController</strong> to display the various views in the application. The <strong>storeController</strong> retrieves the store and cart from the <strong>DataService</strong> and adds them to the AngularJS <strong>$scope</strong> object which functions as a data context for the views. The <strong>storeController</strong>
 is where we can set the currentPage, the number of products per page 
and the maximum number of products used for our Pagination.</p>

<pre>// the storeController contains two objects:
// store: contains the product list
// cart: the shopping cart object
// - <strong>DataService: called to retrieve products from JSON file</strong>
function storeController($scope, $filter, $routeParams, DataService) {
    $scope.isActive = false;
    $scope.sections = [{ name: 'list', class: 'cbp-vm-icon cbp-vm-list' }];

    $scope.setMaster = function (section) {
        $scope.selected = section;
        $scope.isActive = !$scope.isActive;

        <strong>// Let's flip our icons.
        // <a class="cbp-vm-icon cbp-vm-grid cbp-vm-selected" data-view="cbp-vm-view-grid" href="#">Grid View</a> &lt;===&gt; <a class="cbp-vm-icon cbp-vm-list" data-view="cbp-vm-view-list" href="#">List View</a></strong>
        if (section.class.toString() === 'cbp-vm-icon cbp-vm-grid') {
            $scope.sections = [{ name: 'list', class: 'cbp-vm-icon cbp-vm-list'}];
        }
        else {
            $scope.sections = [{ name: 'grid', class: 'cbp-vm-icon cbp-vm-grid'}];
        }
    }

    $scope.isSelected = function (section) {
        return $scope.selected === section;
    }

    $scope.fToggleOverlay = function () {
        $scope.overlayFlag = !$scope.overlayFlag; // toggle state of overlay flag.
    };

    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.pagedItems = [];

    $scope.currentPage = 1;
    $scope.pageSize = 9;
    $scope.maxSize = 25;

    // get store &amp; cart from service
    $scope.store = DataService.store;
    $scope.cart = DataService.cart;
    $scope.products = [];

    // use routing to pick the selected product
    if ($routeParams.productSku != null) {
        $scope.product = $scope.store.getProduct($routeParams.productSku);
    }

    <strong>DataService.store.getProducts().then(function (data) {</strong>

        <strong>//Executes when AJAX call completes</strong>
        $scope.products = data;

        $scope.numberOfPages = function () {
            return Math.ceil($scope.products.length / $scope.pageSize);
        };

        //$scope.$watch('currentPage + pageSize', function () {
        //    var begin = (($scope.currentPage - 1) * $scope.pageSize);
        //    var end = begin + $scope.pageSize;
        //    $scope.filteredItems = $scope.products.slice(begin, end);
        //});

        var searchMatch = function (haystack, needle) {
            if (!needle) {
                return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };
        $scope.myFilter = function (categoryname) {
            //$('#searchfield').val('');
            $scope.filteredItems = $filter('filter')($scope.products, function (product) {
                for (var attr in product) {
                    if (searchMatch(product[categoryname], $scope.query))
                        return true;
                }
                return false;
            });
            $scope.currentPage = 0;
            $scope.groupToPages();
        };
        $scope.myFilter = function (column, categoryname) {
            //$('#searchfield').val('');
            $scope.filteredItems = $filter('filter')($scope.products, function (product) {
                for (var attr in product) {
                    if (searchMatch(product[column], categoryname))
                        return true;
                }
                return false;
            });
            $scope.currentPage = 0;
            $scope.groupToPages();
        };
        $scope.groupToPages = function () {
            $scope.pagedItems = [];
            for (var i = 0; i &lt; $scope.filteredItems.length; i++) {
                if (i % $scope.pageSize === 0) {
                    $scope.pagedItems[Math.floor(i / $scope.pageSize)] = [$scope.filteredItems[i]];
                } else {
                    $scope.pagedItems[Math.floor(i / $scope.pageSize)].push($scope.filteredItems[i]);
                }
            }
        };
        // functions have been describe process the data for display
        $scope.myFilter();
        $scope.search();
    });
}
</pre>

<h2 id="sec4">The JSON 'products.txt' File</h2>

<p>I decided to use a JSON format to storte the products and their properties and retrieve them using AJAX as shown below.</p>

<pre>[
    {
&nbsp; &nbsp; &nbsp; &nbsp; "productid": "7D6A083B-01C4-4E74-9F10-2916543188B8",
&nbsp; &nbsp; &nbsp; &nbsp; "sku": "WildWorkout",
&nbsp; &nbsp; &nbsp; &nbsp; "productname": "WildWorkout&amp;#174;",
&nbsp; &nbsp; &nbsp; &nbsp; "storeid": "7cc6cb94-0938-4675-b84e-6b97ada53978",
&nbsp; &nbsp; &nbsp; &nbsp; "categoryname": "software",
&nbsp; &nbsp; &nbsp; &nbsp; "header": "&lt;strong&gt;&lt;span style=\"text-decoration:underline;\"&gt;&lt;em&gt;Exercises based on the principles of how the wild animals stay in shape&lt;/em&gt;&lt;/span&gt;&lt;/strong&gt;",
&nbsp; &nbsp; &nbsp; &nbsp; "shortdesc": "Exercises based on the principles of how the wild animals stay in shape. In the Wild Workout&amp;#174; Mobile App we selected wild animals with massive strength in certain areas of their bodies to develop a total body workout of 45 muscle building, fat burning, body shaping exercises like no other that will have the jaws of others dropping in disbelief and envy.",
&nbsp; &nbsp; &nbsp; &nbsp; "description": "Exercises based on the principles of how the wild animals stay in shape. In the Wild Workout&amp;#174; Mobile App we selected wild animals with massive strength in certain areas of their bodies to develop a total body workout of 45 muscle building, fat burning, body shaping exercises like no other that will have the jaws of others dropping in disbelief and envy.",
&nbsp; &nbsp; &nbsp; &nbsp; "link": "http://www.software-rus.com/simulator2.html?app=wildworkout",
&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;"linktext": "try it",
&nbsp; &nbsp; &nbsp; &nbsp; "imageurl": "",
&nbsp; &nbsp; &nbsp; &nbsp; "imagename": "ww.gif",
&nbsp; &nbsp; &nbsp; &nbsp; "tube": "youtube",
&nbsp; &nbsp; &nbsp; &nbsp; "videoid": "YyZNIarRYSc",
&nbsp; &nbsp; &nbsp; &nbsp; "showvideo": true,
&nbsp; &nbsp; &nbsp; &nbsp; "unitprice": 0,
&nbsp; &nbsp; &nbsp; &nbsp; "saleprice": 0,
&nbsp; &nbsp; &nbsp; &nbsp; "unitsinstock": 22,
&nbsp; &nbsp; &nbsp; &nbsp; "unitsonorder": 0,
&nbsp; &nbsp; &nbsp; &nbsp; "reorderlevel": 0,
&nbsp; &nbsp; &nbsp; &nbsp; "expecteddate": null,
&nbsp; &nbsp; &nbsp; &nbsp; "discontinued": null,
&nbsp; &nbsp; &nbsp; &nbsp; "notes": "",
&nbsp; &nbsp; &nbsp; &nbsp; "faux": null,
&nbsp; &nbsp; &nbsp; &nbsp; "sortorder": 1
    },
    ...
</pre>

<h2 id="sec5">The 'shoppingCart' class</h2>

<p>The <strong>shoppingCart</strong> class implements the object model, i.e., <strong>shoppingCart(cartName)</strong>, with a <strong>cartName</strong>
 parameter that identifies the cart when saving it to or loading it from
 local storage and exposes a number of essential methods.</p>

<h2 id="sec6">addCheckoutParameters(serviceName, merchantID, [options])</h2>

<p>The <em> <strong>addCheckoutParameters(serviceName, merchantID, [options])</strong> </em>method initializes the cart by adding one or more payment providers using the that requires two parameters. The <strong>serviceName</strong> parameter is the payment provider to use. The <strong>merchantID</strong> parameter is the merchant account or gateway associated with the service. The <strong>options</strong>
 parameter defines additional provider-specific fields. In our example, 
we used this parameter to specify custom shipping methods associated 
with the Google checkout. Both PayPal and Google support a large number 
of optional parameters that you can use to customize the checkout 
process.</p>

<h2 id="sec7">addItem(sku, name, price, quantity)</h2>

<p>The <strong><em>additem(sku, name, price, quantity)</em></strong> method adds or removes items from the cart.&nbsp; If the cart already contains items with the given <strong>sku</strong>,
 then the quantity of that item is is increased or decresed by one. The 
item is automatically removed from the cart if the quantity reaches 
zero.&nbsp;&nbsp;If the cart does not contain items with the given <strong>sku</strong>, then a new item is created and added to the cart using the specified <strong>sku</strong>, <strong>name</strong>, <strong>price</strong>, and <strong>quantity</strong>. After the cart has been updated, it is automatically saved to local storage.</p>

<h2 id="sec8">clearItems()</h2>

<p>The <strong><em>clearItems() </em></strong>method clears the cart by removing all items and saves the empty cart to local storage.</p>

<h2 id="sec9">getTotalCount(sku)</h2>

<p>The <strong><em>getTotalCount(sku)</em></strong> method gets the quantity of items or a given type or for all items in the cart.&nbsp; If the <strong>sku</strong> is provided, then the method returns the quantity of items with that <strong>sku</strong>. It the <strong>sku</strong> is omitted, then the method returns the quantity of all items in the cart.</p>

<h2 id="sec10">getTotalPrice(sku)</h2>

<p>The <strong><em>getTotalPrice(sku)</em></strong> method gets the total price (unit price * quantity) for one or all items in the cart.&nbsp; If the <strong>sku</strong> is provided, then the method returns the price of items with that <strong>sku</strong>. It the <strong>sku</strong> is omitted, then the method returns the total price of all items in the cart.</p>

<h2 id="sec11">checkout(serviceName, clearCart)</h2>

<p>The <strong><em>checkout(serviceName, clearCart)</em></strong> method
 initiates a checkout transaction by building a form object and 
submitting it to the specified payment provider.&nbsp; If provided, the <strong>serviceName</strong> parameter must match one of the service names registered with calls to the <strong>addCheckoutParameters</strong> method. If omitted, the cart will use the first payment service registered. The <strong>clearCart</strong> parameter specifies whether the cart should be cleared after the <strong>checkout</strong> transaction is submitted.&nbsp; The <strong>checkout</strong> method is the most interesting in this class, and is listed below:</p>

<pre>// check out
shoppingCart.prototype.checkout = function (serviceName, clearCart) {

    // select serviceName if we have to
    if (serviceName == null) {
        var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
        serviceName = p.serviceName;
    }

    // sanity
    if (serviceName == null) {
        throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
    }

    // go to work
    var parms = this.checkoutParameters[serviceName];
    if (parms == null) {
        throw "Cannot get checkout parameters for '" + serviceName + "'.";
    }
    switch (parms.serviceName) {
        case "PayPal":
            this.checkoutPayPal(parms, clearCart);
            break;
        case "Google":
            this.checkoutGoogle(parms, clearCart);
            break;
        case "Stripe":
            this.checkoutStripe(parms, clearCart);
            break;
        default:
            throw "Unknown checkout service: " + parms.serviceName;
    }
}
</pre>

<p>The method starts by making sure it has a valid payment service, and then defers the actual work to the <strong>checkoutPayPal</strong> or <strong>checkoutGoogle</strong> methods. These methods are very similar but are service-specific. The <strong>checkoutPayPal</strong> method is implemented as follows:</p>

<pre lang="jscript">// check out using PayPal; for details see:
// http://www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
// check out using PayPal for details see:
// www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
shoppingCart.prototype.checkoutPayPal = function (parms, clearCart) {

    // global data
    var data = {
        cmd: "_cart",
        business: parms.merchantID,
        upload: "1",
        rm: "2",
        charset: "utf-8"
    };

    // item data
    for (var i = 0; i &lt; this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_number_" + ctr] = item.sku;
        var z1 = item.productname;
        var z2 = z1.replace('™', '™');  //™ = TM
        var z3 = z2.replace('℠', '℠');  //℠ = SM
        var z4 = z3.replace('®', '®');  //® = Registered
        var z5 = z4.replace('©', '©');  //© = Copyright
        var z6 = z5.replace('℗', '℗');  //℗ = Patent
        data["item_name_" + ctr] = z6;
        data["quantity_" + ctr] = item.quantity;
        data["amount_" + ctr] = item.unitprice.toFixed(2);
    }

    // build form
    var form = $('&lt;form&gt;&lt;/form&gt;');
    form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
}
</pre>

<p>The <strong><em>shoppingCart.prototype.checkoutPayPal = function (parms, clearCart)</em></strong> method builds a form, populates it with hidden input fields that contain the cart data, and submits the form to the <strong>PayPal</strong> servers.<br>
See: <a href="https://www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside">https://www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside</a></p>

<p>The <strong><em>shoppingCart.prototype.checkoutGoogle = function (parms, clearCart) </em></strong>method is very similar. It also builds and submits a form, the only difference being the name and content of the fields.</p>

<p>The <strong><em>shoppingCart.prototype.checkoutStripe = function (parms, clearCart) Cart) </em></strong> method also builds and submits a form, the only difference being the name and content of the fields. See: <a href="https://stripe.com/docs/checkout"> https://stripe.com/docs/checkout</a></p>

<p>All of these checkout methods allow you to add custom fields specified in the <strong>optionsptions</strong> parameter of the cart’s <strong>addCheckoutParameters</strong>
 method. These custom fields can be used to specify things like return 
URLs, custom images for the cart on the server’s site, custom shipping 
rules and prices, etc.</p>

<p>When the <strong>checkout</strong> method submits the form, the user 
is taken to the appropriate site (PayPal or Google Wallet), where he can
 review the information about the items, update his own personal and 
credit card information, and finalize the transaction. All this happens 
outside the scope of the application. The payment provider will then use
 the information associated with the merchant id provided by the form to
 notify you of the transaction so you can collect the payment and ship 
the goods to the customer.</p>

<p>If you wanted to add more payment options to the cart, you would have to:</p>

<ol>
	<li>Modify the <strong>addCheckoutParameters</strong> method to accept the new service name.</li>
	<li>Create a new <strong>checkout&lt;ServiceName&gt;</strong> method to handle the checkouts using the new service. This would probably be similar to the existing <strong>checkoutPayPal</strong> and <strong>checkoutGoogle</strong> methods.</li>
	<li>Modify the <strong>checkout</strong> method to call the new method depending on the service name specified by the user.</li>
</ol>

<p>For example, if you wanted to leverage an existing payment 
infrastructure you have on your site, you could create a method similar 
to <strong>checkoutPayPal</strong>, but with a URL on your site. The 
server would receive the form with all the information encoded as hidden
 fields, and would have access to the current session, user, etc. At 
this point, you would have all the information required by your payment 
infrastructure (cart and user).</p>

<h2 id="sec12">AngularJS Views</h2>

<p>Now that we have covered the AngularJS infrastructure and the controller classes, let’s turn our attention to the views.</p>

<p>The <strong>storefront.html</strong> file contains the master view implemented as follows:</p>

<pre>&lt;!doctype html&gt;
&lt;html ng-app="AngularStore"&gt;
  &lt;head&gt;
 ...
</pre>

<p>Notice the following important points:</p>

<ol>
	<li>The <strong>“ng-app”</strong> attribute associates the page with the <strong>AngularStore</strong> module defined in the <strong>app.js</strong> file. This attribute takes care of the URL routing, view injection, and providing each view with the appropriate controllers.</li>
	<li>The <strong>“ng-view”</strong> div marks the place where <strong>AngularJS</strong> will inject the partial pages that correspond to the routed views. Recall that our application has three partial pages: <strong>store.htm</strong>, <strong>product.htm</strong>, and <strong>shoppingCart.htm</strong>.</li>
	<li>The parts of the page around the <strong>“ng-view”</strong> div remain in place as you switch views, acting as a master page. In this sample, this area shows the app logo and a title.</li>
	<li>The sample application uses <strong>Bootstrap</strong>, twitter’s 
public framework that includes powerful and easy to use css styles. 
Bootstrap makes it easy to create adaptive layouts that work well on the
 desktop and on mobile devices (for details, see <a href="http://twitter.github.io/bootstrap/">http://twitter.github.io/bootstrap/</a>).</li>
</ol>

<p>The <strong>store.htm</strong> partial view uses the <strong>getTotalCount</strong> and <strong>getTotalPrice</strong>
 methods to retrieve the cart information. Clicking this element 
redirects the browser to “default.htm#/cart”, which shows the shopping 
cart. <strong>Bootstrap</strong> includes a set of 140 icons that cover a lot of common scenarios (see the complete list here: <a href="http://twitter.github.io/bootstrap/base-css.html#icons">http://twitter.github.io/bootstrap/base-css.html#icons</a>).</p>

<p>The body of the layout uses an <strong>ng-repeat</strong> attribute 
to show a sorted, filtered list of all products. Each product row 
contains an image, a description that is also a link to the product 
details view, the product price, and a link that adds the product to the
 shopping cart. Adding items to the cart is accomplished by using the <strong>“ng-click”</strong> attribute to invoke the cart’s <strong>addItem</strong> method.</p>

<p>The “orderBy” and “filter” clauses are filters provided by <strong>AngularJS</strong>. You can learn more about AngularJS filters here: <a href="http://egghead.io/video/rough-draft-angularjs-built-in-filters/">http://egghead.io/video/rough-draft-angularjs-built-in-filters/</a></p>

<p>The last row is a copy of the first. It shows another summary of the 
cart below the product list, making navigation easier in stores that 
have a lot of products.</p>

<p>The <strong>product.htm</strong> partial view is very similar, as is the shopping cart itself, in <strong>shoppingCart.htm.</strong></p>

<p>The item quantity is shown using a composite element made up of an input field bound to the <strong>item.quantity</strong> property and two buttons used to increment or decrement the quantity.</p>

<p>Notice how the <strong>“ng-change”</strong> attribute is used to save
 the cart contents when the quantity changes. Notice also how the 
decrement button is disabled when the item quantity reaches one. At this
 point, decrementing the quantity would remove the item from the cart, 
and we don’t want users to do that by accident.</p>

<p>After the quantity field, the table shows the total price of the item
 (unit price times quantity) and a button that allows users to remove 
the item from the cart.</p>

<p>The “clear cart” button invokes the cart’s <strong>clearItems</strong> method, and is enabled only if the cart is not already empty.</p>

<pre lang="html">&lt;p class="text-info"&gt;
  &lt;button
    class="btn btn-block btn-primary"
    ng-click="cart.checkout('PayPal')"
    ng-disabled="cart.getTotalCount() &lt; 1"&gt;
    &lt;i class="icon-ok icon-white" /&gt; check out using PayPal
  &lt;/button&gt;
  &lt;button 
    class="btn btn-block btn-primary" 
    ng-click="cart.checkout('Google')" 
    ng-disabled="cart.getTotalCount() &lt; 1"&gt;
    &lt;i class="icon-ok icon-white" /&gt; check out using Google
  &lt;/button&gt;
&lt;/p&gt;
</pre>

<p>The checkout buttons call the cart’s <strong>checkout</strong> method passing in the appropriate service name. Remember we configured the cart in the <strong>app.js</strong> file to accept PayPal and Google as valid payment service providers.</p>

<pre lang="html">&lt;p class="text-info"&gt;
  &lt;button 
    class="btn btn-block btn-link"
    ng-click="cart.checkout('PayPal')"
    ng-disabled="cart.getTotalCount() &lt; 1" &gt;
    &lt;img
      src=https://www.paypal.com/en_US/i/btn/btn_xpressCheckout.gif
      alt="checkout PayPal"/&gt;
  &lt;/button&gt;
  &lt;button 
    class="btn btn-block btn-link" 
    ng-click="cart.checkout('Google')" 
    ng-disabled="cart.getTotalCount() &lt; 1" &gt;
    &lt;img
      src=https://checkout.google.com/buttons/checkout.gif?... 
      alt="checkoutGoogle"/&gt;
  &lt;/button&gt;
&lt;/p&gt;
</pre>

<p>These buttons provides the same cart checkout services, but use 
images provided by PayPal and Google. Personally, I think the provider 
buttons may look a little less consistent on the page, but provide a 
familiar feeling to the user.</p>

<p>The nice thing about <strong>Bootstrap’s</strong> layout mechanism is
 that it is ‘adaptive’. If you view the page on mobile devices, the 
layout automatically adapts to the screen width. The screenshots below 
illustrate this. The image on the left shows a wide view, with buttons 
on the right of the items (typical desktop view). The image on the right
 shows a narrow view, with buttons below the items (typical mobile 
view).</p>

<h2 id="sec13">Conclusion</h2>

<p>I can recommend a series of videos on AngularJS created by John Lindquist which you can find here: <a href="http://www.youtube.com/user/johnlindquist">http://www.youtube.com/user/johnlindquist</a>.</p>

<p>I also like <strong>Bootstrap</strong>, because it makes it easy to create attractive, responsive HTML layouts. In addition to a nice set of styles and icons, <strong>Bootstrap</strong>
 also provides some JavaScript components that you can use to enhance 
your UIs with things like tooltips, pop-overs, menus, etc. You can learn
 about <strong>Bootstrap</strong> here: <a href="http://twitter.github.io/bootstrap/">http://twitter.github.io/bootstrap/</a>.</p>

<p>There are a number of additional features I plan on adding in the 
next week or so like a nice-looking Dialog for display images in a 
variety of different ways, additional Pinterest styled Layouts to work 
better with AngularJS, more features to aid product displays and 
selling, and many more goodies. &nbsp;And I will also be posting a 
version of this shopping cart written using AngularJS 2.0 in the next 
few weeks.&nbsp;<br>
<br>
You can always get the latest cod efor this project on my website at: <a href="http://www.software-rus.com/">www.Software-rus.com</a></p>

<p>&nbsp;</p>



</span>
<!-- End Article -->




</div> 


</body></html>
