package com.nvd.library.pojo;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "ebook")
public class Ebook {
    @Id
    @Column(name = "ebook_id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Size(max = 50)
    @NotNull
    @Column(name = "file_format", nullable = false, length = 50)
    private String fileFormat;

    @Column(name = "file_size", precision = 10, scale = 2)
    private BigDecimal fileSize;

    @Size(max = 255)
    @NotNull
    @Column(name = "download_url", nullable = false)
    private String downloadUrl;

}