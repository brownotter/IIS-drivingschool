package com.autoskola.demo.repository;

import com.autoskola.demo.model.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByLicenceNumber(String licenceNumber);
    boolean existsByContact(String contact);

    boolean existsByUsernameAndIdNot(String username, Long id);
    boolean existsByEmailAndIdNot(String email, Long id);
    boolean existsByLicenceNumberAndIdNot(String licenceNumber, Long id);
    boolean existsByContactAndIdNot(String contact, Long id);
}
