import http from "../http-common";

class OrderService {
  getAll(params) {
    return http.get("/orders", { params });
  }

  get(id) {
    return http.get(`/orders/${id}`);
  }

  create(data) {
    return http.post("/orders", data);
  }

  update(id, data) {
    return http.put(`/orders/${id}`, data);
  }

  updateStatus(id, status, data) {
    return http.put(`/orders/${id}/${status}`, data);
  }

  delete(id) {
    return http.delete(`/orders/${id}`);
  }

  deleteAll() {
    return http.delete("/orders");
  }
}

export default new OrderService();
