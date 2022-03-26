import http from "../http-common";

class RateService {
  getAll(params) {
    return http.get("/rates", { params });
  }

  get(id) {
    return http.get(`/rates/${id}`);
  }

  create(data) {
    return http.post("/rates", data);
  }

  update(id, data) {
    return http.put(`/rates/${id}`, data);
  }

  delete(id) {
    return http.delete(`/rates/${id}`);
  }

  deleteAll() {
    return http.delete("/rates");
  }
}

export default new RateService();
