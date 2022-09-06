import http from "../http-common";

class DeliveryService {
  getAll(params) {
    return http.get("/dailyBills", { params });
  }

  get(id) {
    return http.get(`/dailyBills/${id}`);
  }

  create(data) {
    return http.post("/dailyBills", data);
  }

  //separate create method for duplicate save case
  createDelivery(data) {
    return http.post("/dailyBills/delivery", data);
  }

  update(id, data) {
    return http.put(`/dailyBills/${id}`, data);
  }

  delete(id) {
    return http.delete(`/dailyBills/${id}`);
  }

  deleteAll() {
    return http.delete("/dailyBills");
  }
}

export default new DeliveryService();
