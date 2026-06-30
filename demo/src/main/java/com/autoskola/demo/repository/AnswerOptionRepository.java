package com.autoskola.demo.repository;

import com.autoskola.demo.model.AnswerOption;
import com.autoskola.demo.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface AnswerOptionRepository extends JpaRepository<AnswerOption, Long> {
    List<AnswerOption> findByQuestion(Question question);
}
