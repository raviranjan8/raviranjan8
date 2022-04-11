import http from "../http-common";

class UploadFilesService {
  upload(file, prefix) {
    let formData = new FormData();
    
    formData.append("file", file);
    formData.append("prefix", prefix);
  
    return http.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }      
    });
  }

  getFiles() {
    return http.get("/files");
  }
}

export default new UploadFilesService();
