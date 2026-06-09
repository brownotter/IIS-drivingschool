package com.autoskola.demo.repository;

import com.autoskola.demo.model.DocsVersion;
import com.autoskola.demo.model.Documents;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocsVersionRepository extends JpaRepository<DocsVersion, Long> {
    List<DocsVersion> findByDocumentOrderByChangeTimeDesc(Documents document);
}