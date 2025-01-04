async function getProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  document.getElementById("loading").style.display = "block";

  try {
    const response = await axios.get(
      `https://fakestoreapi.com/products/${productId}`
    );
    const product = response.data;

    displayProduct(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

function displayProduct(product) {
  const productTitle = document.getElementById("product-title");
  const productList = document.getElementById("product-list");
  productTitle.textContent = product.title;
  productList.innerHTML = `
                <div class="col-md-6">
                    <img src="${product.image}" class="img-fluid" style="height: 400px;">
                </div>
                <div class="col-md-6">
                    <p>${product.description}</p>
                    <p class="fw-bold text-danger">$${product.price}</p>
                    <button onclick="addToCart(${product.id}, '${product.title}', '${product.image}', ${product.price})" class="btn btn-success">Add to Cart</button>
                </div>
            `;
}
function addToCart(id, title, image, price) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, title, image, price, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
}
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = cartCount;
}
getProductDetail();
