package com.nvd.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Book_Author")
@IdClass(BookAuthorId.class)
public class BookAuthor {
    @Id
    @Column(name = "BookID")
    private Integer bookId;

    @Id
    @Column(name = "AuthorID")
    private Integer authorId;
} 