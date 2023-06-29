import http from "../http-common";

class StockService {
  getAll(params) {
    return http.get("/stocks", { params });
  }

  get(id) {
    return http.get(`/stocks/${id}`);
  }

  create(data) {
    return http.post("/stocks", data);
  }

  update(id, data) {
    return http.put(`/stocks/${id}`, data);
  }

  delete(id) {
    return http.delete(`/stocks/${id}`);
  }

  deleteAll() {
    return http.delete("/stocks");
  }
}

export default new StockService();
