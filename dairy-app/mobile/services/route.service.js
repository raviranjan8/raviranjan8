import http from "../http-common";

class RouteService {
  getAll(params) {
    return http.get("/routes", { params });
  }

  get(id) {
    return http.get(`/routes/${id}`);
  }

  create(data) {
    return http.post("/routes", data);
  }

  update(id, data) {
    return http.put(`/routes/${id}`, data);
  }

  delete(id) {
    return http.delete(`/routes/${id}`);
  }

  deleteAll() {
    return http.delete("/routes");
  }
}

export default new RouteService();
