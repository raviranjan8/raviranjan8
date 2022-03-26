import http from "../http-common";

class RouteStockService {
  getAll(params) {
    return http.get("/routeStocks", { params });
  }

  get(id) {
    return http.get(`/routeStocks/${id}`);
  }

  create(data) {
    return http.post("/routeStocks", data);
  }

  update(id, data) {
    return http.put(`/routeStocks/${id}`, data);
  }

  delete(id) {
    return http.delete(`/routeStocks/${id}`);
  }

  deleteAll() {
    return http.delete("/routeStocks");
  }
}

export default new RouteStockService();
