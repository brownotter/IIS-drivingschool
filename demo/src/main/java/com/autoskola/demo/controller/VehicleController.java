    package com.autoskola.demo.controller;

    import com.autoskola.demo.dto.VehicleCreateDto;
    import com.autoskola.demo.dto.VehicleProfileDto;
    import com.autoskola.demo.dto.VehicleUpdateDto;
    import com.autoskola.demo.exception.AccessDeniedException;
    import com.autoskola.demo.model.User;
    import com.autoskola.demo.service.VehicleService;
    import jakarta.servlet.http.HttpSession;
    import jakarta.validation.Valid;
    import lombok.RequiredArgsConstructor;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;

    @RestController
    @RequestMapping("/vehicle")
    @RequiredArgsConstructor
    public class VehicleController {

        private final VehicleService vehicleService;

        private void checkAdminAccess(HttpSession session) {

            User loggedUser = (User) session.getAttribute("user");

            if(loggedUser == null || !loggedUser.getRole().name().equals("ADMIN")) {
                throw new AccessDeniedException();
            }
        }

        private void checkAdminOrInstructorAccess(HttpSession session) {
            User loggedUser = (User) session.getAttribute("user");

            if(loggedUser == null){
                throw new AccessDeniedException();
            }

            String role = loggedUser.getRole().name();
            if(!role.equals("ADMIN") && !role.equals("INSTRUCTOR")) {
                throw new AccessDeniedException();
            }
        }

        @GetMapping("/all")
        public ResponseEntity<List<VehicleProfileDto>> getAllVehicles(HttpSession session) {
            checkAdminOrInstructorAccess(session);

            User user = (User) session.getAttribute("user");
            boolean activeOnly = !user.getRole().name().equals("ADMIN");

            return ResponseEntity.ok(vehicleService.getAllVehicles(activeOnly));
        }

        @PostMapping
        public ResponseEntity<VehicleProfileDto> createVehicle(@Valid @RequestBody VehicleCreateDto dto, HttpSession session) {
            checkAdminAccess(session);
            return new ResponseEntity<>(vehicleService.createVehicle(dto), HttpStatus.CREATED);
        }

        @PutMapping("/{id}")
        public ResponseEntity<VehicleProfileDto> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleUpdateDto dto, HttpSession session) {
            checkAdminAccess(session);
            return ResponseEntity.ok(vehicleService.updateVehicle(id, dto));
        }

        @PatchMapping("/{id}/status")
        public ResponseEntity<VehicleProfileDto> updateVehicleStatus(@PathVariable Long id, @RequestParam String status, HttpSession session) {
            checkAdminOrInstructorAccess(session);
            return ResponseEntity.ok(vehicleService.updateVehicleStatus(id, status));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<VehicleProfileDto> deleteVehicle(@PathVariable Long id, HttpSession session) {
            checkAdminAccess(session);
            return ResponseEntity.ok(vehicleService.deleteVehicle(id));
        }
    }
