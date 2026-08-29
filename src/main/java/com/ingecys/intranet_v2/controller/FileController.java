package com.ingecys.intranet_v2.controller;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    
    @PostConstruct
    public void init() throws IOException {
        Path path = Paths.get(uploadDir);
        if (!Files.exists(path)) Files.createDirectories(path);
    }


    private String getExtension(String fileName) {
        if(fileName==null || !fileName.contains(".") ) return "bin";
        return fileName.substring(fileName.lastIndexOf(".")+1).toLowerCase();
    }

    //uppoead
    
    @PostMapping("/upload")
    public ResponseEntity<Map<String,Object>> upload(@RequestParam("file") MultipartFile file)  {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "file is empty"));
            
        }
        
        try {
            String ext=getExtension(file.getOriginalFilename());
            String nomFichier= UUID.randomUUID()+"."+ext;
            Path dest = Paths.get(uploadDir).resolve(nomFichier);

            Files.copy(file.getInputStream(),dest, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok(Map.of(
                    "url",baseUrl+"/api/files/"+nomFichier,//http://localhost:8080/api/files/xxxxx.png.
                    "nomFichier", file.getOriginalFilename(),
                    "typeFichier",file.getContentType()!=null?file.getContentType():"application/octet-stream",
                    "tailleKo",(int) (file.getSize()/1024)
            ));

        }catch(IOException e){
            return ResponseEntity.internalServerError().body(Map.of("error",e.getMessage()));
        }

    }

    //download

    @GetMapping("/{nomFichier:.+}")
    public ResponseEntity<Resource> download(@PathVariable String nomFichier){
        try{
            Path filePath=Paths.get(uploadDir).resolve(nomFichier).normalize();
            Resource resource=new UrlResource(filePath.toUri());

            if(!resource.exists()){
                return ResponseEntity.notFound().build();
            }

            String contentType=Files.probeContentType(filePath);

            if(contentType==null) contentType="application/octet-stream";
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,"inline; filename=\""+nomFichier+"\"")
                    .body(resource);




        }catch(MalformedURLException e){
            return  ResponseEntity.badRequest().build();
        }catch(IOException e){
            return ResponseEntity.internalServerError().build();
        }

    }









}
