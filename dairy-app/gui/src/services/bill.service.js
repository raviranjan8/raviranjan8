import http from "../http-common";

class BillService {
  getAll(params) {
    return http.get("/bills", { params });
  }

  generateBillsCollection(params) {
    return http.get("/generateBillsCollection",{params});
  }
  
  validateCollectionBillsGeneration(type,params) {
    return http.get(`/generateBillsCollection/${type}`,{params});
}

  generateBills(params) {
    return http.get("/generateBills", { params });
  }
  
  validateBillGeneration(month,type) {
    return http.get(`/generateBills/${month}/${type}`);
  }

  get(id) {
    return http.get(`/bills/${id}`);
  }

  create(data) {
    return http.post("/bills", data);
  }

  update(id, data) {
    return http.put(`/bills/${id}`, data);
  }

  delete(id) {
    return http.delete(`/bills/${id}`);
  }

  deleteAll() {
    return http.delete("/bills");
  }
}

export default new BillService();
