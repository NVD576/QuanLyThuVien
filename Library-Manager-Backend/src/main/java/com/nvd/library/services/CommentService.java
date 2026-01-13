package com.nvd.library.services;

import com.nvd.library.dto.CommentDTO;
import com.nvd.library.pojo.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommentService {
    Page<Comment> getAllComments(Pageable pageable);
    Comment getCommentById(int commentId);
    List<Comment> getCommentByUserId(int id);
    List<Comment> getCommentByBookId(int bookId);
    Comment addComment(Comment comment);
    Comment updateComment(Comment comment);
    void deleteComment(int commentId);
}
