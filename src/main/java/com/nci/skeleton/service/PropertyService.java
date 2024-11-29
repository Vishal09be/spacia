package com.nci.skeleton.service;

import com.google.gson.Gson;
import com.nci.skeleton.entity.Property;
import com.nci.skeleton.model.ResponseModel;
import com.nci.skeleton.repository.PropertyRepository;
import com.nci.skeleton.repository.UserRepository;
import com.nci.skeleton.security.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import static com.nci.skeleton.config.Constants.STATUS_ACTIVE;
import static java.util.Objects.nonNull;


@Service
public class PropertyService {

    @Autowired
    PropertyRepository propertyRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    SQSService sqsService;

    public List<Property> fetchProducts() {
        return propertyRepository.findByStatus(STATUS_ACTIVE);
    }

    public List<Property> fetchMyProducts(String userId) {
        return propertyRepository.findByStatusAndPostedBy(STATUS_ACTIVE, userId);
    }

    @Value("${s3ImageUrl}")
    private String s3ImageUrl;

    public ResponseModel saveProduct(Property property, String userName) {
        ResponseModel response = new ResponseModel();
        try {
            property.setId(UUID.randomUUID());
            property.setStatus("A");
            property.setPostedOn(LocalDateTime.now());
            property.setPostedBy(userName);
            propertyRepository.save(property);
            response.setStatus("Success");
            response.setMessage("Operation Successful");
            response.setCreationId(property.getId().toString());
        } catch (Exception e) {
            response.setException(e.getLocalizedMessage());
        }
        return response;
    }

    public ResponseModel updateProduct(UUID propertyId, Property property, String userName) {
        ResponseModel response = new ResponseModel();
        try {
            propertyRepository.findById(propertyId).ifPresent(
                    savedProperty -> {
                        if (savedProperty.getPostedBy().equals(userName)) {
                            setUpdatedValues(savedProperty, property);
                            propertyRepository.save(savedProperty);
                            response.setStatus("Success");
                            response.setMessage("Operation Successful");
                        } else {
                            response.setStatus("Unsuccessful");
                            response.setMessage("Operation Unsuccessful : Not Authorized To Update This Property");
                        }
                    }
            );
        } catch (Exception e) {
            response.setStatus("Unsuccessful");
            response.setMessage("Exception Occurred");
            response.setException(e.getLocalizedMessage());
        }
        return response;
    }

    private void setUpdatedValues(Property property, Property updatedProp) {
        if (nonNull(updatedProp.getAddress()))
            property.setAddress(updatedProp.getAddress());

        if (nonNull(updatedProp.getArea()))
            property.setArea(updatedProp.getArea());

        if (nonNull(updatedProp.getAmenities()))
            property.setAmenities(updatedProp.getAmenities());

        if (nonNull(updatedProp.getName()))
            property.setName(updatedProp.getName());

        if (nonNull(updatedProp.getRent()))
            property.setRent(updatedProp.getRent());

        if (nonNull(updatedProp.getDeposit()))
            property.setDeposit(updatedProp.getDeposit());

        if (nonNull(updatedProp.getPostalCode()))
            property.setPostalCode(updatedProp.getPostalCode());

        if (nonNull(updatedProp.getEircode()))
            property.setEircode(updatedProp.getEircode());

        if (nonNull(updatedProp.getDescription()))
            property.setDescription(updatedProp.getDescription());

        if (nonNull(updatedProp.getAvailableFrom()))
            property.setAvailableFrom(updatedProp.getAvailableFrom());

        if (nonNull(updatedProp.getEnergyRatings()))
            property.setEnergyRatings(updatedProp.getEnergyRatings());

        if (nonNull(updatedProp.getBedrooms()))
            property.setBedrooms(updatedProp.getBedrooms());

        if (nonNull(updatedProp.getBathrooms()))
            property.setBathrooms(updatedProp.getBathrooms());

        property.setModifiedOn(LocalDateTime.now());
    }

    public ResponseModel inactiveProperty(UUID propertyId, String userName) {
        ResponseModel response = new ResponseModel();
        try {
            propertyRepository.findById(propertyId).ifPresent(
                    savedProperty -> {
                        if (savedProperty.getPostedBy().equals(userName)) {
                            savedProperty.setStatus("I");
                            propertyRepository.save(savedProperty);
                            response.setStatus("Success");
                            response.setMessage("Operation Successful");
                        } else {
                            response.setStatus("Unsuccessful");
                            response.setMessage("Operation Unsuccessful : Not Authorized To Update This Property");
                        }
                    }
            );
        } catch (Exception e) {
            response.setStatus("Unsuccessful");
            response.setMessage("Exception Occurred");
            response.setException(e.getLocalizedMessage());
        }
        return response;
    }

    @Transactional
    public void updateImageUrl(String propertyId, String fileKey) {
        propertyRepository.findById(UUID.fromString(propertyId)).ifPresent(
                product -> {
                    if (nonNull(product.getImages())) {
                        product.getImages().add(s3ImageUrl + fileKey);
                    } else {
                        product.setImages(List.of(s3ImageUrl + fileKey));
                    }
                    propertyRepository.save(product);
                }
        );
    }

    public ResponseModel emailPropertyOwner(UUID productId, String userName) {
        ResponseModel response = new ResponseModel();
        Property prod = propertyRepository.findById(productId).orElse(null);
        User productUser = null;
        if (nonNull(prod)) {
            productUser = userRepository.findByUsername(prod.getPostedBy()).orElse(null);
        }
        User enquiryUser = userRepository.findByUsername(userName).orElse(null);
        if (nonNull(productUser) && nonNull(enquiryUser)) {
            sendEmail(productUser, enquiryUser, prod);
        }
        response.setStatus("Success");
        response.setMessage("Operation Successful");
        return response;
    }

    private void sendEmail(User propertyOwner, User enquiryUser, Property property) {
        String messageBody = new Gson().toJson(new HashMap<String, String>() {{
            put("recipient", propertyOwner.getEmail());
            put("body", "Dear " + propertyOwner.getFirstname() + " " + propertyOwner.getLastname() + ",\n\n" +
                    "We hope this message finds you well. We are reaching out to inform you that there is a new inquiry for your property listed on Spacia:\n\n" +
                    "**Property Name:** " + property.getName() + "\n" +
                    "**Property Location:** " + property.getAddress() + "\n\n" +
                    "Here are the details of the user who has expressed interest in your property:\n" +
                    "**Name:** " + enquiryUser.getFirstname() + " " + enquiryUser.getLastname() + "\n" +
                    "**Email:** " + enquiryUser.getEmail() + "\n\n\n" +
                    "You can reach out to the enquirer directly to discuss further details or respond to their inquiry via your Spacia dashboard.\n\n" +
                    "If you have any questions or need assistance, please contact our support team at support@spacia.com or call us at +353 899 899 899.\n\n" +
                    "Thank you for using Spacia to list your property. We are here to make the process seamless and efficient for you!\n\n" +
                    "Best regards,\n" +
                    "Team Spacia");
            put("subject", "New Inquiry for Your Property: " + property.getName());
        }});

        sqsService.sendSqsMessage(messageBody);
    }
}
