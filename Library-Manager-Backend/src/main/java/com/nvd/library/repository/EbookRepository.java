package com.nvd.library.repository;

import com.nvd.library.pojo.Ebook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EbookRepository extends JpaRepository<Ebook,Integer> {
}
