package com.ingecys.intranet_v2.controller;

import com.ingecys.intranet_v2.DTO.ObjectMetierRequest;
import com.ingecys.intranet_v2.DTO.ObjectMetierResponse;
import com.ingecys.intranet_v2.service.ObjectMetierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/objects")
@RequiredArgsConstructor
public class ObjectMetierController {
    private final ObjectMetierService objectMetierService;

    @PostMapping
    public ResponseEntity<ObjectMetierResponse> creer(
            @RequestBody ObjectMetierRequest request,
            Authentication auth){
        return ResponseEntity.ok
                (objectMetierService.creer(request,auth.getName())
                );}

    @GetMapping
    public ResponseEntity<List<ObjectMetierResponse>> ListerTous()
    {
        return  ResponseEntity.ok(objectMetierService.ListerTous());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ObjectMetierResponse> obtenirParId(@PathVariable Long id){
        return ResponseEntity.ok(objectMetierService.obtenirParId(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ObjectMetierResponse> changerStatus(
            @PathVariable Long id,
            @RequestParam String status
    ){
        return ResponseEntity.ok(
                objectMetierService.changerStatus(id,status)
        );
    }

    @GetMapping("/type/{typeObject}")
    public ResponseEntity<List<ObjectMetierResponse>> listerparType(
            @PathVariable String typeObject
    ){return ResponseEntity.ok(objectMetierService.ListerParType(typeObject));}



    @GetMapping("/mes-objets")
    public ResponseEntity<List<ObjectMetierResponse>> mesObjets(
            Authentication auth){
        String email=auth.getName();
        return ResponseEntity.ok(objectMetierService.ListerParUtilisateur(email));
    }
}


