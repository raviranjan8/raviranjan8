package com.dairy.service;

import java.nio.file.Path;
import java.util.stream.Stream;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

@Configuration
public interface FilesStorageService {
  public void init();

  public void save(MultipartFile file, String prefix);

  public Resource load(String filename);

  public void deleteAll();

  public Stream<Path> loadAll();
}
