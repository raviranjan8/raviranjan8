import http from "../http-common";

class ProductService {
  getAll(params) {
    return http.get("/products", { params });
  }

  get(id) {
    return http.get(`/products/${id}`);
  }

  create(data) {
    return http.post("/products", data);
  }

  update(id, data) {
    return http.put(`/products/${id}`, data);
  }

  delete(id) {
    return http.delete(`/products/${id}`);
  }

  deleteAll() {
    return http.delete("/products");
  }
}

export default new ProductService();
