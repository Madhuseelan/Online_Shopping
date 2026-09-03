const API_URL = "http://127.0.0.1:8000/api/products/";

// Get all products
export async function getProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return response.json();
}


// Get one product
export async function getProduct(id) {
  const response = await fetch(`${API_URL}${id}/`);

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status}`);
  }

  return response.json();
}


// Create product
export async function createProduct(product) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Create product error:", errorData);

    throw new Error(`Failed to create product: ${response.status}`);
  }

  return response.json();
}


// Update entire product
export async function updateProduct(id, product) {
  const response = await fetch(`${API_URL}${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Update product error:", errorData);

    throw new Error(`Failed to update product: ${response.status}`);
  }

  return response.json();
}


// Partially update product
export async function patchProduct(id, product) {
  const response = await fetch(`${API_URL}${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Patch product error:", errorData);

    throw new Error(`Failed to update product: ${response.status}`);
  }

  return response.json();
}


// Delete product
export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete product: ${response.status}`);
  }

  return true;
}