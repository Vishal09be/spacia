package com.nci.skeleton.controller;

import com.nci.skeleton.entity.Property;
import com.nci.skeleton.model.ResponseModel;
import com.nci.skeleton.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/property")
public class PropertyController {

    @Autowired
    PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<Property>> getProducts(Principal principal) {
        return new ResponseEntity<>(propertyService.fetchProducts(), HttpStatus.OK);
    }

    @GetMapping("/myProducts")
    public ResponseEntity<List<Property>> getListedProducts(Principal principal) {
        return new ResponseEntity<>(propertyService.fetchMyProducts(principal.getName()), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ResponseModel> postProperty(@RequestBody Property product, Principal principal) {
        return new ResponseEntity<>(propertyService.saveProduct(product, principal.getName()), HttpStatus.CREATED);
    }

    @PutMapping("/{propertyId}")
    public ResponseEntity<ResponseModel> updateProperty(@PathVariable UUID propertyId,
                                                        @RequestBody Property property,
                                                        Principal principal) {
        return new ResponseEntity<>(propertyService.updateProduct(propertyId, property, principal.getName()), HttpStatus.OK);
    }

    @DeleteMapping("/{propertyId}")
    public ResponseEntity<ResponseModel> deleteProperty(@PathVariable UUID propertyId, Principal principal) {
        return new ResponseEntity<>(propertyService.inactiveProperty(propertyId, principal.getName()), HttpStatus.OK);
    }

    @PostMapping("/contact/{propertyId}")
    public ResponseEntity<ResponseModel> contactOwner(@PathVariable UUID propertyId, Principal principal) {
        return new ResponseEntity<>(propertyService.emailPropertyOwner(propertyId, principal.getName()), HttpStatus.CREATED);
    }
}
