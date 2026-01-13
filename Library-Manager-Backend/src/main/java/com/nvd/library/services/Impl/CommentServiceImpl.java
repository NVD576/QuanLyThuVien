package com.nvd.library.services.Impl;

import com.nvd.library.dto.CommentDTO;
import com.nvd.library.pojo.Comment;
import com.nvd.library.repository.CommentRepository;
import com.nvd.library.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public Page<Comment> getAllComments(Pageable pageable) {
        return commentRepository.findAll(pageable);
    }

    @Override
    public Comment getCommentById(int commentId) {
        return this.commentRepository.findById(commentId).orElse(null);
    }

    @Override
    public List<Comment> getCommentByUserId(int id) {
        return this.commentRepository.findByUserId(id);
    }

    @Override
    public List<Comment> getCommentByBookId(int bookId) {
        return this.commentRepository.findByBookId(bookId);
    }

    @Override
    public Comment addComment(Comment comment) {
        return this.commentRepository.save(comment);
    }

    @Override
    public Comment updateComment(Comment comment) {
        return this.commentRepository.save(comment);
    }

    @Override
    public void deleteComment(int commentId) {
        this.commentRepository.deleteById(commentId);
    }


}
