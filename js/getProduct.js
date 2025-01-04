const cart = JSON.parse(localStorage.getItem("cart")) || [];
document.getElementById("loading").style.display = "block";
function updateCartCount() {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = cartCount;
}

async function getProducts() {
  try {
    const response = await axios.get(
      "https://fakestoreapi.com/products?limit=8"
    );
    productData = response.data;
    displayProducts(productData);
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}
function displayProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = products
    .map(
      (product) => `
        <div class="col-md-6 col-lg-3">
          <div class="card h-100 p-3 shadow-lg">
            <img src="${product.image}" class="card-img-top" alt="${
        product.title
      }" style="height: 300px;">
            <div class="card-body">
              <h5 class="card-title">${product.title.substring(0, 30)}...</h5>
              <p class="card-text">${product.description.substring(
                0,
                50
              )}...</p>
              <p class="card-text text-danger fw-bold">$${product.price}</p>
              
            </div>
            <div>
                <button class="btn btn-success" onclick="addToCart(${product.id}, '${product.title}', '${product.image}', ${product.price})">Add to Cart</button>
                <a href="detailProduct.html?id=${product.id}" class="btn btn-primary">View Detail</a>
              </div>
          </div>
        </div>
      `
    )
    .join("");
}
function searchProducts(query) {
  const filteredProducts = productData.filter((product) =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );
  displayProducts(filteredProducts);
}
document.getElementById("search-input").addEventListener("input", (e) => {
  const searchQuery = e.target.value;
  searchProducts(searchQuery);
});
function addToCart(id, title, image, price) {
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, title, image, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
}

getProducts();

updateCartCount();
