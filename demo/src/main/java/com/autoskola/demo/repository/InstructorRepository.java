package com.autoskola.demo.repository;

import com.autoskola.demo.model.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {

    @Query("SELECT i FROM Instructor i WHERE i.status != com.autoskola.demo.model.InstructorStatus.ARCHIVED")
    List<Instructor> findAllActiveInstructors();
}
