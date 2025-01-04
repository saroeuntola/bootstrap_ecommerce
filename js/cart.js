const cart = JSON.parse(localStorage.getItem("cart")) || []; // Load cart from localStorage

function renderCart() {
  const cartTableBody = document.querySelector("#cart-table tbody");
  const grandTotalElement = document.getElementById("grand-total");
  let grandTotal = 0;

  cartTableBody.innerHTML = "";

  cart.forEach((item) => {
    const total = item.price * item.quantity;
    grandTotal += total;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${item.image}" alt="${
      item.title
    }" style="width: 50px; height: 50px; object-fit: cover;"></td>
      <td>${item.title}</td>
      <td>$${item.price}</td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${
          item.id
        }, -1)">-</button>
        ${item.quantity}
        <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${
          item.id
        }, 1)">+</button>
      </td>
      <td>$${total.toFixed(2)}</td>
      <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${
        item.id
      })">Remove</button></td>
    `;
    cartTableBody.appendChild(row);
  });

  grandTotalElement.textContent = `$${grandTotal.toFixed(2)}`;

  renderPaypalButton(grandTotal); // Render PayPal button after updating the cart
}

function changeQuantity(id, delta) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  }
}

const removeFromCart = (id) => {
  const itemIndex = cart.findIndex((cartItem) => cartItem.id === id);

  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
    if (cart.length === 0) {
      localStorage.removeItem("cart");
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    renderCart();
  }
};

function clearCart() {
  cart.length = 0;
  localStorage.removeItem("cart");
  renderCart();
}

function renderPaypalButton(grandTotal) {
   const paypalButtonContainer = document.getElementById(
     "paypal-button-container"
   );
   paypalButtonContainer.innerHTML = "";
  paypal
    .Buttons({
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: grandTotal,
                currency_code: "USD",
              },
            },
          ],
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          alert("Payment completed by " + details.payer.name.given_name);
          clearCart();
        });
      },
      onError: function (err) {
        console.error("PayPal error:", err);
      },
    })
    .render("#paypal-button-container");
}

document.addEventListener("DOMContentLoaded", function () {
  renderCart(); 
});
