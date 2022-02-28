import http from "../http-common";

class CustomerService {
  getAll(params) {
    return http.get("/partys", { params });
  }

  get(id) {
    return http.get(`/partys/${id}`);
  }

  create(data) {
    return http.post("/partys", data);
  }

  update(id, data) {
    return http.put(`/partys/${id}`, data);
  }

  updateMobNo(id, mobNo, data) {
    return http.put(`/partys/${id}/${mobNo}`, data);
  }

  delete(id) {
    return http.delete(`/partys/${id}`);
  }

  deleteAll() {
    return http.delete("/partys");
  }
}

export default new CustomerService();
