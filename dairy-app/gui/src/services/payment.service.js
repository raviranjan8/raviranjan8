import http from "../http-common";

class PaymentService {
  getAll(params) {
    return http.get("/payments", { params });
  }

  get(id) {
    return http.get(`/payments/${id}`);
  }

  create(data) {
    return http.post("/payments", data);
  }

  update(id, data) {
    return http.put(`/payments/${id}`, data);
  }

  delete(id) {
    return http.delete(`/payments/${id}`);
  }

  deleteAll() {
    return http.delete("/payments");
  }
}

export default new PaymentService();
