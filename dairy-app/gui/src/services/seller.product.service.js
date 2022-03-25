import http from "../http-common";

class SellerProductService {
  getAll(params) {
    return http.get("/sellerProducts", { params });
  }

  get(id) {
    return http.get(`/sellerProducts/${id}`);
  }

  create(data) {
    return http.post("/sellerProducts", data);
  }

  update(id, data) {
    return http.put(`/sellerProducts/${id}`, data);
  }

  delete(id) {
    return http.delete(`/sellerProducts/${id}`);
  }

  deleteAll() {
    return http.delete("/sellerProducts");
  }
}

export default new SellerProductService();
