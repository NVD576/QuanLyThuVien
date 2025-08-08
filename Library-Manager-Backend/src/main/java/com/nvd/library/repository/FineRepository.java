package com.nvd.library.repository;

import com.nvd.library.pojo.Ebook;
import com.nvd.library.pojo.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FineRepository extends JpaRepository<Fine,Integer> {
}
